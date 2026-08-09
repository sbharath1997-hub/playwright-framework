import { test } from '../fixtures/googlePhotosTest';
import type { GooglePhotosScanOutput } from '../models/googlePhotosStorageModels';
import { GooglePhotosStoragePage } from '../pages/googlePhotosStoragePage';
import { filterRecordsByDateRange, readDateRangeFromEnv } from '../utils/dateRange';
import { GooglePhotosScanner } from '../utils/googlePhotosScanner';
import { createGooglePhotosLocalRunReporter, writeGooglePhotosRawJsonReport } from '../utils/googlePhotosReportWriter';

test.skip(process.env.CI === 'true', 'Google Photos scans are local-only and must not run in public CI.');
test.skip(
  process.env.GOOGLE_PHOTOS_READONLY_ACK !== 'true',
  'Set GOOGLE_PHOTOS_READONLY_ACK=true to confirm this local read-only scan.'
);

test.describe('@manual @readonly @google-photos Google Photos Storage Cleanup Assistant', () => {
  test.setTimeout(45 * 60 * 1000);

  test('collects Large photos and videos metadata without selecting media', async ({
    googlePhotosPage,
    googlePhotosSession,
  }) => {
    const startedAt = new Date().toISOString();
    const scanRunId = `google-photos-${startedAt.replace(/[:.]/g, '-')}`;
    const runReporter = createGooglePhotosLocalRunReporter(scanRunId);
    const dateRange = readDateRangeFromEnv(process.env);
    const options = {
      ...dateRange,
      maxScrollCycles: Number(process.env.GOOGLE_PHOTOS_MAX_SCROLL_CYCLES ?? 120),
      stopAfterNoNewCycles: Number(process.env.GOOGLE_PHOTOS_STOP_AFTER_NO_NEW_CYCLES ?? 5),
    };

    runReporter.log('run', 'Google Photos read-only scan run started.', {
      browserName: googlePhotosSession.browserName,
      authMode: googlePhotosSession.authMode,
      maxScrollCycles: options.maxScrollCycles,
      stopAfterNoNewCycles: options.stopAfterNoNewCycles,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    });

    try {
      const storagePage = new GooglePhotosStoragePage(googlePhotosPage, runReporter.log);
      await storagePage.openGooglePhotos();
      const authenticatedDuringRun = await storagePage.waitForManualAuthenticationIfNeeded();

      if (googlePhotosSession.authMode === 'storageState' && (authenticatedDuringRun || !googlePhotosSession.hadExistingStorageState)) {
        runReporter.log('auth', 'Saving Playwright storageState for future storageState runs.', {
          path: googlePhotosSession.storageStatePath,
        });
        await googlePhotosSession.saveStorageState();
      } else if (authenticatedDuringRun) {
        runReporter.log('auth', 'Authentication is retained by the dedicated local browser profile for this browser mode.', {
          path: googlePhotosSession.persistentProfilePath,
        });
      }

      await storagePage.openStorageManagement();
      const authenticatedAfterStorageNavigation = await storagePage.waitForManualAuthenticationIfNeeded();

      if (googlePhotosSession.authMode === 'storageState' && authenticatedAfterStorageNavigation) {
        runReporter.log('auth', 'Saving Playwright storageState after storage-management login.', {
          path: googlePhotosSession.storageStatePath,
        });
        await googlePhotosSession.saveStorageState();
        await storagePage.openStorageManagement();
      } else if (authenticatedAfterStorageNavigation) {
        runReporter.log('auth', 'Storage-management authentication is retained by the dedicated local browser profile.', {
          path: googlePhotosSession.persistentProfilePath,
        });
        await storagePage.openStorageManagement();
      }

      await storagePage.validateStorageManagementReady();
      await storagePage.openLargePhotosAndVideos();
      await storagePage.validateLargePhotosAndVideosReady();

      const scanner = new GooglePhotosScanner(googlePhotosPage, runReporter.log);
      const scanResult = await scanner.scanLargePhotosAndVideos(options);
      runReporter.log('filter', 'Applying date-range filter after collection.', {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });
      const filteredRecords = filterRecordsByDateRange(scanResult.records, dateRange);
      const finishedAt = new Date().toISOString();

      const output: GooglePhotosScanOutput = {
        schemaVersion: 1,
        run: {
          scanRunId,
          startedAt,
          finishedAt,
          sourceUrl: googlePhotosPage.url(),
          category: 'large-photos-videos',
          authMode: googlePhotosSession.authMode,
          browserName: googlePhotosSession.browserName,
          storageStatePath: googlePhotosSession.storageStatePath,
          persistentProfilePath: googlePhotosSession.persistentProfilePath,
          ...(googlePhotosSession.cdpEndpoint ? { cdpEndpoint: googlePhotosSession.cdpEndpoint } : {}),
        },
        options,
        totals: {
          observedCandidates: scanResult.observedCandidates,
          uniqueRecords: scanResult.records.length,
          filteredRecords: filteredRecords.length,
          duplicateObservations: scanResult.duplicateObservations,
          scrollCycles: scanResult.scrollCycles,
        },
        warnings: [
          ...scanResult.warnings,
          ...(dateRange.startDate || dateRange.endDate
            ? ['Date filtering was applied after collection using parsed UI dates only.']
            : []),
        ],
        records: scanResult.records,
        filteredRecords,
      };

      const outputPath = writeGooglePhotosRawJsonReport(output);
      runReporter.log('report', 'Google Photos read-only scan JSON written.', { path: outputPath });
    } catch (error) {
      runReporter.writeFailure({
        message: error instanceof Error ? error.message : String(error),
        ...(error instanceof Error && error.stack ? { stack: error.stack } : {}),
        currentUrl: googlePhotosPage.url(),
        pageTitle: await readPageTitleSafely(),
        visibleTextExcerpt: await readVisibleTextSafely(),
      });

      throw error;
    }

    async function readPageTitleSafely(): Promise<string | undefined> {
      try {
        return await googlePhotosPage.title();
      } catch {
        return undefined;
      }
    }

    async function readVisibleTextSafely(): Promise<string | undefined> {
      try {
        const text = await googlePhotosPage.locator('body').innerText({ timeout: 3000 });
        return text.replace(/\s+/g, ' ').trim().slice(0, 4000);
      } catch {
        return undefined;
      }
    }
  });
});

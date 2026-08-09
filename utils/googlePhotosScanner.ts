import { createHash } from 'crypto';
import type { Page } from '@playwright/test';
import type { GooglePhotosDomReference, GooglePhotosScanOptions, GooglePhotosScanRecord } from '../models/googlePhotosStorageModels';
import { parseDisplayedDate } from './dateRange';
import { extractVideoDuration, parseDurationToSeconds } from './duration';
import { extractDisplayedFileSize, parseFileSizeToBytes } from './fileSize';

type VisibleCandidate = {
  visibleText?: string;
  accessibleLabel?: string;
  domReference: GooglePhotosDomReference;
};

type GooglePhotosScannerProgressLogger = (phase: string, message: string, details?: Record<string, string | number | boolean | null | undefined>) => void;

export type GooglePhotosScannerResult = {
  records: GooglePhotosScanRecord[];
  observedCandidates: number;
  duplicateObservations: number;
  scrollCycles: number;
  warnings: string[];
};

export class GooglePhotosScanner {
  constructor(
    private readonly page: Page,
    private readonly logProgress: GooglePhotosScannerProgressLogger = () => {}
  ) {}

  async scanLargePhotosAndVideos(options: GooglePhotosScanOptions): Promise<GooglePhotosScannerResult> {
    const recordsByKey = new Map<string, GooglePhotosScanRecord>();
    const warnings: string[] = [];
    let observedCandidates = 0;
    let duplicateObservations = 0;
    let noNewCycles = 0;
    let scrollCycles = 0;

    this.logProgress('scan', 'Starting read-only scan.', {
      maxScrollCycles: options.maxScrollCycles,
      stopAfterNoNewCycles: options.stopAfterNoNewCycles,
    });

    for (let cycle = 0; cycle < options.maxScrollCycles; cycle += 1) {
      const candidates = await this.collectVisibleCandidates();
      let newRecordsThisCycle = 0;
      observedCandidates += candidates.length;

      for (const candidate of candidates) {
        const record = this.toScanRecord(candidate, recordsByKey.size + 1);

        if (recordsByKey.has(record.dedupeKey)) {
          duplicateObservations += 1;
          continue;
        }

        recordsByKey.set(record.dedupeKey, record);
        newRecordsThisCycle += 1;
      }

      if (newRecordsThisCycle === 0) {
        noNewCycles += 1;
      } else {
        noNewCycles = 0;
      }

      this.logProgress('scan', 'Visible media scan cycle completed.', {
        cycle: cycle + 1,
        visibleCandidates: candidates.length,
        newRecords: newRecordsThisCycle,
        uniqueRecords: recordsByKey.size,
        duplicateObservations,
        noNewCycles,
      });

      if (noNewCycles >= options.stopAfterNoNewCycles) {
        this.logProgress('scan', 'Stopping scan after repeated cycles with no new records.', {
          noNewCycles,
          stopAfterNoNewCycles: options.stopAfterNoNewCycles,
        });
        break;
      }

      const didScroll = await this.scrollOneViewport();
      scrollCycles += 1;

      this.logProgress('scan', didScroll ? 'Scrolled media list.' : 'No additional scroll movement detected.', {
        scrollCycles,
      });

      if (!didScroll) {
        noNewCycles += 1;
      }

      await this.page.waitForTimeout(500);
    }

    const records = Array.from(recordsByKey.values()).sort((left, right) => {
      return (right.sizeBytes ?? -1) - (left.sizeBytes ?? -1) || left.listPosition - right.listPosition;
    });

    if (records.length === 0) {
      warnings.push('No media records were collected. Validate the category page selector strategy against the live UI.');
    }

    this.logProgress('scan', 'Read-only scan completed.', {
      uniqueRecords: records.length,
      observedCandidates,
      duplicateObservations,
      scrollCycles,
    });

    return {
      records,
      observedCandidates,
      duplicateObservations,
      scrollCycles,
      warnings,
    };
  }

  private async collectVisibleCandidates(): Promise<VisibleCandidate[]> {
    const candidates = await this.page.locator('[role="listitem"], [role="gridcell"], [role="article"], a[href], div[aria-label]').evaluateAll((elements) => {
      const sizePattern = /\b\d+(?:[.,]\d+)?\s*(?:bytes?|b|kb|mb|gb|tb)\b/i;
      const durationPattern = /\b(?:(?:\d{1,2}):)?\d{1,2}:\d{2}\b/;

      return elements
        .map((element) => {
          const htmlElement = element as HTMLElement;
          const rect = htmlElement.getBoundingClientRect();
          const visible = rect.width > 24 && rect.height > 24 && rect.bottom > 0 && rect.right > 0;

          if (!visible) {
            return undefined;
          }

          const visibleText = htmlElement.innerText?.replace(/\s+/g, ' ').trim();
          const accessibleLabel = htmlElement.getAttribute('aria-label')?.replace(/\s+/g, ' ').trim();
          const title = htmlElement.getAttribute('title')?.replace(/\s+/g, ' ').trim();
          const anchor = htmlElement instanceof HTMLAnchorElement ? htmlElement : htmlElement.closest('a');
          const image = htmlElement.querySelector('img');
          const combinedText = [visibleText, accessibleLabel, title, image?.getAttribute('alt')]
            .filter(Boolean)
            .join(' ');

          if (!sizePattern.test(combinedText) && !durationPattern.test(combinedText)) {
            return undefined;
          }

          const dataAttributes: Record<string, string> = {};
          for (const attribute of Array.from(htmlElement.attributes)) {
            if (attribute.name.startsWith('data-')) {
              dataAttributes[attribute.name] = attribute.value;
            }
          }

          return {
            visibleText,
            accessibleLabel,
            domReference: {
              role: htmlElement.getAttribute('role') ?? undefined,
              ariaLabel: accessibleLabel,
              title,
              href: anchor?.href,
              imgAlt: image?.getAttribute('alt') ?? undefined,
              imgSrc: (image as HTMLImageElement | null)?.currentSrc || image?.getAttribute('src') || undefined,
              dataAttributes,
            },
          };
        })
        .filter(Boolean);
    });

    return candidates as VisibleCandidate[];
  }

  private toScanRecord(candidate: VisibleCandidate, listPosition: number): GooglePhotosScanRecord {
    const combinedText = [candidate.visibleText, candidate.accessibleLabel, candidate.domReference.title, candidate.domReference.imgAlt]
      .filter(Boolean)
      .join(' ');
    const displayedFileSize = extractDisplayedFileSize(combinedText);
    const videoDuration = extractVideoDuration(combinedText);
    const parsedDate = parseDisplayedDate(combinedText);
    const warnings: string[] = [];
    const sizeBytes = parseFileSizeToBytes(displayedFileSize);
    const durationSeconds = parseDurationToSeconds(videoDuration);

    if (!displayedFileSize) {
      warnings.push('Displayed file size was not found in visible DOM/accessibility text.');
    }

    if (!parsedDate.parsedDate) {
      warnings.push('Date was not parsed from visible DOM/accessibility text.');
    }

    const mediaType = detectMediaType(combinedText, videoDuration);

    if (mediaType === 'unknown') {
      warnings.push('Media type was not confidently identified from visible DOM/accessibility text.');
    }

    const record: GooglePhotosScanRecord = {
      listPosition,
      dedupeKey: '',
      ...(parsedDate.rawDate ? { rawDate: parsedDate.rawDate } : {}),
      ...(parsedDate.parsedDate ? { parsedDate: parsedDate.parsedDate } : {}),
      dateConfidence: parsedDate.confidence,
      mediaType,
      ...(displayedFileSize ? { displayedFileSize } : {}),
      ...(sizeBytes ? { sizeBytes } : {}),
      ...(videoDuration ? { videoDuration } : {}),
      ...(durationSeconds !== undefined ? { durationSeconds } : {}),
      ...(candidate.accessibleLabel ? { accessibleLabel: candidate.accessibleLabel } : {}),
      ...(candidate.visibleText ? { visibleText: candidate.visibleText } : {}),
      domReference: candidate.domReference,
      warnings,
    };

    return {
      ...record,
      dedupeKey: createDedupeKey(record),
    };
  }

  private async scrollOneViewport(): Promise<boolean> {
    return await this.page.evaluate(() => {
      const scrollableElements = [document.scrollingElement, ...Array.from(document.querySelectorAll<HTMLElement>('main, [role="main"], [role="grid"], [role="list"], div'))]
        .filter((element): element is Element => Boolean(element))
        .filter((element) => element.scrollHeight > element.clientHeight + 20);

      const target = scrollableElements.sort((left, right) => right.scrollHeight - left.scrollHeight)[0];

      if (!target) {
        return false;
      }

      const previousTop = target.scrollTop;
      target.scrollBy(0, Math.max(400, Math.floor(window.innerHeight * 0.85)));

      return target.scrollTop > previousTop;
    });
  }
}

function createDedupeKey(record: Omit<GooglePhotosScanRecord, 'dedupeKey'>): string {
  const strongSignals = [
    record.domReference.href,
    record.rawDate,
    record.displayedFileSize,
    record.videoDuration,
    record.accessibleLabel,
    record.domReference.imgAlt,
    record.domReference.imgSrc,
  ]
    .filter(Boolean)
    .join('|');

  const fallbackSignals = [record.visibleText, JSON.stringify(record.domReference.dataAttributes)].filter(Boolean).join('|');

  return createHash('sha256').update(strongSignals || fallbackSignals || `position:${record.listPosition}`).digest('hex');
}

function detectMediaType(combinedText: string, videoDuration: string | undefined): GooglePhotosScanRecord['mediaType'] {
  if (/\bvideo\b/i.test(combinedText) || videoDuration || /\bplay\b/i.test(combinedText)) {
    return 'video';
  }

  if (/\bphoto\b|\bimage\b|\blandscape\b|\bportrait\b/i.test(combinedText)) {
    return 'photo';
  }

  return 'unknown';
}

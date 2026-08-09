import { appendFileSync, mkdirSync, writeFileSync } from 'fs';
import path from 'path';
import type { GooglePhotosScanOutput } from '../models/googlePhotosStorageModels';

export function writeGooglePhotosRawJsonReport(scanOutput: GooglePhotosScanOutput): string {
  const outputDirectory = path.join(
    process.cwd(),
    'google-photos-results',
    scanOutput.run.scanRunId
  );
  const outputPath = path.join(outputDirectory, 'raw-scan.json');

  mkdirSync(outputDirectory, { recursive: true });
  writeFileSync(outputPath, `${JSON.stringify(scanOutput, null, 2)}\n`, 'utf8');

  return outputPath;
}

export type GooglePhotosRunEventDetails = Record<string, string | number | boolean | null | undefined>;

export type GooglePhotosFailureContext = {
  message: string;
  stack?: string;
  currentUrl?: string;
  pageTitle?: string;
  visibleTextExcerpt?: string;
};

export class GooglePhotosLocalRunReporter {
  readonly outputDirectory: string;
  readonly eventsPath: string;
  readonly failurePath: string;

  constructor(private readonly scanRunId: string) {
    this.outputDirectory = path.join(process.cwd(), 'google-photos-results', scanRunId);
    this.eventsPath = path.join(this.outputDirectory, 'runtime-events.jsonl');
    this.failurePath = path.join(this.outputDirectory, 'failure-context.json');
    mkdirSync(this.outputDirectory, { recursive: true });
  }

  log = (phase: string, message: string, details: GooglePhotosRunEventDetails = {}): void => {
    const event = {
      at: new Date().toISOString(),
      scanRunId: this.scanRunId,
      phase,
      message,
      details,
    };

    console.log(`[Google Photos][${phase}] ${message}${formatDetails(details)}`);
    appendFileSync(this.eventsPath, `${JSON.stringify(event)}\n`, 'utf8');
  };

  writeFailure(context: GooglePhotosFailureContext): void {
    writeFileSync(this.failurePath, `${JSON.stringify(context, null, 2)}\n`, 'utf8');
    this.log('failure', 'Local failure context written.', { path: this.failurePath });
  }
}

export function createGooglePhotosLocalRunReporter(scanRunId: string): GooglePhotosLocalRunReporter {
  return new GooglePhotosLocalRunReporter(scanRunId);
}

function formatDetails(details: GooglePhotosRunEventDetails): string {
  const entries = Object.entries(details).filter(([, value]) => value !== undefined && value !== null);

  if (entries.length === 0) {
    return '';
  }

  return ` ${entries.map(([key, value]) => `${key}=${value}`).join(' ')}`;
}

export type GooglePhotosMediaType = 'photo' | 'video' | 'unknown';

export type GooglePhotosAuthMode = 'storageState' | 'persistent' | 'cdp';

export type GooglePhotosBrowserName = 'chrome' | 'edge' | 'firefox';

export type GooglePhotosDateRange = {
  startDate?: string;
  endDate?: string;
};

export type GooglePhotosScanOptions = GooglePhotosDateRange & {
  maxScrollCycles: number;
  stopAfterNoNewCycles: number;
};

export type GooglePhotosDomReference = {
  role?: string;
  ariaLabel?: string;
  title?: string;
  href?: string;
  imgAlt?: string;
  imgSrc?: string;
  dataAttributes: Record<string, string>;
};

export type GooglePhotosScanRecord = {
  listPosition: number;
  dedupeKey: string;
  rawDate?: string;
  parsedDate?: string;
  dateConfidence: 'exact' | 'inferred' | 'unknown';
  mediaType: GooglePhotosMediaType;
  displayedFileSize?: string;
  sizeBytes?: number;
  videoDuration?: string;
  durationSeconds?: number;
  accessibleLabel?: string;
  visibleText?: string;
  domReference: GooglePhotosDomReference;
  warnings: string[];
};

export type GooglePhotosScanRunMetadata = {
  scanRunId: string;
  startedAt: string;
  finishedAt: string;
  sourceUrl: string;
  category: 'large-photos-videos';
  authMode: GooglePhotosAuthMode;
  browserName: GooglePhotosBrowserName;
  storageStatePath: string;
  persistentProfilePath: string;
  cdpEndpoint?: string;
};

export type GooglePhotosScanOutput = {
  schemaVersion: 1;
  run: GooglePhotosScanRunMetadata;
  options: GooglePhotosScanOptions;
  totals: {
    observedCandidates: number;
    uniqueRecords: number;
    filteredRecords: number;
    duplicateObservations: number;
    scrollCycles: number;
  };
  warnings: string[];
  records: GooglePhotosScanRecord[];
  filteredRecords: GooglePhotosScanRecord[];
};

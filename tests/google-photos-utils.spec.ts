import { test, expect } from '@playwright/test';
import { filterRecordsByDateRange, parseDisplayedDate, validateOptionalIsoDate } from '../utils/dateRange';
import { extractVideoDuration, parseDurationToSeconds } from '../utils/duration';
import { parseFileSizeToBytes } from '../utils/fileSize';
import type { GooglePhotosScanRecord } from '../models/googlePhotosStorageModels';

test.describe('@google-photos-utils Google Photos parser utilities', () => {
  test('parses strict date input and displayed dates', () => {
    expect(validateOptionalIsoDate('2026-08-09', 'TEST_DATE')).toBe('2026-08-09');
    expect(() => validateOptionalIsoDate('09-08-2026', 'TEST_DATE')).toThrow(/YYYY-MM-DD/);
    expect(parseDisplayedDate('Aug 9, 2026 1.2 GB').parsedDate).toBe('2026-08-09');
    expect(parseDisplayedDate('9 Aug 2026 1.2 GB').parsedDate).toBe('2026-08-09');
  });

  test('parses storage sizes and video durations', () => {
    expect(parseFileSizeToBytes('1 GB')).toBe(1073741824);
    expect(parseFileSizeToBytes('1.5 MB')).toBe(1572864);
    expect(parseDurationToSeconds('02:03')).toBe(123);
    expect(parseDurationToSeconds('1:02:03')).toBe(3723);
    expect(extractVideoDuration('Photo - Landscape - Jan 5, 2025, 6:50:03 AM')).toBeUndefined();
    expect(extractVideoDuration('Video - Jan 5, 2025 02:03')).toBe('02:03');
  });

  test('filters records by optional date range', () => {
    const records = [
      buildRecord('2026-08-01'),
      buildRecord('2026-08-09'),
      buildRecord(undefined),
    ];

    expect(filterRecordsByDateRange(records, {}).length).toBe(3);
    expect(filterRecordsByDateRange(records, { startDate: '2026-08-05' }).map((record) => record.parsedDate)).toEqual([
      '2026-08-09',
    ]);
    expect(filterRecordsByDateRange(records, { endDate: '2026-08-01' }).map((record) => record.parsedDate)).toEqual([
      '2026-08-01',
    ]);
  });
});

function buildRecord(parsedDate: string | undefined): GooglePhotosScanRecord {
  return {
    listPosition: 1,
    dedupeKey: parsedDate ?? 'missing-date',
    ...(parsedDate ? { parsedDate } : {}),
    dateConfidence: parsedDate ? 'exact' : 'unknown',
    mediaType: 'unknown',
    domReference: {
      dataAttributes: {},
    },
    warnings: [],
  };
}

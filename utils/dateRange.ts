import type { GooglePhotosDateRange, GooglePhotosScanRecord } from '../models/googlePhotosStorageModels';

const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;

const monthNumbers: Record<string, string> = {
  jan: '01',
  january: '01',
  feb: '02',
  february: '02',
  mar: '03',
  march: '03',
  apr: '04',
  april: '04',
  may: '05',
  jun: '06',
  june: '06',
  jul: '07',
  july: '07',
  aug: '08',
  august: '08',
  sep: '09',
  sept: '09',
  september: '09',
  oct: '10',
  october: '10',
  nov: '11',
  november: '11',
  dec: '12',
  december: '12',
};

export function readDateRangeFromEnv(env: NodeJS.ProcessEnv): GooglePhotosDateRange {
  const startDate = validateOptionalIsoDate(env.GOOGLE_PHOTOS_START_DATE, 'GOOGLE_PHOTOS_START_DATE');
  const endDate = validateOptionalIsoDate(env.GOOGLE_PHOTOS_END_DATE, 'GOOGLE_PHOTOS_END_DATE');

  if (startDate && endDate && startDate > endDate) {
    throw new Error('GOOGLE_PHOTOS_START_DATE must be earlier than or equal to GOOGLE_PHOTOS_END_DATE.');
  }

  return {
    ...(startDate ? { startDate } : {}),
    ...(endDate ? { endDate } : {}),
  };
}

export function validateOptionalIsoDate(value: string | undefined, variableName: string): string | undefined {
  if (!value) {
    return undefined;
  }

  if (!isoDatePattern.test(value) || !isValidIsoDate(value)) {
    throw new Error(`${variableName} must use strict YYYY-MM-DD format.`);
  }

  return value;
}

export function parseDisplayedDate(text: string): { rawDate?: string; parsedDate?: string; confidence: 'exact' | 'inferred' | 'unknown' } {
  const normalized = text.replace(/\s+/g, ' ').trim();

  const isoMatch = normalized.match(/\b(\d{4})-(\d{2})-(\d{2})\b/);
  if (isoMatch) {
    const isoDate = `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;
    return {
      rawDate: isoMatch[0],
      parsedDate: isValidIsoDate(isoDate) ? isoDate : undefined,
      confidence: isValidIsoDate(isoDate) ? 'exact' : 'unknown',
    };
  }

  const monthFirstMatch = normalized.match(
    /\b(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t|tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\.?\s+(\d{1,2}),?\s+(\d{4})\b/i
  );
  if (monthFirstMatch) {
    const month = monthNumbers[monthFirstMatch[1].toLowerCase().replace('.', '')];
    const day = monthFirstMatch[2].padStart(2, '0');
    const isoDate = `${monthFirstMatch[3]}-${month}-${day}`;
    return {
      rawDate: monthFirstMatch[0],
      parsedDate: isValidIsoDate(isoDate) ? isoDate : undefined,
      confidence: isValidIsoDate(isoDate) ? 'exact' : 'unknown',
    };
  }

  const dayFirstMatch = normalized.match(
    /\b(\d{1,2})\s+(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t|tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\.?,?\s+(\d{4})\b/i
  );
  if (dayFirstMatch) {
    const day = dayFirstMatch[1].padStart(2, '0');
    const month = monthNumbers[dayFirstMatch[2].toLowerCase().replace('.', '')];
    const isoDate = `${dayFirstMatch[3]}-${month}-${day}`;
    return {
      rawDate: dayFirstMatch[0],
      parsedDate: isValidIsoDate(isoDate) ? isoDate : undefined,
      confidence: isValidIsoDate(isoDate) ? 'exact' : 'unknown',
    };
  }

  return { confidence: 'unknown' };
}

export function filterRecordsByDateRange(
  records: GooglePhotosScanRecord[],
  range: GooglePhotosDateRange
): GooglePhotosScanRecord[] {
  if (!range.startDate && !range.endDate) {
    return records;
  }

  return records.filter((record) => {
    if (!record.parsedDate) {
      return false;
    }

    if (range.startDate && record.parsedDate < range.startDate) {
      return false;
    }

    if (range.endDate && record.parsedDate > range.endDate) {
      return false;
    }

    return true;
  });
}

function isValidIsoDate(value: string): boolean {
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

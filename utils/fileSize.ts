const fileSizePattern = /\b(\d+(?:[.,]\d+)?)\s*(bytes?|b|kb|mb|gb|tb)\b/i;

const sizeMultipliers: Record<string, number> = {
  byte: 1,
  bytes: 1,
  b: 1,
  kb: 1024,
  mb: 1024 ** 2,
  gb: 1024 ** 3,
  tb: 1024 ** 4,
};

export function extractDisplayedFileSize(text: string): string | undefined {
  return text.match(fileSizePattern)?.[0];
}

export function parseFileSizeToBytes(value: string | undefined): number | undefined {
  if (!value) {
    return undefined;
  }

  const match = value.match(fileSizePattern);
  if (!match) {
    return undefined;
  }

  const amount = Number(match[1].replace(',', '.'));
  const unit = match[2].toLowerCase();

  if (!Number.isFinite(amount)) {
    return undefined;
  }

  return Math.round(amount * sizeMultipliers[unit]);
}

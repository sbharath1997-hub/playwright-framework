const durationPattern = /(?<![\d:])(?:(\d{1,2}):)?(\d{1,2}):(\d{2})(?!\s*(?:AM|PM)\b|:\d)/i;

export function extractVideoDuration(text: string): string | undefined {
  return text.match(durationPattern)?.[0];
}

export function parseDurationToSeconds(value: string | undefined): number | undefined {
  if (!value) {
    return undefined;
  }

  const parts = value.split(':').map(Number);
  if (parts.some((part) => !Number.isInteger(part) || part < 0)) {
    return undefined;
  }

  if (parts.length === 2) {
    const [minutes, seconds] = parts;
    return minutes * 60 + seconds;
  }

  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts;
    return hours * 3600 + minutes * 60 + seconds;
  }

  return undefined;
}

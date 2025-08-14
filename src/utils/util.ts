interface FileSize {
  size: number;
  unit: number;
}

const FILE_SIZE_UNITS = ['byte', 'KB', 'MB', 'GB', 'TB'];

export function secWithMsTohhmmss(sec: number) {
  const totalSeconds = Math.floor(sec);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  } else {
    return `${pad(minutes)}:${pad(seconds)}`;
  }
}

export function getUserOrFalse(obj: User | string): User | null {
  if (
    obj !== null &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.userId === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.createdDate === 'string' &&
    typeof obj.isDeleted === 'boolean'
  ) {
    return obj as User;
  }
  return null;
}

export function convertFileSizeWithoutZero(fileSize: number = 0) {
  const { size, unit } = calculateFileSize(fileSize, 0);

  let result = size.toFixed(2);

  if (result.endsWith('.00')) {
    result = parseInt(result, 10).toString();
  }

  return result + ' ' + FILE_SIZE_UNITS[unit];
}

function calculateFileSize(fileSize: number, unit: number): FileSize {
  const result = fileSize / 1_024;

  if (result > 1) {
    unit++;
  }

  if (result > 1_024) {
    return calculateFileSize(result, unit);
  }

  return { size: result, unit };
}

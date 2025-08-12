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

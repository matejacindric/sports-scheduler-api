export function parseDuration(duration: string) {
  const num = parseInt(duration);
  if (duration.endsWith('d')) return num * 24 * 60 * 60 * 1000;
  if (duration.endsWith('h')) return num * 60 * 60 * 1000;
  if (duration.endsWith('m')) return num * 60 * 1000;
  if (duration.endsWith('s')) return num * 1000;
  return num;
}

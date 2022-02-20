export function calculateByte(bytes: number) {
  const s = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];

  const e = Math.floor(Math.log(bytes) / Math.log(1024));

  if (!e) return '0 ' + s[0];
  else return (bytes / Math.pow(1024, Math.floor(e))).toFixed(2) + ' ' + s[e];
}

export default class UtilService {
  static calculateByte(bytes: number) {
    const s = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];

    const e = Math.floor(Math.log(bytes) / Math.log(1024));

    if (!e) return '0 ' + s[0];
    else return (bytes / Math.pow(1024, Math.floor(e))).toFixed(2) + ' ' + s[e];
  }

  static async fetcher(url: string) {
    return fetch(url).then((res) => res.json());
  }

  static getDate(dateStr: string) {
    const newDate = new Date(dateStr).toDateString().split(' ');
    return `${newDate[0]}, ${newDate[1]} ${newDate[2]}`;
  }

  static getDateAndTime(dateStr: string) {
    const date = new Date(dateStr);
    const newDate = date.toDateString().split(' ');
    let hour = date.getHours();
    const minutes = date.getMinutes();
    const amPm = hour < 12 ? 'am' : 'pm';
    hour = hour < 12 ? hour : hour - 12;
    return `${newDate[0]}, ${newDate[1]} ${newDate[2]}, ${hour}:${minutes}${amPm}`;
  }
}

import * as moment from 'moment';

const week: string[] = ['日', '一', '二', '三', '四', '五', '六'];

export class DateHelper {
  public dateAll(iso: string): string {
    const date: Date = new Date(iso);
    const weekDay: number = date.getDay();
    const yyyymmdd: string = moment(iso).format('YYYY-MM-DD');
    const hhmm: string = moment(iso).format('HH:mm');

    return `${yyyymmdd} (${week[weekDay]}) ${hhmm}`;
  }

  public getDateWithWeek(iso: string): string {
    const date: Date = new Date(iso);
    const weekDay: number = date.getDay();

    return moment(iso).format(`YYYY-MM-DD (${week[weekDay]})`);
  }

  public getDate(iso: string): string {
    return moment(iso).format('YYYY-MM-DD');
  }

  public hhmm(iso: string): string {
    return moment(iso).format('HH:mm');
  }

  public getAge(iso: string): number {
    const diff = Date.now() - new Date(iso).getTime();

    return Math.abs(new Date(diff).getUTCFullYear() - 1970);
  }
}

import { BaseTimeSlotStrategy } from './base';
import { TimeSlotPeriodicity } from '../../periodicity';

export class QuarterStrategy extends BaseTimeSlotStrategy {
  override readonly periodicity: TimeSlotPeriodicity = TimeSlotPeriodicity.Quarter;

  override calculateFirstDate(value: string): Date {
    const { year, quarter } = this.parseValue(value);
    return new Date(Date.UTC(year, (quarter - 1) * 3, 1));
  }

  override calculateLastDate(value: string): Date {
    const quarterDate = this.calculateFirstDate(value);
    quarterDate.setUTCMonth(quarterDate.getUTCMonth() + 3);
    quarterDate.setUTCDate(0); // Go to last day of previous month
    return quarterDate;
  }

  override calculatePrevious(value: string): string {
    const { year, quarter } = this.parseValue(value);
    return quarter === 1 ? `${year - 1}-Q4` : `${year}-Q${quarter - 1}`;
  }

  override calculateNext(value: string): string {
    const { year, quarter } = this.parseValue(value);
    return quarter === 4 ? `${year + 1}-Q1` : `${year}-Q${quarter + 1}`;
  }

  override fromDate(date: Date): string {
    return `${date.getUTCFullYear()}-Q${1 + Math.floor(date.getUTCMonth() / 3)}`;
  }

  private parseValue(value: string): { year: number; quarter: number } {
    const year = parseInt(value.substring(0, 4));
    const quarter = parseInt(value.substring(6));
    return { year, quarter };
  }
}

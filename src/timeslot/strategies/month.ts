import { BaseTimeSlotStrategy } from './base';
import { TimeSlotPeriodicity } from '../../periodicity';

export class MonthStrategy extends BaseTimeSlotStrategy {
  override readonly periodicity: TimeSlotPeriodicity = TimeSlotPeriodicity.Month;

  override calculateFirstDate(value: string): Date {
    const { year, month } = this.parseValue(value);
    return new Date(Date.UTC(year, month - 1, 1));
  }

  override calculateLastDate(value: string): Date {
    const monthDate = this.calculateFirstDate(value);
    monthDate.setUTCMonth(monthDate.getUTCMonth() + 1);
    monthDate.setUTCDate(0); // Go to last day of previous month
    return monthDate;
  }

  override calculatePrevious(value: string): string {
    const { year, month } = this.parseValue(value);
    return month === 1 ? `${year - 1}-12` : `${year}-${this.padMonth(month - 1)}`;
  }

  override calculateNext(value: string): string {
    const { year, month } = this.parseValue(value);
    return month === 12 ? `${year + 1}-01` : `${year}-${this.padMonth(month + 1)}`;
  }

  override fromDate(date: Date): string {
    return date.toISOString().substring(0, 7);
  }

  private parseValue(value: string): { year: number; month: number } {
    const year = parseInt(value.substring(0, 4));
    const month = parseInt(value.substring(5, 7));
    return { year, month };
  }

  private padMonth(month: number): string {
    return month < 10 ? `0${month}` : month.toString();
  }
}

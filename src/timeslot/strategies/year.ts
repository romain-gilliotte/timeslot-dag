import { BaseTimeSlotStrategy } from './base';
import { TimeSlotPeriodicity } from '../../periodicity';

export class YearStrategy extends BaseTimeSlotStrategy {
  override readonly periodicity: TimeSlotPeriodicity = TimeSlotPeriodicity.Year;

  override calculateFirstDate(value: string): Date {
    const year = this.parseValue(value);
    return new Date(Date.UTC(year, 0, 1));
  }

  override calculateLastDate(value: string): Date {
    return new Date(value + '-12-31T00:00:00Z');
  }

  override calculatePrevious(value: string): string {
    const year = this.parseValue(value);
    return (year - 1).toString();
  }

  override calculateNext(value: string): string {
    const year = this.parseValue(value);
    return (year + 1).toString();
  }

  override fromDate(date: Date): string {
    return date.getUTCFullYear().toString();
  }

  private parseValue(value: string): number {
    return parseInt(value);
  }
}

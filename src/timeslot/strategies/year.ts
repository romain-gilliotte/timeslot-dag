import { BaseTimeSlotStrategy } from './base';
import { TimeSlotPeriodicity } from '../../periodicity';

export class YearStrategy extends BaseTimeSlotStrategy {
  calculateFirstDate(value: string): Date {
    return new Date(Date.UTC(parseInt(value), 0, 1));
  }

  calculateLastDate(value: string): Date {
    return new Date(value + '-12-31T00:00:00Z');
  }

  calculatePrevious(value: string): string {
    const year = parseInt(value);
    return (year - 1).toString();
  }

  calculateNext(value: string): string {
    const year = parseInt(value);
    return (year + 1).toString();
  }

  fromDate(date: Date): string {
    return date.getUTCFullYear().toString();
  }

  readonly parentPeriodicities: TimeSlotPeriodicity[] = [TimeSlotPeriodicity.All];

  readonly childPeriodicities: TimeSlotPeriodicity[] = [
    TimeSlotPeriodicity.Semester,
    TimeSlotPeriodicity.Quarter,
    TimeSlotPeriodicity.Month,
    TimeSlotPeriodicity.Day,
    TimeSlotPeriodicity.WeekSat,
    TimeSlotPeriodicity.WeekSun,
    TimeSlotPeriodicity.WeekMon,
    TimeSlotPeriodicity.MonthWeekSat,
    TimeSlotPeriodicity.MonthWeekSun,
    TimeSlotPeriodicity.MonthWeekMon,
  ];

  protected getPeriodicity(): TimeSlotPeriodicity {
    return TimeSlotPeriodicity.Year;
  }
} 
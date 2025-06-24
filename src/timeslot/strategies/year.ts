import { BaseTimeSlotStrategy } from './base';
import { TimeSlotPeriodicity } from '../../periodicity';

export class YearStrategy extends BaseTimeSlotStrategy {
  override calculateFirstDate(value: string): Date {
    return new Date(Date.UTC(parseInt(value), 0, 1));
  }

  override calculateLastDate(value: string): Date {
    return new Date(value + '-12-31T00:00:00Z');
  }

  override calculatePrevious(value: string): string {
    const year = parseInt(value);
    return (year - 1).toString();
  }

  override calculateNext(value: string): string {
    const year = parseInt(value);
    return (year + 1).toString();
  }

  override fromDate(date: Date): string {
    return date.getUTCFullYear().toString();
  }

  override readonly parentPeriodicities: TimeSlotPeriodicity[] = [TimeSlotPeriodicity.All];

  override readonly childPeriodicities: TimeSlotPeriodicity[] = [
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

  override readonly periodicity: TimeSlotPeriodicity = TimeSlotPeriodicity.Year;
} 
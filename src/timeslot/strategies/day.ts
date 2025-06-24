import { BaseTimeSlotStrategy } from './base';
import { TimeSlotPeriodicity } from '../../periodicity';

export class DayStrategy extends BaseTimeSlotStrategy {
  override calculateFirstDate(value: string): Date {
    return new Date(value);
  }

  override calculateLastDate(value: string): Date {
    return this.calculateFirstDate(value); // Same as first date for days
  }

  override calculatePrevious(value: string): string {
    const date = new Date(value);
    date.setUTCDate(date.getUTCDate() - 1);
    return date.toISOString().substring(0, 10);
  }

  override calculateNext(value: string): string {
    const date = new Date(value);
    date.setUTCDate(date.getUTCDate() + 1);
    return date.toISOString().substring(0, 10);
  }

  override fromDate(date: Date): string {
    return date.toISOString().substring(0, 10);
  }

  override readonly parentPeriodicities: TimeSlotPeriodicity[] = [
    TimeSlotPeriodicity.MonthWeekSat,
    TimeSlotPeriodicity.MonthWeekSun,
    TimeSlotPeriodicity.MonthWeekMon,
    TimeSlotPeriodicity.WeekSat,
    TimeSlotPeriodicity.WeekSun,
    TimeSlotPeriodicity.WeekMon,
    TimeSlotPeriodicity.Month,
    TimeSlotPeriodicity.Quarter,
    TimeSlotPeriodicity.Semester,
    TimeSlotPeriodicity.Year,
    TimeSlotPeriodicity.All,
  ];

  override readonly childPeriodicities: TimeSlotPeriodicity[] = []; // Days have no children

  override readonly periodicity: TimeSlotPeriodicity = TimeSlotPeriodicity.Day;
} 
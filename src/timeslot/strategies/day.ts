import { BaseTimeSlotStrategy } from './base';
import { TimeSlotPeriodicity } from '../../periodicity';

export class DayStrategy extends BaseTimeSlotStrategy {
  calculateFirstDate(value: string): Date {
    return new Date(value);
  }

  calculateLastDate(value: string): Date {
    return this.calculateFirstDate(value); // Same as first date for days
  }

  calculatePrevious(value: string): string {
    const date = new Date(value);
    date.setUTCDate(date.getUTCDate() - 1);
    return date.toISOString().substring(0, 10);
  }

  calculateNext(value: string): string {
    const date = new Date(value);
    date.setUTCDate(date.getUTCDate() + 1);
    return date.toISOString().substring(0, 10);
  }

  fromDate(date: Date): string {
    return date.toISOString().substring(0, 10);
  }

  readonly parentPeriodicities: TimeSlotPeriodicity[] = [
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

  readonly childPeriodicities: TimeSlotPeriodicity[] = []; // Days have no children

  readonly periodicity: TimeSlotPeriodicity = TimeSlotPeriodicity.Day;
} 
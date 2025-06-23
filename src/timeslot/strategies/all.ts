import { BaseTimeSlotStrategy } from './base';
import { TimeSlotPeriodicity } from '../../periodicity';

export class AllStrategy extends BaseTimeSlotStrategy {
  calculateFirstDate(): Date {
    return new Date(0); // Unix epoch
  }

  calculateLastDate(): Date {
    return new Date(8640000000000000); // Max date
  }

  calculatePrevious(): string {
    return 'all'; // All is always the same
  }

  calculateNext(): string {
    return 'all'; // All is always the same
  }

  fromDate(): string {
    return 'all';
  }

  readonly parentPeriodicities: TimeSlotPeriodicity[] = []; // All has no parents

  readonly childPeriodicities: TimeSlotPeriodicity[] = [
    TimeSlotPeriodicity.Day,
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
  ];

  protected getPeriodicity(): TimeSlotPeriodicity {
    return TimeSlotPeriodicity.All;
  }

  toChildPeriodicity(): string[] {
    throw new Error('Cannot enumerate children of the all periodicity');
  }
} 
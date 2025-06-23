import { BaseMonthWeekStrategy } from './month-week-base';
import { TimeSlotPeriodicity } from '../../periodicity';

export class MonthWeekMonStrategy extends BaseMonthWeekStrategy {
  protected getWeekStartDay(): number {
    return 1; // Monday
  }

  protected getPeriodicitySuffix(): string {
    return 'mon';
  }

  protected getMonthWeekPeriodicity(): TimeSlotPeriodicity {
    return TimeSlotPeriodicity.MonthWeekMon;
  }
} 
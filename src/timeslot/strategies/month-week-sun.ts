import { BaseMonthWeekStrategy } from './month-week-base';
import { TimeSlotPeriodicity } from '../../periodicity';

export class MonthWeekSunStrategy extends BaseMonthWeekStrategy {
  protected getWeekStartDay(): number {
    return 0; // Sunday
  }

  protected getPeriodicitySuffix(): string {
    return 'sun';
  }

  protected getMonthWeekPeriodicity(): TimeSlotPeriodicity {
    return TimeSlotPeriodicity.MonthWeekSun;
  }
} 
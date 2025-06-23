import { BaseMonthWeekStrategy } from './month-week-base';
import { TimeSlotPeriodicity } from '../../periodicity';

export class MonthWeekSatStrategy extends BaseMonthWeekStrategy {
  protected getWeekStartDay(): number {
    return 6; // Saturday
  }

  protected getPeriodicitySuffix(): string {
    return 'sat';
  }

  protected getMonthWeekPeriodicity(): TimeSlotPeriodicity {
    return TimeSlotPeriodicity.MonthWeekSat;
  }
} 
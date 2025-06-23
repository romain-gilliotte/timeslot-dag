import { BaseWeekStrategy } from './week-base';
import { TimeSlotPeriodicity } from '../../periodicity';

export class WeekMonStrategy extends BaseWeekStrategy {
  protected getWeekStartDay(): number {
    return 1; // Monday
  }

  protected getPeriodicitySuffix(): string {
    return 'mon';
  }

  protected getWeekPeriodicity(): TimeSlotPeriodicity {
    return TimeSlotPeriodicity.WeekMon;
  }
} 
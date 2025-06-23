import { BaseWeekStrategy } from './week-base';
import { TimeSlotPeriodicity } from '../../periodicity';

export class WeekSunStrategy extends BaseWeekStrategy {
  protected getWeekStartDay(): number {
    return 0; // Sunday
  }

  protected getPeriodicitySuffix(): string {
    return 'sun';
  }

  protected getWeekPeriodicity(): TimeSlotPeriodicity {
    return TimeSlotPeriodicity.WeekSun;
  }
} 
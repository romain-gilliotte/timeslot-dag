import { BaseWeekStrategy } from './week-base';
import { TimeSlotPeriodicity } from '../../periodicity';

export class WeekSatStrategy extends BaseWeekStrategy {
  protected getWeekStartDay(): number {
    return 6; // Saturday
  }

  protected getPeriodicitySuffix(): string {
    return 'sat';
  }

  protected getWeekPeriodicity(): TimeSlotPeriodicity {
    return TimeSlotPeriodicity.WeekSat;
  }
} 
import { BaseMonthWeekStrategy } from './month-week-base';
import { TimeSlotPeriodicity } from '../../periodicity';

export class MonthWeekMonStrategy extends BaseMonthWeekStrategy {
  protected readonly weekStartDay: number = 1; // Monday
  protected readonly periodicitySuffix: string = 'mon';
  public readonly periodicity: TimeSlotPeriodicity = TimeSlotPeriodicity.MonthWeekMon;
} 
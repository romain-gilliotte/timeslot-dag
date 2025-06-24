import { BaseMonthWeekStrategy } from './month-week-base';
import { TimeSlotPeriodicity } from '../../periodicity';

export class MonthWeekSunStrategy extends BaseMonthWeekStrategy {
  protected readonly weekStartDay: number = 0; // Sunday
  protected readonly periodicitySuffix: string = 'sun';
  public readonly periodicity: TimeSlotPeriodicity = TimeSlotPeriodicity.MonthWeekSun;
} 
import { BaseMonthWeekStrategy } from './month-week-base';
import { TimeSlotPeriodicity } from '../../periodicity';

export class MonthWeekSunStrategy extends BaseMonthWeekStrategy {
  override readonly weekStartDay: number = 0; // Sunday
  override readonly periodicitySuffix: string = 'sun';
  override readonly periodicity: TimeSlotPeriodicity = TimeSlotPeriodicity.MonthWeekSun;
} 
import { BaseMonthWeekStrategy } from './month-week-base';
import { TimeSlotPeriodicity } from '../../periodicity';

export class MonthWeekMonStrategy extends BaseMonthWeekStrategy {
  override readonly periodicitySuffix: string = 'mon';
  override readonly periodicity: TimeSlotPeriodicity = TimeSlotPeriodicity.MonthWeekMon;
}

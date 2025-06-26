import { BaseMonthWeekStrategy } from './month-week-base';
import { TimeSlotPeriodicity } from '../../periodicity';

export class MonthWeekSunStrategy extends BaseMonthWeekStrategy {
  override readonly periodicitySuffix: string = 'sun';
  override readonly periodicity: TimeSlotPeriodicity = TimeSlotPeriodicity.MonthWeekSun;
}

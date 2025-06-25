import { BaseMonthWeekStrategy } from './month-week-base';
import { TimeSlotPeriodicity } from '../../periodicity';

export class MonthWeekSatStrategy extends BaseMonthWeekStrategy {
  override readonly periodicitySuffix: string = 'sat';
  override readonly periodicity: TimeSlotPeriodicity = TimeSlotPeriodicity.MonthWeekSat;
}

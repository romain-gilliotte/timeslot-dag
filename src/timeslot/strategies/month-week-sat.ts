import { BaseMonthWeekStrategy } from './month-week-base';
import { TimeSlotPeriodicity } from '../../periodicity';

export class MonthWeekSatStrategy extends BaseMonthWeekStrategy {
  protected readonly weekStartDay: number = 6; // Saturday
  protected readonly periodicitySuffix: string = 'sat';
  public readonly periodicity: TimeSlotPeriodicity = TimeSlotPeriodicity.MonthWeekSat;
} 
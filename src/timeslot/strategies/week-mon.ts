import { BaseWeekStrategy } from './week-base';
import { TimeSlotPeriodicity } from '../../periodicity';

export class WeekMonStrategy extends BaseWeekStrategy {
  protected readonly weekStartDay: number = 1; // Monday
  protected readonly periodicitySuffix: string = 'mon';
  public readonly periodicity: TimeSlotPeriodicity = TimeSlotPeriodicity.WeekMon;
} 
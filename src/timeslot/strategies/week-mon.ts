import { BaseWeekStrategy } from './week-base';
import { TimeSlotPeriodicity } from '../../periodicity';

export class WeekMonStrategy extends BaseWeekStrategy {
  override readonly weekStartDay: number = 1; // Monday
  override readonly periodicitySuffix: string = 'mon';
  override readonly periodicity: TimeSlotPeriodicity = TimeSlotPeriodicity.WeekMon;
} 
import { BaseWeekStrategy } from './week-base';
import { TimeSlotPeriodicity } from '../../periodicity';

export class WeekSunStrategy extends BaseWeekStrategy {
  override readonly weekStartDay: number = 0; // Sunday
  override readonly periodicitySuffix: string = 'sun';
  override readonly periodicity: TimeSlotPeriodicity = TimeSlotPeriodicity.WeekSun;
} 
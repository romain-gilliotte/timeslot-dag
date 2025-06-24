import { BaseWeekStrategy } from './week-base';
import { TimeSlotPeriodicity } from '../../periodicity';

export class WeekSunStrategy extends BaseWeekStrategy {
  protected readonly weekStartDay: number = 0; // Sunday
  protected readonly periodicitySuffix: string = 'sun';
  public readonly periodicity: TimeSlotPeriodicity = TimeSlotPeriodicity.WeekSun;
} 
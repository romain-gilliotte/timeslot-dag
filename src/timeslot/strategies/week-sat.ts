import { BaseWeekStrategy } from './week-base';
import { TimeSlotPeriodicity } from '../../periodicity';

export class WeekSatStrategy extends BaseWeekStrategy {
  protected readonly weekStartDay: number = 6; // Saturday
  protected readonly periodicitySuffix: string = 'sat';
  public readonly periodicity: TimeSlotPeriodicity = TimeSlotPeriodicity.WeekSat;
} 
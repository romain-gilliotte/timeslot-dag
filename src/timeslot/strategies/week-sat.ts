import { BaseWeekStrategy } from './week-base';
import { TimeSlotPeriodicity } from '../../periodicity';

export class WeekSatStrategy extends BaseWeekStrategy {
  override readonly weekStartDay: number = 6; // Saturday
  override readonly periodicitySuffix: string = 'sat';
  override readonly periodicity: TimeSlotPeriodicity = TimeSlotPeriodicity.WeekSat;
} 
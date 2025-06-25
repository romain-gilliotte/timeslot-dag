import { BaseTimeSlotStrategy } from './base';
import { TimeSlotPeriodicity } from '../../periodicity';

export class AllStrategy extends BaseTimeSlotStrategy {
  override readonly periodicity: TimeSlotPeriodicity = TimeSlotPeriodicity.All;

  override calculateFirstDate(): Date {
    return new Date(0); // Unix epoch
  }

  override calculateLastDate(): Date {
    return new Date(8640000000000000); // Max date
  }

  override calculatePrevious(): string {
    return 'all'; // All is always the same
  }

  override calculateNext(): string {
    return 'all'; // All is always the same
  }

  override fromDate(): string {
    return 'all';
  }

  override toChildPeriodicity(): string[] {
    throw new Error('Cannot enumerate children of the all periodicity');
  }
}

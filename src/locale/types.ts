import { TimeSlotPeriodicity } from '../periodicity';

export interface Locale {
  humanizeValue(periodicity: TimeSlotPeriodicity, value: string): string;
  humanizePeriodicity(periodicity: TimeSlotPeriodicity): string;
} 
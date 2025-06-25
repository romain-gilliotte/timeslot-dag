import { TimeSlotPeriodicity } from '../periodicity';

export interface TimeSlotStrategy {
  readonly periodicity: TimeSlotPeriodicity;
  calculateFirstDate(value: string): Date;
  calculateLastDate(value: string, firstDate: Date): Date;
  calculatePrevious(value: string): string;
  calculateNext(value: string): string;
  fromDate(date: Date): string;
  toParentPeriodicity(value: string, newPeriodicity: TimeSlotPeriodicity): string;
  toChildPeriodicity(value: string, newPeriodicity: TimeSlotPeriodicity): string[];
}

export class TimeSlotStrategyFactory {
  private static strategies: Map<TimeSlotPeriodicity, TimeSlotStrategy> = new Map();

  static register(periodicity: TimeSlotPeriodicity, strategy: TimeSlotStrategy): void {
    this.strategies.set(periodicity, strategy);
  }

  static get(periodicity: TimeSlotPeriodicity): TimeSlotStrategy {
    const strategy = this.strategies.get(periodicity);
    if (!strategy) {
      throw new Error(`No strategy found for periodicity: ${periodicity}`);
    }
    return strategy;
  }

  static getByValue(value: string): TimeSlotStrategy {
    const periodicity = this.determinePeriodicity(value);
    return this.get(periodicity);
  }

  static determinePeriodicity(value: string): TimeSlotPeriodicity {
    const len = value.length;
    if (len === 3) {
      return TimeSlotPeriodicity.All;
    } else if (len === 4) {
      return TimeSlotPeriodicity.Year;
    } else if (len === 7) {
      const charAt6 = value[5];
      if (charAt6 === 'Q') {
        return TimeSlotPeriodicity.Quarter;
      } else if (charAt6 === 'S') {
        return TimeSlotPeriodicity.Semester;
      } else {
        return TimeSlotPeriodicity.Month;
      }
    } else if (len === 10) {
      return TimeSlotPeriodicity.Day;
    } else if (len === 12) {
      return `week_${value.substring(9)}` as TimeSlotPeriodicity;
    } else if (len === 14) {
      return `month_week_${value.substring(11)}` as TimeSlotPeriodicity;
    }
    throw new Error('Invalid time slot value');
  }
}

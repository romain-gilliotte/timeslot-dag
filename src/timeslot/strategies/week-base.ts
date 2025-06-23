import { BaseTimeSlotStrategy } from './base';
import { TimeSlotPeriodicity } from '../../periodicity';

export abstract class BaseWeekStrategy extends BaseTimeSlotStrategy {
  protected abstract getWeekStartDay(): number;
  protected abstract getPeriodicitySuffix(): string;
  protected abstract getWeekPeriodicity(): TimeSlotPeriodicity;

  calculateFirstDate(value: string): Date {
    const year = parseInt(value.substring(0, 4));
    const weekNumber = parseInt(value.substring(6, 8));
    const epoch = this.getEpidemiologicWeekEpoch(year);
    return new Date(epoch.getTime() + (weekNumber - 1) * 7 * 24 * 60 * 60 * 1000);
  }

  calculateLastDate(value: string): Date {
    const firstDate = this.calculateFirstDate(value);
    return new Date(firstDate.getTime() + 6 * 24 * 60 * 60 * 1000);
  }

  calculatePrevious(value: string): string {
    const year = parseInt(value.substring(0, 4));
    const weekNumber = parseInt(value.substring(6, 8));
    
    if (weekNumber === 1) {
      const prevYear = year - 1;
      const prevYearEpoch = this.getEpidemiologicWeekEpoch(prevYear);
      const nextYearEpoch = this.getEpidemiologicWeekEpoch(year);
      const weeksInPrevYear = Math.floor((nextYearEpoch.getTime() - prevYearEpoch.getTime()) / (7 * 24 * 60 * 60 * 1000));
      return `${prevYear}-W${weeksInPrevYear < 10 ? '0' + weeksInPrevYear : weeksInPrevYear}-${this.getPeriodicitySuffix()}`;
    } else {
      const prevWeek = weekNumber - 1;
      return `${year}-W${prevWeek < 10 ? '0' + prevWeek : prevWeek}-${this.getPeriodicitySuffix()}`;
    }
  }

  calculateNext(value: string): string {
    const year = parseInt(value.substring(0, 4));
    const weekNumber = parseInt(value.substring(6, 8));
    const nextWeek = weekNumber + 1;
    
    const epoch = this.getEpidemiologicWeekEpoch(year);
    const nextYearEpoch = this.getEpidemiologicWeekEpoch(year + 1);
    const weeksInYear = Math.floor((nextYearEpoch.getTime() - epoch.getTime()) / (7 * 24 * 60 * 60 * 1000));
    
    if (nextWeek > weeksInYear) {
      return `${year + 1}-W01-${this.getPeriodicitySuffix()}`;
    } else {
      return `${year}-W${nextWeek < 10 ? '0' + nextWeek : nextWeek}-${this.getPeriodicitySuffix()}`;
    }
  }

  fromDate(date: Date): string {
    let year = date.getUTCFullYear() + 1;
    let epoch = this.getEpidemiologicWeekEpoch(year);

    while (date.getTime() < epoch.getTime()) {
      epoch = this.getEpidemiologicWeekEpoch(--year);
    }

    const weekNumber = Math.floor((date.getTime() - epoch.getTime()) / (1000 * 60 * 60 * 24 * 7)) + 1;
    const paddedWeekNumber = weekNumber < 10 ? `0${weekNumber}` : weekNumber.toString();

    return `${year}-W${paddedWeekNumber}-${this.getPeriodicitySuffix()}`;
  }

  readonly parentPeriodicities: TimeSlotPeriodicity[] = [
    TimeSlotPeriodicity.Month,
    TimeSlotPeriodicity.Quarter,
    TimeSlotPeriodicity.Semester,
    TimeSlotPeriodicity.Year,
    TimeSlotPeriodicity.All,
  ];

  readonly childPeriodicities: TimeSlotPeriodicity[] = [TimeSlotPeriodicity.Day];

  protected getPeriodicity(): TimeSlotPeriodicity {
    return this.getWeekPeriodicity();
  }

  private getEpidemiologicWeekEpoch(year: number): Date {
    const startDay = this.getWeekStartDay();
    const jan4 = new Date(Date.UTC(year, 0, 4));
    const jan4Day = jan4.getUTCDay();
    const diff = (jan4Day - startDay + 7) % 7;
    return new Date(Date.UTC(year, 0, 4 - diff));
  }
} 
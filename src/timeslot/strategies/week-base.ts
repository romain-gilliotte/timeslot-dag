import { BaseTimeSlotStrategy } from './base';

export abstract class BaseWeekStrategy extends BaseTimeSlotStrategy {
  protected abstract readonly weekStartDay: number;
  protected abstract readonly periodicitySuffix: string;

  calculateFirstDate(value: string): Date {
    const { year, weekNumber } = this.parseValue(value);
    const epoch = this.getEpidemiologicWeekEpoch(year);
    return new Date(epoch.getTime() + (weekNumber - 1) * 7 * 24 * 60 * 60 * 1000);
  }

  calculateLastDate(value: string): Date {
    const firstDate = this.calculateFirstDate(value);
    return new Date(firstDate.getTime() + 6 * 24 * 60 * 60 * 1000);
  }

  calculatePrevious(value: string): string {
    const { year, weekNumber } = this.parseValue(value);

    return weekNumber === 1
      ? this.getPreviousYearWeek(year)
      : `${year}-W${this.padWeek(weekNumber - 1)}-${this.periodicitySuffix}`;
  }

  calculateNext(value: string): string {
    const { year, weekNumber } = this.parseValue(value);
    const nextWeek = weekNumber + 1;

    const epoch = this.getEpidemiologicWeekEpoch(year);
    const nextYearEpoch = this.getEpidemiologicWeekEpoch(year + 1);
    const weeksInYear = Math.floor(
      (nextYearEpoch.getTime() - epoch.getTime()) / (7 * 24 * 60 * 60 * 1000)
    );

    return nextWeek > weeksInYear
      ? `${year + 1}-W01-${this.periodicitySuffix}`
      : `${year}-W${this.padWeek(nextWeek)}-${this.periodicitySuffix}`;
  }

  fromDate(date: Date): string {
    let year = date.getUTCFullYear() + 1;
    let epoch = this.getEpidemiologicWeekEpoch(year);

    while (date.getTime() < epoch.getTime()) {
      epoch = this.getEpidemiologicWeekEpoch(--year);
    }

    const weekNumber =
      Math.floor((date.getTime() - epoch.getTime()) / (1000 * 60 * 60 * 24 * 7)) + 1;
    const paddedWeekNumber = this.padWeek(weekNumber);

    return `${year}-W${paddedWeekNumber}-${this.periodicitySuffix}`;
  }

  private parseValue(value: string): { year: number; weekNumber: number } {
    const year = parseInt(value.substring(0, 4));
    const weekNumber = parseInt(value.substring(6, 8));
    return { year, weekNumber };
  }

  private getPreviousYearWeek(year: number): string {
    const prevYear = year - 1;
    const prevYearEpoch = this.getEpidemiologicWeekEpoch(prevYear);
    const nextYearEpoch = this.getEpidemiologicWeekEpoch(year);
    const weeksInPrevYear = Math.floor(
      (nextYearEpoch.getTime() - prevYearEpoch.getTime()) / (7 * 24 * 60 * 60 * 1000)
    );
    return `${prevYear}-W${this.padWeek(weeksInPrevYear)}-${this.periodicitySuffix}`;
  }

  private padWeek(week: number): string {
    return week < 10 ? `0${week}` : week.toString();
  }

  private getEpidemiologicWeekEpoch(year: number): Date {
    const startDay = this.weekStartDay;
    const jan4 = new Date(Date.UTC(year, 0, 4));
    const jan4Day = jan4.getUTCDay();
    const diff = (jan4Day - startDay + 7) % 7;
    return new Date(Date.UTC(year, 0, 4 - diff));
  }
}

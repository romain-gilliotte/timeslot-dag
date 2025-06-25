import { BaseTimeSlotStrategy } from './base';

export abstract class BaseMonthWeekStrategy extends BaseTimeSlotStrategy {
  protected abstract readonly periodicitySuffix: string;

  calculateFirstDate(value: string): Date {
    const { year, month, weekNumber } = this.parseValue(value);
    const firstDayOfMonth = new Date(Date.UTC(year, month - 1, 1));
    const firstWeekLength = this.getFirstWeekLength(firstDayOfMonth.getUTCDay());

    return weekNumber === 1
      ? firstDayOfMonth
      : new Date(Date.UTC(year, month - 1, 1 + firstWeekLength + (weekNumber - 2) * 7));
  }

  calculateLastDate(value: string): Date {
    const { year, month, weekNumber } = this.parseValue(value);
    const firstDayOfMonth = new Date(Date.UTC(year, month - 1, 1));
    const firstWeekLength = this.getFirstWeekLength(firstDayOfMonth.getUTCDay());

    if (weekNumber === 1) {
      return new Date(Date.UTC(year, month - 1, firstWeekLength));
    }

    const lastDate = new Date(
      Date.UTC(year, month - 1, 1 + 6 + firstWeekLength + (weekNumber - 2) * 7)
    );

    // If we've gone into the next month, go back to the last day of the current month
    return lastDate.getUTCMonth() !== month - 1 ? new Date(Date.UTC(year, month, 0)) : lastDate;
  }

  calculatePrevious(value: string): string {
    const { year, month, weekNumber } = this.parseValue(value);

    return weekNumber === 1
      ? this.getPreviousMonthLastWeek(year, month)
      : this.formatWeek(year, month, weekNumber - 1);
  }

  calculateNext(value: string): string {
    const { year, month, weekNumber } = this.parseValue(value);
    const weeksInMonth = this.getWeeksInMonth(year, month);

    return weekNumber === weeksInMonth
      ? this.getNextMonthFirstWeek(year, month)
      : this.formatWeek(year, month, weekNumber + 1);
  }

  fromDate(date: Date): string {
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const firstDayOfMonth = new Date(Date.UTC(year, month - 1, 1));
    const firstWeekLength = this.getFirstWeekLength(firstDayOfMonth.getUTCDay());

    const weekNumber =
      date.getUTCDate() <= firstWeekLength
        ? 1
        : Math.floor((date.getUTCDate() - 1 - firstWeekLength) / 7) + 2;

    return this.formatWeek(year, month, weekNumber);
  }

  private parseValue(value: string): { year: number; month: number; weekNumber: number } {
    const year = parseInt(value.substring(0, 4));
    const month = parseInt(value.substring(5, 7));
    const weekNumber = parseInt(value.substring(9, value.indexOf('-', 9)));
    return { year, month, weekNumber };
  }

  private formatWeek(year: number, month: number, weekNumber: number): string {
    const monthStr = month < 10 ? `0${month}` : `${month}`;
    return `${year}-${monthStr}-W${weekNumber}-${this.periodicitySuffix}`;
  }

  private getPreviousMonthLastWeek(year: number, month: number): string {
    const [prevYear, prevMonth] = month === 1 ? [year - 1, 12] : [year, month - 1];
    const weeksInPrevMonth = this.getWeeksInMonth(prevYear, prevMonth);
    return this.formatWeek(prevYear, prevMonth, weeksInPrevMonth);
  }

  private getNextMonthFirstWeek(year: number, month: number): string {
    const [nextYear, nextMonth] = month === 12 ? [year + 1, 1] : [year, month + 1];
    return this.formatWeek(nextYear, nextMonth, 1);
  }

  private getFirstWeekLength(firstDayOfMonth: number): number {
    const offset = this.periodicitySuffix === 'sat' ? 1 : this.periodicitySuffix === 'sun' ? 0 : -1;
    return 7 - ((firstDayOfMonth + offset + 7) % 7);
  }

  private getWeeksInMonth(year: number, month: number): number {
    const firstDayOfMonth = new Date(Date.UTC(year, month - 1, 1));
    const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
    const firstWeekLength = this.getFirstWeekLength(firstDayOfMonth.getUTCDay());
    const remainingDays = daysInMonth - firstWeekLength;
    return Math.ceil(remainingDays / 7) + 1;
  }
}

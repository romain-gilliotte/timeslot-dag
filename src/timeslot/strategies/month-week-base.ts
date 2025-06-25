import { BaseTimeSlotStrategy } from './base';

export abstract class BaseMonthWeekStrategy extends BaseTimeSlotStrategy {
  protected abstract readonly weekStartDay: number;
  protected abstract readonly periodicitySuffix: string;

  calculateFirstDate(value: string): Date {
    const { year, month, weekNumber } = this.parseValue(value);

    const firstDayOfMonth = new Date(Date.UTC(year, month - 1, 1));
    const firstDayOfMonthDay = firstDayOfMonth.getUTCDay();
    const firstWeekLength = this.calculateFirstWeekLength(firstDayOfMonthDay);

    return weekNumber === 1
      ? firstDayOfMonth
      : new Date(Date.UTC(year, month - 1, 1 + firstWeekLength + (weekNumber - 2) * 7));
  }

  calculateLastDate(value: string): Date {
    const { year, month, weekNumber } = this.parseValue(value);

    const firstDayOfMonth = new Date(value.substring(0, 7) + '-01T00:00:00Z').getUTCDay();
    const firstWeekLength = this.calculateFirstWeekLength(firstDayOfMonth);

    if (weekNumber === 1) {
      return new Date(Date.UTC(year, month - 1, firstWeekLength));
    } else {
      const res = new Date(
        Date.UTC(year, month - 1, 1 + 6 + firstWeekLength + (weekNumber - 2) * 7)
      );

      if (res.getUTCMonth() !== month - 1) {
        res.setUTCDate(0);
      }

      return res;
    }
  }

  calculatePrevious(value: string): string {
    const { year, month, weekNumber } = this.parseValue(value);

    return weekNumber === 1
      ? this.getPreviousMonthWeek(year, month)
      : `${year}-${this.padMonth(month)}-W${weekNumber - 1}-${this.periodicitySuffix}`;
  }

  calculateNext(value: string): string {
    const { year, month, weekNumber } = this.parseValue(value);
    const weeksInMonth = this.getWeeksInMonth(year, month);

    return weekNumber === weeksInMonth
      ? this.getNextMonthWeek(year, month)
      : `${year}-${this.padMonth(month)}-W${weekNumber + 1}-${this.periodicitySuffix}`;
  }

  fromDate(date: Date): string {
    const prefix = date.toISOString().substring(0, 8);
    const firstDayOfMonth = new Date(
      Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1)
    ).getUTCDay();
    const firstWeekLength = this.calculateFirstWeekLength(firstDayOfMonth);

    return date.getUTCDate() <= firstWeekLength
      ? `${prefix}W1-${this.periodicitySuffix}`
      : `${prefix}W${Math.floor((date.getUTCDate() - 1 - firstWeekLength) / 7) + 2}-${
          this.periodicitySuffix
        }`;
  }

  private parseValue(value: string): { year: number; month: number; weekNumber: number } {
    const year = parseInt(value.substring(0, 4));
    const month = parseInt(value.substring(5, 7));
    const weekNumber = parseInt(value.substring(9, value.indexOf('-', 9)));
    return { year, month, weekNumber };
  }

  private getPreviousMonthWeek(year: number, month: number): string {
    return month === 1
      ? `${year - 1}-12-W${this.getWeeksInMonth(year - 1, 12)}-${this.periodicitySuffix}`
      : `${year}-${this.padMonth(month - 1)}-W${this.getWeeksInMonth(year, month - 1)}-${
          this.periodicitySuffix
        }`;
  }

  private getNextMonthWeek(year: number, month: number): string {
    return month === 12
      ? `${year + 1}-01-W1-${this.periodicitySuffix}`
      : `${year}-${this.padMonth(month + 1)}-W1-${this.periodicitySuffix}`;
  }

  private padMonth(month: number): string {
    return month < 10 ? `0${month}` : month.toString();
  }

  private calculateFirstWeekLength(firstDayOfMonth: number): number {
    if (this.periodicitySuffix === 'sat') {
      return 7 - ((firstDayOfMonth + 1) % 7);
    } else if (this.periodicitySuffix === 'sun') {
      return 7 - firstDayOfMonth;
    } else {
      return 7 - ((firstDayOfMonth - 1 + 7) % 7);
    }
  }

  private getWeeksInMonth(year: number, month: number): number {
    const firstDayOfMonth = new Date(Date.UTC(year, month - 1, 1));
    const lastDayOfMonth = new Date(Date.UTC(year, month, 0));
    const firstDayOfMonthDay = firstDayOfMonth.getUTCDay();
    const firstWeekLength = this.calculateFirstWeekLength(firstDayOfMonthDay);

    const daysInMonth = lastDayOfMonth.getUTCDate();
    const remainingDays = daysInMonth - firstWeekLength;

    return Math.ceil(remainingDays / 7) + 1;
  }
}

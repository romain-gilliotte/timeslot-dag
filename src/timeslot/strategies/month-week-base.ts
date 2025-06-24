import { BaseTimeSlotStrategy } from './base';
import { TimeSlotPeriodicity } from '../../periodicity';

export abstract class BaseMonthWeekStrategy extends BaseTimeSlotStrategy {
  protected abstract readonly weekStartDay: number;
  protected abstract readonly periodicitySuffix: string;

  calculateFirstDate(value: string): Date {
    const year = parseInt(value.substring(0, 4));
    const month = parseInt(value.substring(5, 7)) - 1;
    const weekNumber = parseInt(value.substring(9, value.indexOf('-', 9)));
    
    const firstDayOfMonth = new Date(Date.UTC(year, month, 1));
    const firstDayOfMonthDay = firstDayOfMonth.getUTCDay();
    const firstWeekLength = this.calculateFirstWeekLength(firstDayOfMonthDay);

    if (weekNumber === 1) {
      return firstDayOfMonth;
    } else {
      return new Date(Date.UTC(
        year,
        month,
        1 + firstWeekLength + (weekNumber - 2) * 7
      ));
    }
  }

  calculateLastDate(value: string): Date {
    const weekNumber = parseInt(value.substr(9, 1));
    const year = parseInt(value.substring(0, 4));
    const month = parseInt(value.substring(5, 7)) - 1;
    
    const firstDayOfMonth = new Date(value.substring(0, 7) + '-01T00:00:00Z').getUTCDay();
    const firstWeekLength = this.calculateFirstWeekLength(firstDayOfMonth);

    if (weekNumber === 1) {
      return new Date(Date.UTC(year, month, firstWeekLength));
    } else {
      const res = new Date(Date.UTC(
        year,
        month,
        1 + 6 + firstWeekLength + (weekNumber - 2) * 7
      ));

      if (res.getUTCMonth() !== month) {
        res.setUTCDate(0);
      }

      return res;
    }
  }

  calculatePrevious(value: string): string {
    const year = parseInt(value.substring(0, 4));
    const month = parseInt(value.substring(5, 7));
    const weekNumber = parseInt(value.substring(9, value.indexOf('-', 9)));
    
    if (weekNumber === 1) {
      if (month === 1) {
        const prevYear = year - 1;
        const weeksInPrevMonth = this.getWeeksInMonth(prevYear, 12);
        return `${prevYear}-12-W${weeksInPrevMonth}-${this.periodicitySuffix}`;
      } else {
        const prevMonth = month - 1;
        const weeksInPrevMonth = this.getWeeksInMonth(year, prevMonth);
        return `${year}-${prevMonth < 10 ? '0' + prevMonth : prevMonth}-W${weeksInPrevMonth}-${this.periodicitySuffix}`;
      }
    } else {
      return `${year}-${month < 10 ? '0' + month : month}-W${weekNumber - 1}-${this.periodicitySuffix}`;
    }
  }

  calculateNext(value: string): string {
    const year = parseInt(value.substring(0, 4));
    const month = parseInt(value.substring(5, 7));
    const weekNumber = parseInt(value.substring(9, value.indexOf('-', 9)));
    const weeksInMonth = this.getWeeksInMonth(year, month);
    
    if (weekNumber === weeksInMonth) {
      if (month === 12) {
        return `${year + 1}-01-W1-${this.periodicitySuffix}`;
      } else {
        const nextMonth = month + 1;
        return `${year}-${nextMonth < 10 ? '0' + nextMonth : nextMonth}-W1-${this.periodicitySuffix}`;
      }
    } else {
      return `${year}-${month < 10 ? '0' + month : month}-W${weekNumber + 1}-${this.periodicitySuffix}`;
    }
  }

  fromDate(date: Date): string {
    const prefix = date.toISOString().substring(0, 8);
    const firstDayOfMonth = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1)).getUTCDay();
    const firstWeekLength = this.calculateFirstWeekLength(firstDayOfMonth);

    if (date.getUTCDate() <= firstWeekLength) {
      return `${prefix}W1-${this.periodicitySuffix}`;
    } else {
      const weekNumber = Math.floor((date.getUTCDate() - 1 - firstWeekLength) / 7) + 2;
      return `${prefix}W${weekNumber}-${this.periodicitySuffix}`;
    }
  }

  get parentPeriodicities(): TimeSlotPeriodicity[] {
    return [
      this.getCorrespondingWeekPeriodicity(),
      TimeSlotPeriodicity.Month,
      TimeSlotPeriodicity.Quarter,
      TimeSlotPeriodicity.Semester,
      TimeSlotPeriodicity.Year,
      TimeSlotPeriodicity.All,
    ];
  }

  readonly childPeriodicities: TimeSlotPeriodicity[] = [TimeSlotPeriodicity.Day];

  private getCorrespondingWeekPeriodicity(): TimeSlotPeriodicity {
    const suffix = this.periodicitySuffix;
    if (suffix === 'sun') return TimeSlotPeriodicity.WeekSun;
    if (suffix === 'mon') return TimeSlotPeriodicity.WeekMon;
    if (suffix === 'sat') return TimeSlotPeriodicity.WeekSat;
    throw new Error(`Unknown week suffix: ${suffix}`);
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
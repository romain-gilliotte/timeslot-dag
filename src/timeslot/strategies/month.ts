import { BaseTimeSlotStrategy } from './base';
import { TimeSlotPeriodicity } from '../../periodicity';

export class MonthStrategy extends BaseTimeSlotStrategy {
  calculateFirstDate(value: string): Date {
    return new Date(Date.UTC(
      parseInt(value.substring(0, 4)),
      parseInt(value.substring(5, 7)) - 1,
      1
    ));
  }

  calculateLastDate(value: string): Date {
    const monthDate = this.calculateFirstDate(value);
    monthDate.setUTCMonth(monthDate.getUTCMonth() + 1);
    monthDate.setUTCDate(0); // Go to last day of previous month
    return monthDate;
  }

  calculatePrevious(value: string): string {
    const year = parseInt(value.substring(0, 4));
    const month = parseInt(value.substring(5, 7));
    
    if (month === 1) {
      return `${year - 1}-12`;
    } else {
      const prevMonth = month - 1;
      return `${year}-${prevMonth < 10 ? '0' + prevMonth : prevMonth}`;
    }
  }

  calculateNext(value: string): string {
    const year = parseInt(value.substring(0, 4));
    const month = parseInt(value.substring(5, 7));
    
    if (month === 12) {
      return `${year + 1}-01`;
    } else {
      const nextMonth = month + 1;
      return `${year}-${nextMonth < 10 ? '0' + nextMonth : nextMonth}`;
    }
  }

  fromDate(date: Date): string {
    return date.toISOString().substring(0, 7);
  }

  readonly parentPeriodicities: TimeSlotPeriodicity[] = [
    TimeSlotPeriodicity.Quarter,
    TimeSlotPeriodicity.Semester,
    TimeSlotPeriodicity.Year,
    TimeSlotPeriodicity.All,
  ];

  readonly childPeriodicities: TimeSlotPeriodicity[] = [
    TimeSlotPeriodicity.Day,
    TimeSlotPeriodicity.MonthWeekSat,
    TimeSlotPeriodicity.MonthWeekSun,
    TimeSlotPeriodicity.MonthWeekMon,
    TimeSlotPeriodicity.WeekSat,
    TimeSlotPeriodicity.WeekSun,
    TimeSlotPeriodicity.WeekMon,
  ];

  readonly periodicity: TimeSlotPeriodicity = TimeSlotPeriodicity.Month;
} 
import { BaseTimeSlotStrategy } from './base';
import { TimeSlotPeriodicity } from '../../periodicity';

export class MonthStrategy extends BaseTimeSlotStrategy {
  override calculateFirstDate(value: string): Date {
    return new Date(Date.UTC(
      parseInt(value.substring(0, 4)),
      parseInt(value.substring(5, 7)) - 1,
      1
    ));
  }

  override calculateLastDate(value: string): Date {
    const monthDate = this.calculateFirstDate(value);
    monthDate.setUTCMonth(monthDate.getUTCMonth() + 1);
    monthDate.setUTCDate(0); // Go to last day of previous month
    return monthDate;
  }

  override calculatePrevious(value: string): string {
    const year = parseInt(value.substring(0, 4));
    const month = parseInt(value.substring(5, 7));
    
    if (month === 1) {
      return `${year - 1}-12`;
    } else {
      const prevMonth = month - 1;
      return `${year}-${prevMonth < 10 ? '0' + prevMonth : prevMonth}`;
    }
  }

  override calculateNext(value: string): string {
    const year = parseInt(value.substring(0, 4));
    const month = parseInt(value.substring(5, 7));
    
    if (month === 12) {
      return `${year + 1}-01`;
    } else {
      const nextMonth = month + 1;
      return `${year}-${nextMonth < 10 ? '0' + nextMonth : nextMonth}`;
    }
  }

  override fromDate(date: Date): string {
    return date.toISOString().substring(0, 7);
  }

  override readonly parentPeriodicities: TimeSlotPeriodicity[] = [
    TimeSlotPeriodicity.Quarter,
    TimeSlotPeriodicity.Semester,
    TimeSlotPeriodicity.Year,
    TimeSlotPeriodicity.All,
  ];

  override readonly childPeriodicities: TimeSlotPeriodicity[] = [
    TimeSlotPeriodicity.Day,
    TimeSlotPeriodicity.MonthWeekSat,
    TimeSlotPeriodicity.MonthWeekSun,
    TimeSlotPeriodicity.MonthWeekMon,
    TimeSlotPeriodicity.WeekSat,
    TimeSlotPeriodicity.WeekSun,
    TimeSlotPeriodicity.WeekMon,
  ];

  override readonly periodicity: TimeSlotPeriodicity = TimeSlotPeriodicity.Month;
} 
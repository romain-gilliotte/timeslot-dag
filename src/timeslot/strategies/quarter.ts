import { BaseTimeSlotStrategy } from './base';
import { TimeSlotPeriodicity } from '../../periodicity';

export class QuarterStrategy extends BaseTimeSlotStrategy {
  override calculateFirstDate(value: string): Date {
    const year = parseInt(value.substring(0, 4));
    const quarter = parseInt(value.substring(6));
    return new Date(Date.UTC(year, (quarter - 1) * 3, 1));
  }

  override calculateLastDate(value: string): Date {
    const quarterDate = this.calculateFirstDate(value);
    quarterDate.setUTCMonth(quarterDate.getUTCMonth() + 3);
    quarterDate.setUTCDate(0); // Go to last day of previous month
    return quarterDate;
  }

  override calculatePrevious(value: string): string {
    const year = parseInt(value.substring(0, 4));
    const quarter = parseInt(value.substring(6));
    
    if (quarter === 1) {
      return `${year - 1}-Q4`;
    } else {
      return `${year}-Q${quarter - 1}`;
    }
  }

  override calculateNext(value: string): string {
    const year = parseInt(value.substring(0, 4));
    const quarter = parseInt(value.substring(6));
    
    if (quarter === 4) {
      return `${year + 1}-Q1`;
    } else {
      return `${year}-Q${quarter + 1}`;
    }
  }

  override fromDate(date: Date): string {
    return `${date.getUTCFullYear()}-Q${1 + Math.floor(date.getUTCMonth() / 3)}`;
  }

  override readonly parentPeriodicities: TimeSlotPeriodicity[] = [
    TimeSlotPeriodicity.Semester,
    TimeSlotPeriodicity.Year,
    TimeSlotPeriodicity.All,
  ];

  override readonly childPeriodicities: TimeSlotPeriodicity[] = [
    TimeSlotPeriodicity.Month,
    TimeSlotPeriodicity.Day,
    TimeSlotPeriodicity.WeekSat,
    TimeSlotPeriodicity.WeekSun,
    TimeSlotPeriodicity.WeekMon,
    TimeSlotPeriodicity.MonthWeekSat,
    TimeSlotPeriodicity.MonthWeekSun,
    TimeSlotPeriodicity.MonthWeekMon,
  ];

  override readonly periodicity: TimeSlotPeriodicity = TimeSlotPeriodicity.Quarter;
} 
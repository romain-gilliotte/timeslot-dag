import { BaseTimeSlotStrategy } from './base';
import { TimeSlotPeriodicity } from '../../periodicity';

export class SemesterStrategy extends BaseTimeSlotStrategy {
  override calculateFirstDate(value: string): Date {
    const year = parseInt(value.substring(0, 4));
    const semester = parseInt(value.substring(6));
    return new Date(Date.UTC(year, (semester - 1) * 6, 1));
  }

  override calculateLastDate(value: string): Date {
    const semesterDate = this.calculateFirstDate(value);
    semesterDate.setUTCMonth(semesterDate.getUTCMonth() + 6);
    semesterDate.setUTCDate(0); // Go to last day of previous month
    return semesterDate;
  }

  override calculatePrevious(value: string): string {
    const year = parseInt(value.substring(0, 4));
    const semester = parseInt(value.substring(6));
    
    if (semester === 1) {
      return `${year - 1}-S2`;
    } else {
      return `${year}-S1`;
    }
  }

  override calculateNext(value: string): string {
    const year = parseInt(value.substring(0, 4));
    const semester = parseInt(value.substring(6));
    
    if (semester === 2) {
      return `${year + 1}-S1`;
    } else {
      return `${year}-S2`;
    }
  }

  override fromDate(date: Date): string {
    return `${date.getUTCFullYear()}-S${1 + Math.floor(date.getUTCMonth() / 6)}`;
  }

  override readonly parentPeriodicities: TimeSlotPeriodicity[] = [
    TimeSlotPeriodicity.Year,
    TimeSlotPeriodicity.All,
  ];

  override readonly childPeriodicities: TimeSlotPeriodicity[] = [
    TimeSlotPeriodicity.Quarter,
    TimeSlotPeriodicity.Month,
    TimeSlotPeriodicity.Day,
    TimeSlotPeriodicity.WeekSat,
    TimeSlotPeriodicity.WeekSun,
    TimeSlotPeriodicity.WeekMon,
    TimeSlotPeriodicity.MonthWeekSat,
    TimeSlotPeriodicity.MonthWeekSun,
    TimeSlotPeriodicity.MonthWeekMon,
  ];

  override readonly periodicity: TimeSlotPeriodicity = TimeSlotPeriodicity.Semester;
} 
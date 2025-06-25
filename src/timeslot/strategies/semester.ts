import { BaseTimeSlotStrategy } from './base';
import { TimeSlotPeriodicity } from '../../periodicity';

export class SemesterStrategy extends BaseTimeSlotStrategy {
  override readonly periodicity: TimeSlotPeriodicity = TimeSlotPeriodicity.Semester;

  override calculateFirstDate(value: string): Date {
    const { year, semester } = this.parseValue(value);
    return new Date(Date.UTC(year, (semester - 1) * 6, 1));
  }

  override calculateLastDate(value: string): Date {
    const semesterDate = this.calculateFirstDate(value);
    semesterDate.setUTCMonth(semesterDate.getUTCMonth() + 6);
    semesterDate.setUTCDate(0); // Go to last day of previous month
    return semesterDate;
  }

  override calculatePrevious(value: string): string {
    const { year, semester } = this.parseValue(value);
    return semester === 1 ? `${year - 1}-S2` : `${year}-S1`;
  }

  override calculateNext(value: string): string {
    const { year, semester } = this.parseValue(value);
    return semester === 2 ? `${year + 1}-S1` : `${year}-S2`;
  }

  override fromDate(date: Date): string {
    return `${date.getUTCFullYear()}-S${1 + Math.floor(date.getUTCMonth() / 6)}`;
  }

  private parseValue(value: string): { year: number; semester: number } {
    const year = parseInt(value.substring(0, 4));
    const semester = parseInt(value.substring(6));
    return { year, semester };
  }
}

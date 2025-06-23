import { TimeSlotPeriodicity } from '../periodicity';
import { Locale } from './types';

const MONTHS: string[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const PERIODICITIES: Record<TimeSlotPeriodicity, string> = {
  [TimeSlotPeriodicity.Day]: 'Day',
  [TimeSlotPeriodicity.MonthWeekSat]: 'Week (saturday to friday / split by month)',
  [TimeSlotPeriodicity.MonthWeekSun]: 'Week (sunday to saturday / split by month)',
  [TimeSlotPeriodicity.MonthWeekMon]: 'Week (monday to sunday / split by month)',
  [TimeSlotPeriodicity.WeekSat]: 'Week (saturday to friday)',
  [TimeSlotPeriodicity.WeekSun]: 'Week (sunday to saturday)',
  [TimeSlotPeriodicity.WeekMon]: 'Week (monday to sunday)',
  [TimeSlotPeriodicity.Month]: 'Month',
  [TimeSlotPeriodicity.Quarter]: 'Quarter',
  [TimeSlotPeriodicity.Semester]: 'Semester',
  [TimeSlotPeriodicity.Year]: 'Year',
  [TimeSlotPeriodicity.All]: 'All',
};

const locale: Locale = {
  humanizeValue(periodicity: TimeSlotPeriodicity, value: string): string {
    const year = value.substring(0, 4);

    switch (periodicity) {
      case TimeSlotPeriodicity.All:
        return 'All';

      case TimeSlotPeriodicity.Year:
      case TimeSlotPeriodicity.Semester:
      case TimeSlotPeriodicity.Quarter:
        return value;

      case TimeSlotPeriodicity.Month:
        return MONTHS[parseInt(value.substring(5, 7)) - 1] + ' ' + year;

      case TimeSlotPeriodicity.MonthWeekSat:
      case TimeSlotPeriodicity.MonthWeekSun:
      case TimeSlotPeriodicity.MonthWeekMon:
        return value.substring(0, 10);

      case TimeSlotPeriodicity.WeekSat:
      case TimeSlotPeriodicity.WeekSun:
      case TimeSlotPeriodicity.WeekMon:
        return value.substring(0, 8);

      case TimeSlotPeriodicity.Day:
        return MONTHS[parseInt(value.substring(5, 7)) - 1] + ' ' + value.substring(8) + ', ' + year;

      default:
        return value;
    }
  },

  humanizePeriodicity(periodicity: TimeSlotPeriodicity): string {
    return PERIODICITIES[periodicity] || periodicity;
  },
};

export default locale; 
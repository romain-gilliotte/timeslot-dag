import { TimeSlotPeriodicity } from '../periodicity';
import { Locale } from './types';

const MONTHS: string[] = [
  'Janvier',
  'Février',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Août',
  'Septembre',
  'Octobre',
  'Novembre',
  'Décembre',
];

const SEMESTERS: string[] = ['1er sem.', '2ème sem.'];

const QUARTERS: string[] = ['1er trim.', '2ème trim.', '3ème trim.', '4ème trim.'];

const PERIODICITIES: Record<TimeSlotPeriodicity, string> = {
  [TimeSlotPeriodicity.Day]: 'Jour',
  [TimeSlotPeriodicity.MonthWeekSat]: 'Semaines (samedi à vendredi / coupées par mois)',
  [TimeSlotPeriodicity.MonthWeekSun]: 'Semaines (dimanche à samedi / coupées par mois)',
  [TimeSlotPeriodicity.MonthWeekMon]: 'Semaines (lundi à dimanche / coupées par mois)',
  [TimeSlotPeriodicity.WeekSat]: 'Semaines (samedi à vendredi)',
  [TimeSlotPeriodicity.WeekSun]: 'Semaines (dimanche à samedi)',
  [TimeSlotPeriodicity.WeekMon]: 'Semaines (lundi à dimanche)',
  [TimeSlotPeriodicity.Month]: 'Mois',
  [TimeSlotPeriodicity.Quarter]: 'Trimestre',
  [TimeSlotPeriodicity.Semester]: 'Semestre',
  [TimeSlotPeriodicity.Year]: 'Année',
  [TimeSlotPeriodicity.All]: 'Tout',
};

const locale: Locale = {
  humanizeValue(periodicity: TimeSlotPeriodicity, value: string): string {
    const year = value.substring(0, 4);

    switch (periodicity) {
      case TimeSlotPeriodicity.All:
        return 'Tout';

      case TimeSlotPeriodicity.Year:
        return year;

      case TimeSlotPeriodicity.Semester:
        return SEMESTERS[parseInt(value.substring(6)) - 1] + ' ' + year;

      case TimeSlotPeriodicity.Quarter:
        return QUARTERS[parseInt(value.substring(6)) - 1] + ' ' + year;

      case TimeSlotPeriodicity.Month:
        return MONTHS[parseInt(value.substring(5, 7)) - 1] + ' ' + year;

      case TimeSlotPeriodicity.MonthWeekSat:
      case TimeSlotPeriodicity.MonthWeekSun:
      case TimeSlotPeriodicity.MonthWeekMon:
        return (
          'Sem. ' + value.substring(9, 10) + ' ' + MONTHS[parseInt(value.substring(5, 7)) - 1] + ' ' + year
        );

      case TimeSlotPeriodicity.WeekSat:
      case TimeSlotPeriodicity.WeekSun:
      case TimeSlotPeriodicity.WeekMon:
        return 'Sem. ' + value.substring(6, 8) + ' ' + year;

      case TimeSlotPeriodicity.Day:
        return value.substring(8) + ' ' + MONTHS[parseInt(value.substring(5, 7)) - 1] + ' ' + year;

      default:
        return value;
    }
  },

  humanizePeriodicity(periodicity: TimeSlotPeriodicity): string {
    return PERIODICITIES[periodicity] || periodicity;
  },
};

export default locale; 
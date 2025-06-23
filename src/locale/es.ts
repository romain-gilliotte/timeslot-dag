import { TimeSlotPeriodicity } from '../periodicity';
import { Locale } from './types';

const MONTHS: string[] = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

const SEMESTERS: string[] = ['Primer sem.', 'Segundo sem.'];

const QUARTERS: string[] = ['Primer trim.', 'Segundo trim.', 'Tercero trim.', 'Cuarto trim.'];

const PERIODICITIES: Record<TimeSlotPeriodicity, string> = {
  [TimeSlotPeriodicity.Day]: 'Día',
  [TimeSlotPeriodicity.MonthWeekSat]: 'Semana (sábado a viernes / cortado por mes)',
  [TimeSlotPeriodicity.MonthWeekSun]: 'Semana (domingo a sábado / cortado por mes)',
  [TimeSlotPeriodicity.MonthWeekMon]: 'Semana (lunes a domingo / cortado por mes)',
  [TimeSlotPeriodicity.WeekSat]: 'Semana (sábado a viernes)',
  [TimeSlotPeriodicity.WeekSun]: 'Semana (domingo a sábado)',
  [TimeSlotPeriodicity.WeekMon]: 'Semana (lunes a domingo)',
  [TimeSlotPeriodicity.Month]: 'Mes',
  [TimeSlotPeriodicity.Quarter]: 'Trimestre',
  [TimeSlotPeriodicity.Semester]: 'Semestre',
  [TimeSlotPeriodicity.Year]: 'Año',
  [TimeSlotPeriodicity.All]: 'Todo',
};

const locale: Locale = {
  humanizeValue(periodicity: TimeSlotPeriodicity, value: string): string {
    const year = value.substring(0, 4);

    switch (periodicity) {
      case TimeSlotPeriodicity.All:
        return 'Todo';

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
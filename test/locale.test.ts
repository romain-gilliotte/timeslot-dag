import en from '../src/locale/en';
import fr from '../src/locale/fr';
import es from '../src/locale/es';
import { TimeSlotPeriodicity } from '../src/periodicity';

describe('Locale files', () => {
  const locales = { en, fr, es };
  const periodicities = [
    TimeSlotPeriodicity.Day,
    TimeSlotPeriodicity.Month,
    TimeSlotPeriodicity.Quarter,
    TimeSlotPeriodicity.Semester,
    TimeSlotPeriodicity.Year,
    TimeSlotPeriodicity.All,
    TimeSlotPeriodicity.WeekSat,
    TimeSlotPeriodicity.WeekSun,
    TimeSlotPeriodicity.WeekMon,
    TimeSlotPeriodicity.MonthWeekSat,
    TimeSlotPeriodicity.MonthWeekSun,
    TimeSlotPeriodicity.MonthWeekMon,
  ];

  Object.entries(locales).forEach(([lang, locale]) => {
    describe(`${lang} locale`, () => {
      it('should humanize all periodicities', () => {
        for (const p of periodicities) {
          const label = locale.humanizePeriodicity(p);
          expect(typeof label).toBe('string');
          expect(label.length).toBeGreaterThan(0);
        }
      });

      it('should humanize values for all periodicities', () => {
        expect(locale.humanizeValue(TimeSlotPeriodicity.Day, '2023-05-01')).toMatch(/2023/);
        expect(locale.humanizeValue(TimeSlotPeriodicity.Month, '2023-05')).toMatch(/2023/);
        expect(locale.humanizeValue(TimeSlotPeriodicity.Quarter, '2023-Q2')).toMatch(/2023/);
        expect(locale.humanizeValue(TimeSlotPeriodicity.Semester, '2023-S1')).toMatch(/2023/);
        expect(locale.humanizeValue(TimeSlotPeriodicity.Year, '2023')).toMatch(/2023/);
        if (lang === 'en') {
          expect(locale.humanizeValue(TimeSlotPeriodicity.All, 'all')).toMatch(/all/i);
        } else if (lang === 'fr') {
          expect(locale.humanizeValue(TimeSlotPeriodicity.All, 'all')).toBe('Tout');
        } else if (lang === 'es') {
          expect(locale.humanizeValue(TimeSlotPeriodicity.All, 'all')).toBe('Todo');
        }
        expect(locale.humanizeValue(TimeSlotPeriodicity.WeekSun, '2023-W01-sun')).toMatch(/2023/);
        expect(locale.humanizeValue(TimeSlotPeriodicity.MonthWeekSun, '2023-05-W1-sun')).toMatch(/2023/);
      });
    });
  });
}); 
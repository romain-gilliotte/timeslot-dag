import { TimeSlot } from '../src/timeslot';
import { TimeSlotPeriodicity } from '../src/periodicity';

describe('TimeSlot', () => {
  describe('.fromValue', () => {
    it('should not allow invalid values with fromValue', () => {
      expect(() => TimeSlot.fromValue('Malaria', true)).toThrow();
    });

    it('should not allow invalid values with constructor', () => {
      expect(() => new TimeSlot('Malaria', true)).toThrow();
    });

    it('should allow valid values without validation', () => {
      expect(() => TimeSlot.fromValue('2010-01-01')).not.toThrow();
      expect(() => new TimeSlot('2010-01-01')).not.toThrow();
    });
  });

  describe('.periodicity', () => {
    it('should work with year format', () => {
      const ts = TimeSlot.fromValue('2010');
      expect(ts.periodicity).toBe(TimeSlotPeriodicity.Year);
    });

    it('should work with semester format', () => {
      const ts = TimeSlot.fromValue('2010-S1');
      expect(ts.periodicity).toBe(TimeSlotPeriodicity.Semester);
    });

    it('should work with quarter format', () => {
      const ts = TimeSlot.fromValue('2010-Q1');
      expect(ts.periodicity).toBe(TimeSlotPeriodicity.Quarter);
    });

    it('should work with month format', () => {
      const ts = TimeSlot.fromValue('2010-10');
      expect(ts.periodicity).toBe(TimeSlotPeriodicity.Month);
    });

    it('should work with month_week_sat formats', () => {
      const ts = TimeSlot.fromValue('2010-05-W1-sat');
      expect(ts.periodicity).toBe(TimeSlotPeriodicity.MonthWeekSat);
    });

    it('should work with month_week_sun formats', () => {
      const ts = TimeSlot.fromValue('2010-05-W1-sun');
      expect(ts.periodicity).toBe(TimeSlotPeriodicity.MonthWeekSun);
    });

    it('should work with month_week_mon formats', () => {
      const ts = TimeSlot.fromValue('2010-05-W1-mon');
      expect(ts.periodicity).toBe(TimeSlotPeriodicity.MonthWeekMon);
    });

    it('should work with week_sat formats', () => {
      const ts = TimeSlot.fromValue('2010-W01-sat');
      expect(ts.periodicity).toBe(TimeSlotPeriodicity.WeekSat);
    });

    it('should work with week_sun formats', () => {
      const ts = TimeSlot.fromValue('2010-W01-sun');
      expect(ts.periodicity).toBe(TimeSlotPeriodicity.WeekSun);
    });

    it('should work with week_mon formats', () => {
      const ts = TimeSlot.fromValue('2010-W01-mon');
      expect(ts.periodicity).toBe(TimeSlotPeriodicity.WeekMon);
    });

    it('should work with day formats', () => {
      const ts = TimeSlot.fromValue('2010-01-02');
      expect(ts.periodicity).toBe(TimeSlotPeriodicity.Day);
    });

    it('should work with all format', () => {
      const ts = TimeSlot.fromValue('all');
      expect(ts.periodicity).toBe(TimeSlotPeriodicity.All);
    });
  });

  describe('.firstDate', () => {
    it('should work with month_week_sun format week 1', () => {
      const ts = TimeSlot.fromValue('2017-05-W1-sun');
      expect(ts.firstDate.getUTCDate()).toBe(1);
    });

    it('should work with month_week_sun format week 2', () => {
      const ts = TimeSlot.fromValue('2017-05-W2-sun');
      expect(ts.firstDate.getUTCDate()).toBe(7);
    });

    it('should work with month_week_sun format week 5', () => {
      const ts = TimeSlot.fromValue('2017-05-W5-sun');
      expect(ts.firstDate.getUTCDate()).toBe(28);
    });

    it('should work with day format', () => {
      const ts = TimeSlot.fromValue('2017-05-15');
      expect(ts.firstDate.getUTCDate()).toBe(15);
      expect(ts.firstDate.getUTCMonth()).toBe(4); // May is month 4 (0-indexed)
      expect(ts.firstDate.getUTCFullYear()).toBe(2017);
    });

    it('should work with month format', () => {
      const ts = TimeSlot.fromValue('2017-05');
      expect(ts.firstDate.getUTCDate()).toBe(1);
      expect(ts.firstDate.getUTCMonth()).toBe(4); // May is month 4 (0-indexed)
      expect(ts.firstDate.getUTCFullYear()).toBe(2017);
    });
  });

  describe('.lastDate', () => {
    it('should work with month_week_sun format week 1', () => {
      const ts = TimeSlot.fromValue('2017-05-W1-sun');
      expect(ts.lastDate.getUTCDate()).toBe(6);
    });

    it('should work with month_week_sun format week 2', () => {
      const ts = TimeSlot.fromValue('2017-05-W2-sun');
      expect(ts.lastDate.getUTCDate()).toBe(13);
    });

    it('should work with month_week_sun format week 5', () => {
      const ts = TimeSlot.fromValue('2017-05-W5-sun');
      expect(ts.lastDate.getUTCDate()).toBe(31);
    });

    it('should work with day format', () => {
      const ts = TimeSlot.fromValue('2017-05-15');
      expect(ts.lastDate.getUTCDate()).toBe(15);
      expect(ts.lastDate.getUTCMonth()).toBe(4); // May is month 4 (0-indexed)
      expect(ts.lastDate.getUTCFullYear()).toBe(2017);
    });

    it('should work with month format', () => {
      const ts = TimeSlot.fromValue('2017-05');
      expect(ts.lastDate.getUTCDate()).toBe(31);
      expect(ts.lastDate.getUTCMonth()).toBe(4); // May is month 4 (0-indexed)
      expect(ts.lastDate.getUTCFullYear()).toBe(2017);
    });
  });

  describe('.previous()', () => {
    it('should work with month_week_sun formats within same month', () => {
      let ts = TimeSlot.fromValue('2017-07-W6-sun');
      ts = ts.previous();
      expect(ts.value).toBe('2017-07-W5-sun');
      ts = ts.previous();
      expect(ts.value).toBe('2017-07-W4-sun');
      ts = ts.previous();
      expect(ts.value).toBe('2017-07-W3-sun');
      ts = ts.previous();
      expect(ts.value).toBe('2017-07-W2-sun');
      ts = ts.previous();
      expect(ts.value).toBe('2017-07-W1-sun');
    });

    it('should work with month_week_sun formats across month boundaries', () => {
      let ts = TimeSlot.fromValue('2017-07-W1-sun');
      ts = ts.previous();
      expect(ts.value).toBe('2017-06-W5-sun');
      ts = ts.previous();
      expect(ts.value).toBe('2017-06-W4-sun');
      ts = ts.previous();
      expect(ts.value).toBe('2017-06-W3-sun');
      ts = ts.previous();
      expect(ts.value).toBe('2017-06-W2-sun');
      ts = ts.previous();
      expect(ts.value).toBe('2017-06-W1-sun');
    });

    it('should work with month_week_sun formats across multiple months', () => {
      let ts = TimeSlot.fromValue('2017-06-W1-sun');
      ts = ts.previous();
      expect(ts.value).toBe('2017-05-W5-sun');
      ts = ts.previous();
      expect(ts.value).toBe('2017-05-W4-sun');
      ts = ts.previous();
      expect(ts.value).toBe('2017-05-W3-sun');
      ts = ts.previous();
      expect(ts.value).toBe('2017-05-W2-sun');
      ts = ts.previous();
      expect(ts.value).toBe('2017-05-W1-sun');
    });

    it('should work with day format', () => {
      let ts = TimeSlot.fromValue('2017-05-15');
      ts = ts.previous();
      expect(ts.value).toBe('2017-05-14');
    });

    it('should work with month format', () => {
      let ts = TimeSlot.fromValue('2017-05');
      ts = ts.previous();
      expect(ts.value).toBe('2017-04');
    });
  });

  describe('.next()', () => {
    it('should work with month_week_sun formats within same month', () => {
      let ts = TimeSlot.fromValue('2017-05-W1-sun');
      ts = ts.next();
      expect(ts.value).toBe('2017-05-W2-sun');
      ts = ts.next();
      expect(ts.value).toBe('2017-05-W3-sun');
      ts = ts.next();
      expect(ts.value).toBe('2017-05-W4-sun');
      ts = ts.next();
      expect(ts.value).toBe('2017-05-W5-sun');
    });

    it('should work with month_week_sun formats across month boundaries', () => {
      let ts = TimeSlot.fromValue('2017-05-W5-sun');
      ts = ts.next();
      expect(ts.value).toBe('2017-06-W1-sun');
      ts = ts.next();
      expect(ts.value).toBe('2017-06-W2-sun');
      ts = ts.next();
      expect(ts.value).toBe('2017-06-W3-sun');
      ts = ts.next();
      expect(ts.value).toBe('2017-06-W4-sun');
      ts = ts.next();
      expect(ts.value).toBe('2017-06-W5-sun');
    });

    it('should work with month_week_sun formats across multiple months', () => {
      let ts = TimeSlot.fromValue('2017-06-W5-sun');
      ts = ts.next();
      expect(ts.value).toBe('2017-07-W1-sun');
      ts = ts.next();
      expect(ts.value).toBe('2017-07-W2-sun');
      ts = ts.next();
      expect(ts.value).toBe('2017-07-W3-sun');
      ts = ts.next();
      expect(ts.value).toBe('2017-07-W4-sun');
      ts = ts.next();
      expect(ts.value).toBe('2017-07-W5-sun');
      ts = ts.next();
      expect(ts.value).toBe('2017-07-W6-sun');
    });

    it('should work with day format', () => {
      let ts = TimeSlot.fromValue('2017-05-15');
      ts = ts.next();
      expect(ts.value).toBe('2017-05-16');
    });

    it('should work with month format', () => {
      let ts = TimeSlot.fromValue('2017-05');
      ts = ts.next();
      expect(ts.value).toBe('2017-06');
    });
  });

  describe('.parentPeriodicities', () => {
    it('should work with month_week_sun format', () => {
      const ts = TimeSlot.fromValue('2017-05-W1-sun');
      expect(ts.parentPeriodicities).toEqual([
        TimeSlotPeriodicity.WeekSun,
        TimeSlotPeriodicity.Month,
        TimeSlotPeriodicity.Quarter,
        TimeSlotPeriodicity.Semester,
        TimeSlotPeriodicity.Year,
        TimeSlotPeriodicity.All,
      ]);
    });

    it('should work with day format', () => {
      const ts = TimeSlot.fromValue('2017-05-15');
      expect(ts.parentPeriodicities).toEqual([
        TimeSlotPeriodicity.MonthWeekSat,
        TimeSlotPeriodicity.MonthWeekSun,
        TimeSlotPeriodicity.MonthWeekMon,
        TimeSlotPeriodicity.WeekSat,
        TimeSlotPeriodicity.WeekSun,
        TimeSlotPeriodicity.WeekMon,
        TimeSlotPeriodicity.Month,
        TimeSlotPeriodicity.Quarter,
        TimeSlotPeriodicity.Semester,
        TimeSlotPeriodicity.Year,
        TimeSlotPeriodicity.All,
      ]);
    });
  });

  describe('.childPeriodicities', () => {
    it('should work with month_week_sun format', () => {
      const ts = TimeSlot.fromValue('2017-05-W1-sun');
      expect(ts.childPeriodicities).toEqual([TimeSlotPeriodicity.Day]);
    });

    it('should work with month format', () => {
      const ts = TimeSlot.fromValue('2017-05');
      expect(ts.childPeriodicities).toEqual([
        TimeSlotPeriodicity.Day,
        TimeSlotPeriodicity.MonthWeekSat,
        TimeSlotPeriodicity.MonthWeekSun,
        TimeSlotPeriodicity.MonthWeekMon,
        TimeSlotPeriodicity.WeekSat,
        TimeSlotPeriodicity.WeekSun,
        TimeSlotPeriodicity.WeekMon,
      ]);
    });

    it('should work with all format', () => {
      const ts = TimeSlot.fromValue('all');
      expect(ts.childPeriodicities).toEqual([
        TimeSlotPeriodicity.Day,
        TimeSlotPeriodicity.MonthWeekSat,
        TimeSlotPeriodicity.MonthWeekSun,
        TimeSlotPeriodicity.MonthWeekMon,
        TimeSlotPeriodicity.WeekSat,
        TimeSlotPeriodicity.WeekSun,
        TimeSlotPeriodicity.WeekMon,
        TimeSlotPeriodicity.Month,
        TimeSlotPeriodicity.Quarter,
        TimeSlotPeriodicity.Semester,
        TimeSlotPeriodicity.Year,
      ]);
    });
  });

  describe('.humanizePeriodicity', () => {
    it('should work with English locale', () => {
      const ts = TimeSlot.fromValue('2017-05-W1-sun');
      expect(ts.humanizePeriodicity('en')).toBe('Week (sunday to saturday / split by month)');
    });

    it('should work with French locale', () => {
      const ts = TimeSlot.fromValue('2017-05-W1-sun');
      expect(ts.humanizePeriodicity('fr')).toBe('Semaines (dimanche à samedi / coupées par mois)');
    });

    it('should work with Spanish locale', () => {
      const ts = TimeSlot.fromValue('2017-05-W1-sun');
      expect(ts.humanizePeriodicity('es')).toBe('Semana (domingo a sábado / cortado por mes)');
    });

    it('should throw error for unknown locale', () => {
      const ts = TimeSlot.fromValue('2017-05-W1-sun');
      expect(() => ts.humanizePeriodicity('unknown')).toThrow(/Unknown locale: unknown/);
    });
  });

  describe('.humanizeValue', () => {
    it('should work with English locale', () => {
      const ts = TimeSlot.fromValue('2017-05-W1-sun');
      expect(ts.humanizeValue('en')).toBe('2017-05-W1');
    });

    it('should work with French locale', () => {
      const ts = TimeSlot.fromValue('2017-05-W1-sun');
      expect(ts.humanizeValue('fr')).toBe('Sem. 1 Mai 2017');
    });

    it('should work with Spanish locale', () => {
      const ts = TimeSlot.fromValue('2017-05-W1-sun');
      expect(ts.humanizeValue('es')).toBe('Sem. 1 Mayo 2017');
    });

    it('should throw error for unknown locale', () => {
      const ts = TimeSlot.fromValue('2017-05-W1-sun');
      expect(() => ts.humanizeValue('unknown')).toThrow(/Unknown locale: unknown/);
    });
  });
}); 
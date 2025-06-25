import { TimeSlot } from '../src/timeslot';
import { TimeSlotPeriodicity } from '../src/periodicity';

describe('Strategy Tests', () => {
  describe('Quarter Strategy', () => {
    it('should calculate first date correctly', () => {
      const ts = TimeSlot.fromValue('2023-Q1');
      expect(ts.firstDate).toEqual(new Date(Date.UTC(2023, 0, 1)));

      const ts2 = TimeSlot.fromValue('2023-Q2');
      expect(ts2.firstDate).toEqual(new Date(Date.UTC(2023, 3, 1)));

      const ts3 = TimeSlot.fromValue('2023-Q3');
      expect(ts3.firstDate).toEqual(new Date(Date.UTC(2023, 6, 1)));

      const ts4 = TimeSlot.fromValue('2023-Q4');
      expect(ts4.firstDate).toEqual(new Date(Date.UTC(2023, 9, 1)));
    });

    it('should calculate last date correctly', () => {
      const ts = TimeSlot.fromValue('2023-Q1');
      expect(ts.lastDate).toEqual(new Date(Date.UTC(2023, 2, 31)));

      const ts2 = TimeSlot.fromValue('2023-Q2');
      expect(ts2.lastDate).toEqual(new Date(Date.UTC(2023, 5, 30)));

      const ts3 = TimeSlot.fromValue('2023-Q3');
      expect(ts3.lastDate).toEqual(new Date(Date.UTC(2023, 8, 30)));

      const ts4 = TimeSlot.fromValue('2023-Q4');
      expect(ts4.lastDate).toEqual(new Date(Date.UTC(2023, 11, 31)));
    });

    it('should navigate to previous quarter', () => {
      let ts = TimeSlot.fromValue('2023-Q2');
      ts = ts.previous();
      expect(ts.value).toBe('2023-Q1');

      ts = TimeSlot.fromValue('2023-Q1');
      ts = ts.previous();
      expect(ts.value).toBe('2022-Q4');
    });

    it('should navigate to next quarter', () => {
      let ts = TimeSlot.fromValue('2023-Q2');
      ts = ts.next();
      expect(ts.value).toBe('2023-Q3');

      ts = TimeSlot.fromValue('2023-Q4');
      ts = ts.next();
      expect(ts.value).toBe('2024-Q1');
    });

    it('should create from date correctly', () => {
      const date1 = new Date(Date.UTC(2023, 0, 15)); // January
      const ts1 = TimeSlot.fromDate(date1, TimeSlotPeriodicity.Quarter);
      expect(ts1.value).toBe('2023-Q1');

      const date2 = new Date(Date.UTC(2023, 3, 15)); // April
      const ts2 = TimeSlot.fromDate(date2, TimeSlotPeriodicity.Quarter);
      expect(ts2.value).toBe('2023-Q2');

      const date3 = new Date(Date.UTC(2023, 6, 15)); // July
      const ts3 = TimeSlot.fromDate(date3, TimeSlotPeriodicity.Quarter);
      expect(ts3.value).toBe('2023-Q3');

      const date4 = new Date(Date.UTC(2023, 9, 15)); // October
      const ts4 = TimeSlot.fromDate(date4, TimeSlotPeriodicity.Quarter);
      expect(ts4.value).toBe('2023-Q4');
    });

    it('should have correct parent periodicities', () => {
      const ts = TimeSlot.fromValue('2023-Q2');
      expect(ts.parentPeriodicities).toEqual([
        TimeSlotPeriodicity.Semester,
        TimeSlotPeriodicity.Year,
        TimeSlotPeriodicity.All,
      ]);
    });

    it('should have correct child periodicities', () => {
      const ts = TimeSlot.fromValue('2023-Q2');
      expect(ts.childPeriodicities).toEqual([
        TimeSlotPeriodicity.Day,
        TimeSlotPeriodicity.MonthWeekSat,
        TimeSlotPeriodicity.MonthWeekSun,
        TimeSlotPeriodicity.MonthWeekMon,
        TimeSlotPeriodicity.WeekSat,
        TimeSlotPeriodicity.WeekSun,
        TimeSlotPeriodicity.WeekMon,
        TimeSlotPeriodicity.Month,
      ]);
    });
  });

  describe('Semester Strategy', () => {
    it('should calculate first date correctly', () => {
      const ts = TimeSlot.fromValue('2023-S1');
      expect(ts.firstDate).toEqual(new Date(Date.UTC(2023, 0, 1)));

      const ts2 = TimeSlot.fromValue('2023-S2');
      expect(ts2.firstDate).toEqual(new Date(Date.UTC(2023, 6, 1)));
    });

    it('should calculate last date correctly', () => {
      const ts = TimeSlot.fromValue('2023-S1');
      expect(ts.lastDate).toEqual(new Date(Date.UTC(2023, 5, 30)));

      const ts2 = TimeSlot.fromValue('2023-S2');
      expect(ts2.lastDate).toEqual(new Date(Date.UTC(2023, 11, 31)));
    });

    it('should navigate to previous semester', () => {
      let ts = TimeSlot.fromValue('2023-S2');
      ts = ts.previous();
      expect(ts.value).toBe('2023-S1');

      ts = TimeSlot.fromValue('2023-S1');
      ts = ts.previous();
      expect(ts.value).toBe('2022-S2');
    });

    it('should navigate to next semester', () => {
      let ts = TimeSlot.fromValue('2023-S1');
      ts = ts.next();
      expect(ts.value).toBe('2023-S2');

      ts = TimeSlot.fromValue('2023-S2');
      ts = ts.next();
      expect(ts.value).toBe('2024-S1');
    });

    it('should create from date correctly', () => {
      const date1 = new Date(Date.UTC(2023, 2, 15)); // March (S1)
      const ts1 = TimeSlot.fromDate(date1, TimeSlotPeriodicity.Semester);
      expect(ts1.value).toBe('2023-S1');

      const date2 = new Date(Date.UTC(2023, 8, 15)); // September (S2)
      const ts2 = TimeSlot.fromDate(date2, TimeSlotPeriodicity.Semester);
      expect(ts2.value).toBe('2023-S2');
    });

    it('should have correct parent periodicities', () => {
      const ts = TimeSlot.fromValue('2023-S1');
      expect(ts.parentPeriodicities).toEqual([TimeSlotPeriodicity.Year, TimeSlotPeriodicity.All]);
    });

    it('should have correct child periodicities', () => {
      const ts = TimeSlot.fromValue('2023-S1');
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
      ]);
    });
  });

  describe('Year Strategy', () => {
    it('should calculate first date correctly', () => {
      const ts = TimeSlot.fromValue('2023');
      expect(ts.firstDate).toEqual(new Date(Date.UTC(2023, 0, 1)));
    });

    it('should calculate last date correctly', () => {
      const ts = TimeSlot.fromValue('2023');
      expect(ts.lastDate).toEqual(new Date(Date.UTC(2023, 11, 31, 0, 0, 0, 0)));
    });

    it('should navigate to previous year', () => {
      let ts = TimeSlot.fromValue('2023');
      ts = ts.previous();
      expect(ts.value).toBe('2022');
    });

    it('should navigate to next year', () => {
      let ts = TimeSlot.fromValue('2023');
      ts = ts.next();
      expect(ts.value).toBe('2024');
    });

    it('should create from date correctly', () => {
      const date = new Date(Date.UTC(2023, 5, 15));
      const ts = TimeSlot.fromDate(date, TimeSlotPeriodicity.Year);
      expect(ts.value).toBe('2023');
    });

    it('should have correct parent periodicities', () => {
      const ts = TimeSlot.fromValue('2023');
      expect(ts.parentPeriodicities).toEqual([TimeSlotPeriodicity.All]);
    });

    it('should have correct child periodicities', () => {
      const ts = TimeSlot.fromValue('2023');
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
      ]);
    });
  });

  describe('All Strategy', () => {
    it('should calculate first date correctly', () => {
      const ts = TimeSlot.fromValue('all');
      expect(ts.firstDate).toEqual(new Date(0)); // Unix epoch
    });

    it('should calculate last date correctly', () => {
      const ts = TimeSlot.fromValue('all');
      expect(ts.lastDate).toEqual(new Date(8640000000000000)); // Max date
    });

    it('should always return same value for previous', () => {
      const ts = TimeSlot.fromValue('all');
      expect(ts.previous().value).toBe('all');
    });

    it('should always return same value for next', () => {
      const ts = TimeSlot.fromValue('all');
      expect(ts.next().value).toBe('all');
    });

    it('should always return all from date', () => {
      const date = new Date();
      const ts = TimeSlot.fromDate(date, TimeSlotPeriodicity.All);
      expect(ts.value).toBe('all');
    });

    it('should have no parent periodicities', () => {
      const ts = TimeSlot.fromValue('all');
      expect(ts.parentPeriodicities).toEqual([]);
    });

    it('should have all child periodicities', () => {
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

    it('should throw error when trying to enumerate children', () => {
      const ts = TimeSlot.fromValue('all');
      expect(() => {
        ts.toChildPeriodicity(TimeSlotPeriodicity.Year);
      }).toThrow('Cannot enumerate children of the all periodicity');
    });
  });
});

import { TimeSlot } from '../src/timeslot';
import { TimeSlotPeriodicity } from '../src/periodicity';

describe('TimeSlot Hierarchy', () => {
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

  describe('.toParentPeriodicity', () => {
    it('should work going from day to year', () => {
      const ts = TimeSlot.fromValue('2027-01-01');
      const parent = ts.toParentPeriodicity(TimeSlotPeriodicity.Year);
      expect(parent.value).toBe('2027');
    });

    it('should work going from day to week', () => {
      const ts = TimeSlot.fromValue('2027-01-01');
      const parent = ts.toParentPeriodicity(TimeSlotPeriodicity.WeekMon);
      expect(parent.value).toBe('2026-W53-mon');
    });

    it('should work going from day to week', () => {
      const ts = TimeSlot.fromValue('2025-12-29');
      const parent = ts.toParentPeriodicity(TimeSlotPeriodicity.WeekMon);
      expect(parent.value).toBe('2026-W01-mon');
    });

    it('should work going from week to year', () => {
      const ts = TimeSlot.fromValue('2026-W01-mon');
      const parent = ts.toParentPeriodicity(TimeSlotPeriodicity.Year);
      expect(parent.value).toBe('2026');
    });

    it('should work going from day to month', () => {
      const ts = TimeSlot.fromValue('2027-01-01');
      const parent = ts.toParentPeriodicity(TimeSlotPeriodicity.Month);
      expect(parent.value).toBe('2027-01');
    });
  });

  describe('.toChildPeriodicity', () => {
    it('should throw error when trying to enumerate children of all periodicity', () => {
      const ts = TimeSlot.fromValue('all');
      expect(() => {
        ts.toChildPeriodicity(TimeSlotPeriodicity.Year);
      }).toThrow('Cannot enumerate children of the all periodicity');
    });

    it('should work with month format', () => {
      const ts = TimeSlot.fromValue('2017-05');
      const children = ts.toChildPeriodicity(TimeSlotPeriodicity.Day);
      expect(children.length).toBeGreaterThan(0);
      expect(children[0].periodicity).toBe(TimeSlotPeriodicity.Day);
    });

  });
}); 
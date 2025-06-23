import { TimeSlot } from '../src/timeslot';
import { TimeSlotPeriodicity } from '../src/periodicity';

describe('TimeSlot Periodicity', () => {
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
}); 
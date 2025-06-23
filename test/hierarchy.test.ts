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
}); 
import { TimeSlot } from '../src/timeslot';
import { TimeSlotPeriodicity } from '../src/periodicity';

describe('TimeSlot edge cases', () => {
  it('should throw on invalid value', () => {
    expect(() => TimeSlot.fromValue('not-a-timeslot', true)).toThrow('No strategy found for periodicity: month_week_lot');
  });

  it('should throw on unknown locale', () => {
    const ts = TimeSlot.fromValue('2023-05-01');
    expect(() => ts.humanizePeriodicity('xx')).toThrow('Unknown locale: xx');
    expect(() => ts.humanizeValue('xx')).toThrow('Unknown locale: xx');
  });

  it('should cache instances in fromValue', () => {
    const ts1 = TimeSlot.fromValue('2023-05-01');
    const ts2 = TimeSlot.fromValue('2023-05-01');
    expect(ts1).toBe(ts2);
  });

  it('should create fromDate for all periodicities', () => {
    const date = new Date(Date.UTC(2023, 4, 15));
    for (const p of Object.values(TimeSlotPeriodicity)) {
      if (p === TimeSlotPeriodicity.All) continue; // already tested
      expect(() => TimeSlot.fromDate(date, p)).not.toThrow();
    }
  });
}); 
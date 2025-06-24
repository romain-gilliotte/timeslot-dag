import { TimeSlot } from '../src/timeslot';
import { TimeSlotPeriodicity } from '../src/periodicity';

describe('BaseTimeSlotStrategy error handling', () => {
  it('should throw when converting to an invalid parent periodicity', () => {
    const ts = TimeSlot.fromValue('2023-05-01'); // Day

    // @ts-expect-error: Invalid argument
    expect(() => ts.toParentPeriodicity('not-a-periodicity')).toThrow('Cannot convert to not-a-periodicity');
  });

  it('should throw when converting to an invalid child periodicity', () => {
    const ts = TimeSlot.fromValue('2023-05'); // Month

    // @ts-expect-error: Invalid argument
    expect(() => ts.toChildPeriodicity('not-a-periodicity')).toThrow('Cannot convert to not-a-periodicity');
  });

  it('should throw when converting to a valid but not allowed parent periodicity', () => {
    const ts = TimeSlot.fromValue('2023-05'); // Month
    // Day is not a parent of Month
    expect(() => ts.toParentPeriodicity(TimeSlotPeriodicity.Day)).toThrow('Cannot convert to day');
  });

  it('should throw when converting to a valid but not allowed child periodicity', () => {
    const ts = TimeSlot.fromValue('2023-05-01'); // Day
    // Month is not a child of Day
    expect(() => ts.toChildPeriodicity(TimeSlotPeriodicity.Month)).toThrow('Cannot convert to month');
  });
}); 
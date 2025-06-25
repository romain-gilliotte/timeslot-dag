import { TimeSlotPeriodicity } from '../src/periodicity';
import { TimeSlotStrategyFactory } from '../src/timeslot/strategy';

describe('TimeSlotStrategyFactory.determinePeriodicity', () => {
  it('should detect All', () => {
    expect(TimeSlotStrategyFactory.determinePeriodicity('all')).toBe(TimeSlotPeriodicity.All);
  });

  it('should detect Year', () => {
    expect(TimeSlotStrategyFactory.determinePeriodicity('2023')).toBe(TimeSlotPeriodicity.Year);
  });

  it('should detect Quarter', () => {
    expect(TimeSlotStrategyFactory.determinePeriodicity('2023-Q1')).toBe(
      TimeSlotPeriodicity.Quarter
    );
  });

  it('should detect Semester', () => {
    expect(TimeSlotStrategyFactory.determinePeriodicity('2023-S2')).toBe(
      TimeSlotPeriodicity.Semester
    );
  });

  it('should detect Month', () => {
    expect(TimeSlotStrategyFactory.determinePeriodicity('2023-05')).toBe(TimeSlotPeriodicity.Month);
  });

  it('should detect Day', () => {
    expect(TimeSlotStrategyFactory.determinePeriodicity('2023-05-15')).toBe(
      TimeSlotPeriodicity.Day
    );
  });

  it('should detect WeekMon/WeekSun/WeekSat', () => {
    expect(TimeSlotStrategyFactory.determinePeriodicity('2023-W01-mon')).toBe(
      TimeSlotPeriodicity.WeekMon
    );
    expect(TimeSlotStrategyFactory.determinePeriodicity('2023-W01-sun')).toBe(
      TimeSlotPeriodicity.WeekSun
    );
    expect(TimeSlotStrategyFactory.determinePeriodicity('2023-W01-sat')).toBe(
      TimeSlotPeriodicity.WeekSat
    );
  });

  it('should detect MonthWeek variants', () => {
    expect(TimeSlotStrategyFactory.determinePeriodicity('2023-05-W1-mon')).toBe(
      TimeSlotPeriodicity.MonthWeekMon
    );
    expect(TimeSlotStrategyFactory.determinePeriodicity('2023-05-W1-sun')).toBe(
      TimeSlotPeriodicity.MonthWeekSun
    );
    expect(TimeSlotStrategyFactory.determinePeriodicity('2023-05-W1-sat')).toBe(
      TimeSlotPeriodicity.MonthWeekSat
    );
  });

  it('should throw when length is not valid', () => {
    expect(() => TimeSlotStrategyFactory.determinePeriodicity('invalidinvalidinvalid')).toThrow(
      'Invalid time slot value'
    );
  });
});

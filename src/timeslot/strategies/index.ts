import { TimeSlotPeriodicity } from '../../periodicity';
import { TimeSlotStrategyFactory } from '../strategy';

// Import all strategies
import { DayStrategy } from './day';
import { MonthStrategy } from './month';
import { QuarterStrategy } from './quarter';
import { SemesterStrategy } from './semester';
import { YearStrategy } from './year';
import { AllStrategy } from './all';
import { WeekSunStrategy } from './week-sun';
import { WeekMonStrategy } from './week-mon';
import { WeekSatStrategy } from './week-sat';
import { MonthWeekSunStrategy } from './month-week-sun';
import { MonthWeekMonStrategy } from './month-week-mon';
import { MonthWeekSatStrategy } from './month-week-sat';

// Register all strategies
export function registerStrategies(): void {
  TimeSlotStrategyFactory.register(TimeSlotPeriodicity.Day, new DayStrategy());
  TimeSlotStrategyFactory.register(TimeSlotPeriodicity.Month, new MonthStrategy());
  TimeSlotStrategyFactory.register(TimeSlotPeriodicity.Quarter, new QuarterStrategy());
  TimeSlotStrategyFactory.register(TimeSlotPeriodicity.Semester, new SemesterStrategy());
  TimeSlotStrategyFactory.register(TimeSlotPeriodicity.Year, new YearStrategy());
  TimeSlotStrategyFactory.register(TimeSlotPeriodicity.All, new AllStrategy());
  TimeSlotStrategyFactory.register(TimeSlotPeriodicity.WeekSun, new WeekSunStrategy());
  TimeSlotStrategyFactory.register(TimeSlotPeriodicity.WeekMon, new WeekMonStrategy());
  TimeSlotStrategyFactory.register(TimeSlotPeriodicity.WeekSat, new WeekSatStrategy());
  TimeSlotStrategyFactory.register(TimeSlotPeriodicity.MonthWeekSun, new MonthWeekSunStrategy());
  TimeSlotStrategyFactory.register(TimeSlotPeriodicity.MonthWeekMon, new MonthWeekMonStrategy());
  TimeSlotStrategyFactory.register(TimeSlotPeriodicity.MonthWeekSat, new MonthWeekSatStrategy());
}

// Export the factory for use in the main TimeSlot class
export { TimeSlotStrategyFactory, TimeSlotStrategy } from '../strategy'; 
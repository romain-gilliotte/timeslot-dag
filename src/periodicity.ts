export enum TimeSlotPeriodicity {
  Day = 'day',
  MonthWeekSat = 'month_week_sat',
  MonthWeekSun = 'month_week_sun',
  MonthWeekMon = 'month_week_mon',
  WeekSat = 'week_sat',
  WeekSun = 'week_sun',
  WeekMon = 'week_mon',
  Month = 'month',
  Quarter = 'quarter',
  Semester = 'semester',
  Year = 'year',
  All = 'all',
}

const PERIODICITIES_PARENT_CHILD: Record<TimeSlotPeriodicity, TimeSlotPeriodicity[]> = {
  [TimeSlotPeriodicity.Day]: [
    TimeSlotPeriodicity.MonthWeekMon,
    TimeSlotPeriodicity.MonthWeekSat,
    TimeSlotPeriodicity.MonthWeekSun,
  ],
  [TimeSlotPeriodicity.MonthWeekSat]: [TimeSlotPeriodicity.WeekSat],
  [TimeSlotPeriodicity.MonthWeekSun]: [TimeSlotPeriodicity.WeekSun],
  [TimeSlotPeriodicity.MonthWeekMon]: [TimeSlotPeriodicity.WeekMon],
  [TimeSlotPeriodicity.WeekSat]: [TimeSlotPeriodicity.Month],
  [TimeSlotPeriodicity.WeekSun]: [TimeSlotPeriodicity.Month],
  [TimeSlotPeriodicity.WeekMon]: [TimeSlotPeriodicity.Month],
  [TimeSlotPeriodicity.Month]: [TimeSlotPeriodicity.Quarter],
  [TimeSlotPeriodicity.Quarter]: [TimeSlotPeriodicity.Semester],
  [TimeSlotPeriodicity.Semester]: [TimeSlotPeriodicity.Year],
  [TimeSlotPeriodicity.Year]: [TimeSlotPeriodicity.All],
  [TimeSlotPeriodicity.All]: [],
};

export function isChildOf(child: TimeSlotPeriodicity, parent: TimeSlotPeriodicity): boolean {
  const directParents = PERIODICITIES_PARENT_CHILD[child];
  if (directParents.includes(parent)) return true;

  // Recursively check if any direct parent is a child of the target parent
  return directParents.some(directParent => isChildOf(directParent, parent));
}

export function getParentPeriodicities(child: TimeSlotPeriodicity): TimeSlotPeriodicity[] {
  return Object.values(TimeSlotPeriodicity).filter(parent => isChildOf(child, parent));
}

export function getChildPeriodicities(parent: TimeSlotPeriodicity): TimeSlotPeriodicity[] {
  return Object.values(TimeSlotPeriodicity).filter(child => isChildOf(child, parent));
}

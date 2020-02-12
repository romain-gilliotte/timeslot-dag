
enum TimeSlotPeriodicity {
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
}

declare class TimeSlot {

    static fromDate(utcDate: string | Date, periodicity: TimeSlotPeriodicity): TimeSlot;

    constructor(value: string);

    get value(): string;
    get periodicity(): TimeSlotPeriodicity;
    get firstDate(): Date;
    get lastDate(): Date;

    toUpperSlot(newPeriodicity: TimeSlotPeriodicity): TimeSlot;
    previous(): TimeSlot;
    next(): TimeSlot;
}

export = TimeSlot;
export as namespace TimeSlot;
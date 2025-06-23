import { TimeSlotPeriodicity } from './periodicity';
import en from './locale/en';
import fr from './locale/fr';
import es from './locale/es';

const LOCALES: Record<string, typeof en> = { en, fr, es };

const instances = new Map<string, TimeSlot>();

/**
 * A class representing a time slot used in monitoring.
 * This can be a given day, epidemiological week, month, quarter, ...
 */
export class TimeSlot {
  private _value: string;
  private _firstDate: Date | null;
  private _lastDate: Date | null;
  private _previous: TimeSlot | null;
  private _next: TimeSlot | null;
  private _parents: Record<string, TimeSlot>;
  private _children: Record<string, TimeSlot[]>;
  private _periodicity!: TimeSlotPeriodicity;

  /**
   * Creates a TimeSlot instance from a value, using a cache for performance
   */
  static fromValue(value: string, check: boolean = false): TimeSlot {
    let ts = instances.get(value);

    if (!ts) {
      ts = new TimeSlot(value, check);
      instances.set(value, ts);
    }

    return ts;
  }

  /**
   * Creates a TimeSlot instance from a date and periodicity
   * @param  {Date | string} utcDate Date which we want to build the TimeSlot around
   * @param  {TimeSlotPeriodicity} periodicity The periodicity to use
   * @return {TimeSlot} The TimeSlot instance of the given periodicity containing utcDate
   *
   * @example
   * let ts = TimeSlot.fromDate(new Date(2010, 1, 7, 18, 34), TimeSlotPeriodicity.Month);
   * ts.value // '2010-01'
   *
   * let ts2 = TimeSlot.fromDate(new Date(2010, 12, 12, 6, 21), TimeSlotPeriodicity.Quarter);
   * ts2.value // '2010-Q4'
   */
  static fromDate(utcDate: Date | string, periodicity: TimeSlotPeriodicity): TimeSlot {
    if (typeof utcDate === 'string') utcDate = new Date(utcDate);

    if (periodicity === TimeSlotPeriodicity.Day) {
      return TimeSlot.fromValue(utcDate.toISOString().substring(0, 10));
    } else if (
      periodicity === TimeSlotPeriodicity.MonthWeekSat ||
      periodicity === TimeSlotPeriodicity.MonthWeekSun ||
      periodicity === TimeSlotPeriodicity.MonthWeekMon
    ) {
      const prefix = utcDate.toISOString().substring(0, 8);

      // if no sunday happened in the month OR month start with sunday, week number is one.
      const firstDayOfMonth = new Date(
        Date.UTC(utcDate.getUTCFullYear(), utcDate.getUTCMonth(), 1)
      ).getUTCDay();

      let firstWeekLength: number;
      if (periodicity === TimeSlotPeriodicity.MonthWeekSat) {
        firstWeekLength = 7 - ((firstDayOfMonth + 1) % 7);
      } else if (periodicity === TimeSlotPeriodicity.MonthWeekSun) {
        firstWeekLength = 7 - firstDayOfMonth;
      } else {
        // 1 if month start on saturday, 2 if friday, 7 if sunday
        firstWeekLength = 7 - ((firstDayOfMonth - 1 + 7) % 7);
      }

      if (utcDate.getUTCDate() <= firstWeekLength) {
        return TimeSlot.fromValue(`${prefix}W1-${periodicity.split('_')[2]}`);
      } else {
        const weekNumber = Math.floor((utcDate.getUTCDate() - 1 - firstWeekLength) / 7) + 2;
        return TimeSlot.fromValue(`${prefix}W${weekNumber}-${periodicity.split('_')[2]}`);
      }
    } else if (
      periodicity === TimeSlotPeriodicity.WeekSat ||
      periodicity === TimeSlotPeriodicity.WeekSun ||
      periodicity === TimeSlotPeriodicity.WeekMon
    ) {
      // Good epoch to count week is the first inferior to searched date (among next, current and last year, in that order).
      let year = utcDate.getUTCFullYear() + 1;
      let epoch = TimeSlot._getEpidemiologicWeekEpoch(year, periodicity);

      while (utcDate.getTime() < epoch.getTime()) {
        epoch = TimeSlot._getEpidemiologicWeekEpoch(--year, periodicity);
      }

      const weekNumber = Math.floor((utcDate.getTime() - epoch.getTime()) / (1000 * 60 * 60 * 24 * 7)) + 1;
      const paddedWeekNumber = weekNumber < 10 ? `0${weekNumber}` : weekNumber.toString();

      return TimeSlot.fromValue(`${year}-W${paddedWeekNumber}-${periodicity.split('_')[1]}`);
    } else if (periodicity === TimeSlotPeriodicity.Month) {
      return TimeSlot.fromValue(utcDate.toISOString().substring(0, 7));
    } else if (periodicity === TimeSlotPeriodicity.Quarter) {
      return TimeSlot.fromValue(
        `${utcDate.getUTCFullYear()}-Q${1 + Math.floor(utcDate.getUTCMonth() / 3)}`
      );
    } else if (periodicity === TimeSlotPeriodicity.Semester) {
      return TimeSlot.fromValue(
        `${utcDate.getUTCFullYear()}-S${1 + Math.floor(utcDate.getUTCMonth() / 6)}`
      );
    } else if (periodicity === TimeSlotPeriodicity.Year) {
      return TimeSlot.fromValue(utcDate.getUTCFullYear().toString());
    } else if (periodicity === TimeSlotPeriodicity.All) {
      return TimeSlot.fromValue('all');
    } else {
      throw new Error('Invalid periodicity');
    }
  }

  /**
   * Calculates the epoch (start date) for epidemiologic weeks.
   * The first week is the one with the majority of its days in the year.
   * (ISO-like rule, works for any week start day)
   */
  private static _getEpidemiologicWeekEpoch(year: number, periodicity: TimeSlotPeriodicity): Date {
    // Map periodicity to the week start day (0=Sunday, 1=Monday, ..., 6=Saturday)
    const weekStart: Partial<Record<TimeSlotPeriodicity, number>> = {
      [TimeSlotPeriodicity.WeekSun]: 0,
      [TimeSlotPeriodicity.WeekMon]: 1,
      [TimeSlotPeriodicity.WeekSat]: 6,
    };
    const startDay = weekStart[periodicity];
    if (startDay === undefined) throw new Error(`Invalid periodicity: ${periodicity}`);

    // January 4th is always in the first epidemiologic week of the year
    const jan4 = new Date(Date.UTC(year, 0, 4));
    const jan4Day = jan4.getUTCDay();
    // Calculate the difference to the previous (or same) week start
    const diff = (jan4Day - startDay + 7) % 7;
    const epoch = new Date(Date.UTC(year, 0, 4 - diff));
    return epoch;
  }

  /**
   * Constructs a TimeSlot instance from a time slot value.
   * The periodicity will be automatically computed.
   *
   * @param  {string} value A valid TimeSlot value (those can be found calling the `value` getter).
   * @param  {boolean} check Whether to validate the value format
   */
  constructor(value: string, check: boolean = false) {
    this._value = value;
    this._firstDate = null;
    this._lastDate = null;
    this._previous = null;
    this._next = null;
    this._parents = {};
    this._children = {};

    // Poor man's parser.
    // The previous versions based on regexps was on the top of the profiler on monitool.
    const len = value.length;
    if (len === 3) {
      this._periodicity = TimeSlotPeriodicity.All;
    } else if (len === 4) {
      this._periodicity = TimeSlotPeriodicity.Year;
    } else if (len === 7) {
      const charAt6 = value[5];
      if (charAt6 === 'Q') {
        this._periodicity = TimeSlotPeriodicity.Quarter;
      } else if (charAt6 === 'S') {
        this._periodicity = TimeSlotPeriodicity.Semester;
      } else {
        this._periodicity = TimeSlotPeriodicity.Month;
      }
    } else if (len === 10) {
      this._periodicity = TimeSlotPeriodicity.Day;
    } else if (len === 12) {
      this._periodicity = `week_${value.substr(9)}` as TimeSlotPeriodicity;
    } else if (len === 14) {
      this._periodicity = `month_week_${value.substr(11)}` as TimeSlotPeriodicity;
    }

    if (check) {
      try {
        const newValue = TimeSlot.fromDate(this.firstDate, this._periodicity);
        if (newValue.value !== value) {
          throw new Error();
        }
      } catch (e) {
        throw new Error('Invalid time slot value');
      }
    }
  }

  get value(): string {
    return this._value;
  }

  get periodicity(): TimeSlotPeriodicity {
    return this._periodicity;
  }

  get firstDate(): Date {
    if (this._firstDate === null) {
      const periodicity = this.periodicity;
      const value = this._value;

      if (periodicity === TimeSlotPeriodicity.Day) {
        this._firstDate = new Date(value);
      } else if (periodicity === TimeSlotPeriodicity.Month) {
        this._firstDate = new Date(Date.UTC(
          parseInt(value.substring(0, 4)),
          parseInt(value.substring(5, 7)) - 1,
          1
        ));
      } else if (periodicity === TimeSlotPeriodicity.Quarter) {
        const year = parseInt(value.substring(0, 4));
        const quarter = parseInt(value.substring(6));
        this._firstDate = new Date(Date.UTC(year, (quarter - 1) * 3, 1));
      } else if (periodicity === TimeSlotPeriodicity.Semester) {
        const year = parseInt(value.substring(0, 4));
        const semester = parseInt(value.substring(6));
        this._firstDate = new Date(Date.UTC(year, (semester - 1) * 6, 1));
      } else if (periodicity === TimeSlotPeriodicity.Year) {
        this._firstDate = new Date(Date.UTC(parseInt(value), 0, 1));
      } else if (periodicity === TimeSlotPeriodicity.All) {
        this._firstDate = new Date(0); // Unix epoch
      } else if (
        periodicity === TimeSlotPeriodicity.MonthWeekSat ||
        periodicity === TimeSlotPeriodicity.MonthWeekSun ||
        periodicity === TimeSlotPeriodicity.MonthWeekMon
      ) {
        const year = parseInt(value.substring(0, 4));
        const month = parseInt(value.substring(5, 7)) - 1;
        const weekNumber = parseInt(value.substring(9, value.indexOf('-', 9)));
        const weekDay = value.substring(value.lastIndexOf('-') + 1);

        let firstDayOfMonth = new Date(Date.UTC(year, month, 1));
        let firstDayOfMonthDay = firstDayOfMonth.getUTCDay();

        let firstWeekLength: number;
        if (weekDay === 'sat') {
          firstWeekLength = 7 - ((firstDayOfMonthDay + 1) % 7);
        } else if (weekDay === 'sun') {
          firstWeekLength = 7 - firstDayOfMonthDay;
        } else {
          firstWeekLength = 7 - ((firstDayOfMonthDay - 1 + 7) % 7);
        }

        if (weekNumber === 1) {
          this._firstDate = firstDayOfMonth;
        } else {
          this._firstDate = new Date(Date.UTC(
            year,
            month,
            1 + firstWeekLength + (weekNumber - 2) * 7
          ));
        }
      } else if (
        periodicity === TimeSlotPeriodicity.WeekSat ||
        periodicity === TimeSlotPeriodicity.WeekSun ||
        periodicity === TimeSlotPeriodicity.WeekMon
      ) {
        const year = parseInt(value.substring(0, 4));
        const weekNumber = parseInt(value.substring(6, 8));
        const weekDay = value.substring(value.lastIndexOf('-') + 1);

        let epoch = TimeSlot._getEpidemiologicWeekEpoch(year, periodicity);
        this._firstDate = new Date(epoch.getTime() + (weekNumber - 1) * 7 * 24 * 60 * 60 * 1000);
      }

      if (this._firstDate === null) {
        throw new Error('Failed to calculate first date');
      }
    }
    return this._firstDate;
  }

  get lastDate(): Date {
    if (this._lastDate === null) {
      const periodicity = this.periodicity;
      const firstDate = this.firstDate;

      if (periodicity === TimeSlotPeriodicity.Day) {
        this._lastDate = firstDate;
      } else if (periodicity === TimeSlotPeriodicity.Month) {
        const monthDate = new Date(firstDate.valueOf());
        monthDate.setUTCMonth(monthDate.getUTCMonth() + 1); // add one month.
        monthDate.setUTCDate(0); // go to last day of previous month.
        this._lastDate = monthDate;
      } else if (periodicity === TimeSlotPeriodicity.Quarter) {
        const quarterDate = new Date(firstDate.valueOf());
        quarterDate.setUTCMonth(quarterDate.getUTCMonth() + 3); // add three month.
        quarterDate.setUTCDate(0); // go to last day of previous month.
        this._lastDate = quarterDate;
      } else if (periodicity === TimeSlotPeriodicity.Semester) {
        const semesterDate = new Date(firstDate.valueOf());
        semesterDate.setUTCMonth(semesterDate.getUTCMonth() + 6); // add six month.
        semesterDate.setUTCDate(0); // go to last day of previous month.
        this._lastDate = semesterDate;
      } else if (periodicity === TimeSlotPeriodicity.Year) {
        this._lastDate = new Date(this._value + '-12-31T00:00:00Z');
      } else if (periodicity === TimeSlotPeriodicity.All) {
        this._lastDate = new Date(8640000000000000); // Max date
      } else if (
        periodicity === TimeSlotPeriodicity.MonthWeekSat ||
        periodicity === TimeSlotPeriodicity.MonthWeekSun ||
        periodicity === TimeSlotPeriodicity.MonthWeekMon
      ) {
        const weekNumber = parseInt(this._value.substr(9, 1));
        const firstDayOfMonth = new Date(this._value.substring(0, 7) + '-01T00:00:00Z').getUTCDay();
        
        let firstWeekLength: number;
        if (periodicity === TimeSlotPeriodicity.MonthWeekSat) {
          firstWeekLength = 7 - ((firstDayOfMonth + 1) % 7);
        } else if (periodicity === TimeSlotPeriodicity.MonthWeekSun) {
          firstWeekLength = 7 - firstDayOfMonth;
        } else {
          // 1 if month start on saturday, 2 if friday, 7 if sunday
          firstWeekLength = 7 - ((firstDayOfMonth - 1 + 7) % 7);
        }

        if (weekNumber === 1) {
          this._lastDate = new Date(
            Date.UTC(parseInt(this._value.substring(0, 4)), parseInt(this._value.substring(5, 7)) - 1, firstWeekLength)
          );
        } else {
          const res = new Date(
            Date.UTC(
              parseInt(this._value.substring(0, 4)),
              parseInt(this._value.substring(5, 7)) - 1,
              1 + 6 + firstWeekLength + (weekNumber - 2) * 7
            )
          );

          if (res.getUTCMonth() !== parseInt(this._value.substring(5, 7)) - 1) {
            res.setUTCDate(0); // go to last day of previous month.
          }

          this._lastDate = res;
        }
      } else if (
        periodicity === TimeSlotPeriodicity.WeekSat ||
        periodicity === TimeSlotPeriodicity.WeekSun ||
        periodicity === TimeSlotPeriodicity.WeekMon
      ) {
        // last day is last day of the week according to epoch
        this._lastDate = new Date(firstDate.getTime() + 6 * 24 * 60 * 60 * 1000);
      }

      if (this._lastDate === null) {
        throw new Error('Failed to calculate last date');
      }
    }
    return this._lastDate;
  }

  get parentPeriodicities(): TimeSlotPeriodicity[] {
    return TimeSlot.upperSlots[this.periodicity];
  }

  get childPeriodicities(): TimeSlotPeriodicity[] {
    return Object.keys(TimeSlot.upperSlots).filter(
      p => TimeSlot.upperSlots[p as TimeSlotPeriodicity].indexOf(this.periodicity) !== -1
    ) as TimeSlotPeriodicity[];
  }

  toParentPeriodicity(newPeriodicity: TimeSlotPeriodicity): TimeSlot {
    if (!this._parents[newPeriodicity]) {
      if (newPeriodicity === this.periodicity) {
        this._parents[newPeriodicity] = this;
      } else {
        // Raise when we make invalid conversions
        if (this.parentPeriodicities.indexOf(newPeriodicity) === -1)
          throw new Error(`Cannot convert ${this.periodicity} to ${newPeriodicity}`);

        // For days, months, quarters, semesters, we can assume that getting the slot from any date works
        let upperSlotDate = this.firstDate;

        // if it's a week, we need to be a bit more cautious.
        // the month/quarter/year is not that of the first or last day, but that of the middle day of the week
        // (which depend on the kind of week, but adding 3 days to the beginning gives the good date).
        if (
          this.periodicity === TimeSlotPeriodicity.WeekSat ||
          this.periodicity === TimeSlotPeriodicity.WeekSun ||
          this.periodicity === TimeSlotPeriodicity.WeekMon
        )
          upperSlotDate = new Date(upperSlotDate.getTime() + 3 * 24 * 60 * 60 * 1000);

        this._parents[newPeriodicity] = TimeSlot.fromDate(upperSlotDate, newPeriodicity);
      }
    }

    return this._parents[newPeriodicity];
  }

  toChildPeriodicity(newPeriodicity: TimeSlotPeriodicity): TimeSlot[] {
    if (!this._children[newPeriodicity]) {
      if (this.periodicity === TimeSlotPeriodicity.All)
        throw new Error('Would yield an infinite amount of children');

      if (this.periodicity === newPeriodicity) {
        this._children[newPeriodicity] = [this];
      } else {
        // Invalid conversions
        if (this.childPeriodicities.indexOf(newPeriodicity) === -1)
          throw new Error(`Cannot convert ${this.periodicity} to ${newPeriodicity}`);

        const end = TimeSlot.fromDate(this.lastDate, newPeriodicity);
        let current = TimeSlot.fromDate(this.firstDate, newPeriodicity);

        const result = [current];
        while (current.value !== end.value) {
          current = current.next();
          result.push(current);
        }

        this._children[newPeriodicity] = result;
      }
    }

    return this._children[newPeriodicity];
  }

  previous(): TimeSlot {
    if (!this._previous) {
      if (this.periodicity === TimeSlotPeriodicity.All) throw new Error('There is no previous slot');

      const date = new Date(this.firstDate.valueOf());
      date.setUTCDate(date.getUTCDate() - 1);
      this._previous = TimeSlot.fromDate(date, this.periodicity);
    }

    return this._previous;
  }

  next(): TimeSlot {
    if (!this._next) {
      if (this.periodicity === TimeSlotPeriodicity.All) throw new Error('There is no next slot');

      const date = new Date(this.lastDate.valueOf());
      date.setUTCDate(date.getUTCDate() + 1);
      this._next = TimeSlot.fromDate(date, this.periodicity);
    }

    return this._next;
  }

  humanizePeriodicity(language: string = 'en'): string {
    const locale = LOCALES[language];
    if (!locale) {
      throw new Error(`Unknown locale: ${language}. Supported locales: ${Object.keys(LOCALES).join(', ')}`);
    }
    return locale.humanizePeriodicity(this.periodicity);
  }

  humanizeValue(language: string = 'en'): string {
    const locale = LOCALES[language];
    if (!locale) {
      throw new Error(`Unknown locale: ${language}. Supported locales: ${Object.keys(LOCALES).join(', ')}`);
    }
    return locale.humanizeValue(this.periodicity, this._value);
  }

  /**
   * Static member documenting which periodicity contains the others.
   *
   * @private
   * @type {Object}
   */
  static upperSlots: Record<TimeSlotPeriodicity, TimeSlotPeriodicity[]> = {
    [TimeSlotPeriodicity.Day]: [
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
    ],
    [TimeSlotPeriodicity.MonthWeekSat]: [TimeSlotPeriodicity.WeekSat, TimeSlotPeriodicity.Month, TimeSlotPeriodicity.Quarter, TimeSlotPeriodicity.Semester, TimeSlotPeriodicity.Year, TimeSlotPeriodicity.All],
    [TimeSlotPeriodicity.MonthWeekSun]: [TimeSlotPeriodicity.WeekSun, TimeSlotPeriodicity.Month, TimeSlotPeriodicity.Quarter, TimeSlotPeriodicity.Semester, TimeSlotPeriodicity.Year, TimeSlotPeriodicity.All],
    [TimeSlotPeriodicity.MonthWeekMon]: [TimeSlotPeriodicity.WeekMon, TimeSlotPeriodicity.Month, TimeSlotPeriodicity.Quarter, TimeSlotPeriodicity.Semester, TimeSlotPeriodicity.Year, TimeSlotPeriodicity.All],
    [TimeSlotPeriodicity.WeekSat]: [TimeSlotPeriodicity.Month, TimeSlotPeriodicity.Quarter, TimeSlotPeriodicity.Semester, TimeSlotPeriodicity.Year, TimeSlotPeriodicity.All],
    [TimeSlotPeriodicity.WeekSun]: [TimeSlotPeriodicity.Month, TimeSlotPeriodicity.Quarter, TimeSlotPeriodicity.Semester, TimeSlotPeriodicity.Year, TimeSlotPeriodicity.All],
    [TimeSlotPeriodicity.WeekMon]: [TimeSlotPeriodicity.Month, TimeSlotPeriodicity.Quarter, TimeSlotPeriodicity.Semester, TimeSlotPeriodicity.Year, TimeSlotPeriodicity.All],
    [TimeSlotPeriodicity.Month]: [TimeSlotPeriodicity.Quarter, TimeSlotPeriodicity.Semester, TimeSlotPeriodicity.Year, TimeSlotPeriodicity.All],
    [TimeSlotPeriodicity.Quarter]: [TimeSlotPeriodicity.Semester, TimeSlotPeriodicity.Year, TimeSlotPeriodicity.All],
    [TimeSlotPeriodicity.Semester]: [TimeSlotPeriodicity.Year, TimeSlotPeriodicity.All],
    [TimeSlotPeriodicity.Year]: [TimeSlotPeriodicity.All],
    [TimeSlotPeriodicity.All]: [],
  };
} 
const HashLru = require('hashlru');

const instances = HashLru(1e3);

/**
 * A class representing a time slot used in monitoring.
 * This can be a given day, epidemiological week, month, quarter, ...
 */
class TimeSlot {
  static fromValue(value) {
    let ts = instances.get(value);

    if (!ts) {
      ts = new TimeSlot(value);
      instances.set(value, ts);
    }

    return ts;
  }

  /**
   * @param  {Date} utcDate Date which we want to build the TimeSlot around
   * @param  {string} periodicity One of day, week_sat, week_sun, week_mon, month, quarter, semester, year
   * @return {TimeSlot} The TimeSlot instance of the given periodicity containing utcDate
   *
   * @example
   * let ts = TimeSlot.fromDate(new Date(2010, 01, 07, 18, 34), "month");
   * ts.value // '2010-01'
   *
   * let ts2 = TimeSlot.fromDate(new Date(2010, 12, 12, 6, 21), "quarter");
   * ts2.value // '2010-Q4'
   */
  static fromDate(utcDate, periodicity) {
    if (typeof utcDate === 'string') utcDate = new Date(utcDate);

    if (periodicity === 'day') return TimeSlot.fromValue(utcDate.toISOString().substring(0, 10));
    else if (
      periodicity === 'month_week_sat' ||
      periodicity === 'month_week_sun' ||
      periodicity === 'month_week_mon'
    ) {
      var prefix = utcDate.toISOString().substring(0, 8);

      // if no sunday happened in the month OR month start with sunday, week number is one.
      var firstDayOfMonth = new Date(
        Date.UTC(utcDate.getUTCFullYear(), utcDate.getUTCMonth(), 1)
      ).getUTCDay();

      var firstWeekLength;
      if (periodicity === 'month_week_sat') firstWeekLength = 7 - ((firstDayOfMonth + 1) % 7);
      else if (periodicity === 'month_week_sun') firstWeekLength = 7 - firstDayOfMonth;
      // 1 if month start on saturday, 2 if friday, 7 if sunday
      else firstWeekLength = 7 - ((firstDayOfMonth - 1 + 7) % 7);

      if (utcDate.getUTCDate() <= firstWeekLength) {
        return TimeSlot.fromValue(prefix + 'W1-' + periodicity.substr(-3));
      } else {
        var weekNumber = Math.floor((utcDate.getUTCDate() - 1 - firstWeekLength) / 7) + 2;
        return TimeSlot.fromValue(prefix + 'W' + weekNumber + '-' + periodicity.substr(-3));
      }
    } else if (
      periodicity === 'week_sat' ||
      periodicity === 'week_sun' ||
      periodicity === 'week_mon'
    ) {
      // Good epoch to count week is the first inferior to searched date (among next, current and last year, in that order).
      var year = utcDate.getUTCFullYear() + 1,
        epoch = TimeSlot._getEpidemiologicWeekEpoch(year, periodicity);

      while (utcDate.getTime() < epoch.getTime())
        epoch = TimeSlot._getEpidemiologicWeekEpoch(--year, periodicity);

      var weekNumber =
        Math.floor((utcDate.getTime() - epoch.getTime()) / 1000 / 60 / 60 / 24 / 7) + 1;
      if (weekNumber < 10) weekNumber = '0' + weekNumber;

      return TimeSlot.fromValue(year + '-W' + weekNumber + '-' + periodicity.substr(-3));
    } else if (periodicity === 'month')
      return TimeSlot.fromValue(utcDate.toISOString().substring(0, 7));
    else if (periodicity === 'quarter')
      return TimeSlot.fromValue(
        utcDate.getUTCFullYear().toString() +
          '-Q' +
          (1 + Math.floor(utcDate.getUTCMonth() / 3)).toString()
      );
    else if (periodicity === 'semester')
      return TimeSlot.fromValue(
        utcDate.getUTCFullYear().toString() +
          '-S' +
          (1 + Math.floor(utcDate.getUTCMonth() / 6)).toString()
      );
    else if (periodicity === 'year') return TimeSlot.fromValue(utcDate.getUTCFullYear().toString());
    else if (periodicity === 'all') return TimeSlot.fromValue('all');
    else throw new Error('Invalid periodicity');
  }

  /**
   * Get the date from which we should count weeks to compute the epidemiological week number.
   *
   * @private
   * @todo
   * This function is incredibly verbose for what it does.
   * Probably a single divmod could give the same result but debugging was nightmarish.
   *
   * @param  {number} year
   * @param  {string} periodicity
   * @return {Date}
   */
  static _getEpidemiologicWeekEpoch(year, periodicity) {
    var SUNDAY = 0,
      MONDAY = 1,
      TUESDAY = 2,
      WEDNESDAY = 3,
      THURSDAY = 4,
      FRIDAY = 5,
      SATURDAY = 6;
    var firstDay = new Date(Date.UTC(year, 0, 1, 0, 0, 0, 0)).getUTCDay();
    var epoch = null;

    if (periodicity === 'week_sun') {
      if (firstDay === SUNDAY)
        // Lucky us, first day of year is Sunday
        epoch = Date.UTC(year, 0, 1, 0, 0, 0, 0);
      else if (firstDay === MONDAY)
        // Epidemiologic week started last day of december
        epoch = Date.UTC(year - 1, 11, 31, 0, 0, 0, 0);
      else if (firstDay === TUESDAY)
        // Epidemiologic week started the previous day (still 2 day in december and 5 in january)
        epoch = Date.UTC(year - 1, 11, 30, 0, 0, 0, 0);
      else if (firstDay === WEDNESDAY)
        // 3 days in december, 4 in january
        epoch = Date.UTC(year - 1, 11, 29, 0, 0, 0, 0);
      else if (firstDay === THURSDAY)
        // we can't have 4 days in december, so the epoch is the 4th of january (the first sunday of the year)
        epoch = Date.UTC(year, 0, 4, 0, 0, 0, 0);
      else if (firstDay === FRIDAY)
        // same as before: first sunday of the year
        epoch = Date.UTC(year, 0, 3, 0, 0, 0, 0);
      else if (firstDay === SATURDAY)
        // same as before: first sunday of the year
        epoch = Date.UTC(year, 0, 2, 0, 0, 0, 0);
    } else if (periodicity === 'week_sat') {
      if (firstDay === SATURDAY)
        // Lucky us, first day of year is Saturday
        epoch = Date.UTC(year, 0, 1, 0, 0, 0, 0);
      else if (firstDay === SUNDAY)
        // Epidemiologic week started last day of december
        epoch = Date.UTC(year - 1, 11, 31, 0, 0, 0, 0);
      else if (firstDay === MONDAY)
        // Epidemiologic week started the previous day (still 2 day in december and 5 in january)
        epoch = Date.UTC(year - 1, 11, 30, 0, 0, 0, 0);
      else if (firstDay === TUESDAY)
        // 3 days in december, 4 in january
        epoch = Date.UTC(year - 1, 11, 29, 0, 0, 0, 0);
      else if (firstDay === WEDNESDAY)
        // we can't have 4 days in december, so the epoch is the 4th of january (the first saturday of the year)
        epoch = Date.UTC(year, 0, 4, 0, 0, 0, 0);
      else if (firstDay === THURSDAY)
        // same as before: first saturday of the year
        epoch = Date.UTC(year, 0, 3, 0, 0, 0, 0);
      else if (firstDay === FRIDAY)
        // same as before: first saturday of the year
        epoch = Date.UTC(year, 0, 2, 0, 0, 0, 0);
    } else if (periodicity === 'week_mon') {
      if (firstDay === MONDAY)
        // Lucky us, first day of year is Sunday
        epoch = Date.UTC(year, 0, 1, 0, 0, 0, 0);
      else if (firstDay === TUESDAY)
        // Epidemiologic week started last day of december
        epoch = Date.UTC(year - 1, 11, 31, 0, 0, 0, 0);
      else if (firstDay === WEDNESDAY)
        // Epidemiologic week started the previous day (still 2 day in december and 5 in january)
        epoch = Date.UTC(year - 1, 11, 30, 0, 0, 0, 0);
      else if (firstDay === THURSDAY)
        // 3 days in december, 4 in january
        epoch = Date.UTC(year - 1, 11, 29, 0, 0, 0, 0);
      else if (firstDay === FRIDAY)
        // we can't have 4 days in december, so the epoch is the 4th of january (the first monday of the year)
        epoch = Date.UTC(year, 0, 4, 0, 0, 0, 0);
      else if (firstDay === SATURDAY)
        // same as before: first monday of the year
        epoch = Date.UTC(year, 0, 3, 0, 0, 0, 0);
      else if (firstDay === SUNDAY)
        // same as before: first monday of the year
        epoch = Date.UTC(year, 0, 2, 0, 0, 0, 0);
    } else throw new Error('Invalid day');

    return new Date(epoch);
  }

  /**
   * Constructs a TimeSlot instance from a time slot value.
   * The periodicity will be automatically computed.
   *
   * @param  {string} value A valid TimeSlot value (those can be found calling the `value` getter).
   */
  constructor(value) {
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
    if (len === 3) this._periodicity = 'all';
    else if (len === 4) this._periodicity = 'year';
    else if (len === 7) {
      const charAt6 = value[5];
      if (charAt6 === 'Q') this._periodicity = 'quarter';
      else if (charAt6 === 'S') this._periodicity = 'semester';
      else this._periodicity = 'month';
    } else if (len == 10) this._periodicity = 'day';
    else if (len == 12) this._periodicity = 'week_' + value.substr(9);
    else if (len == 14) this._periodicity = 'month_week_' + value.substr(11);
  }

  /**
   * The value of the TimeSlot.
   * This is a string that uniquely identifies this timeslot.
   *
   * For instance: `2010`, `2010-Q1`, `2010-W07-sat`.
   * @type {string}
   */
  get value() {
    return this._value;
  }

  /**
   * The periodicity used for this timeslot.
   * By periodicity, we mean, the method that was used to cut time into slots.
   *
   * For instance: `year`, `quarter`, `week-sat`, ...
   * @type {string}
   */
  get periodicity() {
    return this._periodicity;
  }

  /**
   * The date where this instance of TimeSlot begins.
   *
   * @type {Date}
   * @example
   * var t = TimeSlot.fromValue('2012-01');
   * t.firstDate.toUTCString(); // 2012-01-01T00:00:00Z
   */
  get firstDate() {
    if (!this._firstDate) {
      if (this._periodicity === 'day') this._firstDate = new Date(this._value + 'T00:00:00Z');
      else if (
        this._periodicity === 'month_week_sat' ||
        this._periodicity === 'month_week_sun' ||
        this._periodicity === 'month_week_mon'
      ) {
        var weekNumber = 1 * this._value.substr(9, 1);

        var firstDayOfMonth = new Date(this._value.substring(0, 7) + '-01T00:00:00Z').getUTCDay();
        if (weekNumber === 1)
          this._firstDate = new Date(
            Date.UTC(this._value.substring(0, 4), this._value.substring(5, 7) - 1, 1)
          );
        else {
          var firstWeekLength;
          if (this._periodicity === 'month_week_sat')
            firstWeekLength = 7 - ((firstDayOfMonth + 1) % 7);
          else if (this._periodicity === 'month_week_sun') firstWeekLength = 7 - firstDayOfMonth;
          // 1 if month start on saturday, 2 if friday, 7 if sunday
          else firstWeekLength = 7 - ((firstDayOfMonth - 1 + 7) % 7);

          this._firstDate = new Date(
            Date.UTC(
              this._value.substring(0, 4),
              this._value.substring(5, 7) - 1,
              1 + firstWeekLength + (weekNumber - 2) * 7
            )
          );
        }
      } else if (
        this._periodicity === 'week_sat' ||
        this._periodicity === 'week_sun' ||
        this._periodicity === 'week_mon'
      )
        this._firstDate = new Date(
          TimeSlot._getEpidemiologicWeekEpoch(
            this._value.substring(0, 4),
            this._periodicity
          ).getTime() +
            (this._value.substring(6, 8) - 1) * 7 * 24 * 60 * 60 * 1000 // week numbering starts with 1
        );
      else if (this._periodicity === 'month')
        this._firstDate = new Date(this._value + '-01T00:00:00Z');
      else if (this._periodicity === 'quarter') {
        var month = (this._value.substring(6, 7) - 1) * 3 + 1;
        if (month < 10) month = '0' + month;

        this._firstDate = new Date(this._value.substring(0, 5) + month + '-01T00:00:00Z');
      } else if (this._periodicity === 'semester') {
        var month2 = (this._value.substring(6, 7) - 1) * 6 + 1;
        if (month2 < 10) month2 = '0' + month2;

        this._firstDate = new Date(this._value.substring(0, 5) + month2 + '-01T00:00:00Z');
      } else if (this._periodicity === 'year')
        this._firstDate = new Date(this._value + '-01-01T00:00:00Z');
      else if (this._periodicity === 'all') this._firstDate = new Date(-8640000000000000);
    }

    return this._firstDate;
  }

  /**
   * The date where this instance of TimeSlot ends.
   *
   * @type {Date}
   * @example
   * var t = TimeSlot.fromValue('2012-01');
   * t.firstDate.toUTCString(); // 2012-01-31T00:00:00Z
   */
  get lastDate() {
    if (!this._lastDate) {
      if (this._periodicity === 'day')
        // last day is current day
        this._lastDate = this.firstDate;
      else if (
        this._periodicity === 'month_week_sat' ||
        this._periodicity === 'month_week_sun' ||
        this._periodicity === 'month_week_mon'
      ) {
        var weekNumber = this._value.substr(9, 1);

        var firstDayOfMonth = new Date(this._value.substring(0, 7) + '-01T00:00:00Z').getUTCDay();
        var firstWeekLength;
        if (this._periodicity === 'month_week_sat')
          firstWeekLength = 7 - ((firstDayOfMonth + 1) % 7);
        else if (this._periodicity === 'month_week_sun') firstWeekLength = 7 - firstDayOfMonth;
        // 1 if month start on saturday, 2 if friday, 7 if sunday
        else firstWeekLength = 7 - ((firstDayOfMonth - 1 + 7) % 7);

        if (weekNumber === 1)
          this._lastDate = new Date(
            Date.UTC(this._value.substring(0, 4), this._value.substring(5, 7) - 1, firstWeekLength)
          );
        else {
          var res = new Date(
            Date.UTC(
              this._value.substring(0, 4),
              this._value.substring(5, 7) - 1,
              1 + 6 + firstWeekLength + (weekNumber - 2) * 7
            )
          );

          if (res.getUTCMonth() !== this._value.substring(5, 7) - 1) res.setUTCDate(0); // go to last day of previous month.

          this._lastDate = res;
        }
      } else if (
        this._periodicity === 'week_sat' ||
        this._periodicity === 'week_sun' ||
        this._periodicity === 'week_mon'
      ) {
        // last day is last day of the week according to epoch
        this._lastDate = new Date(this.firstDate.getTime() + 6 * 24 * 60 * 60 * 1000);
      } else if (this._periodicity === 'month') {
        var monthDate = new Date(this.firstDate.valueOf());
        monthDate.setUTCMonth(monthDate.getUTCMonth() + 1); // add one month.
        monthDate.setUTCDate(0); // go to last day of previous month.
        this._lastDate = monthDate;
      } else if (this._periodicity === 'quarter') {
        var quarterDate = new Date(this.firstDate.valueOf());
        quarterDate.setUTCMonth(quarterDate.getUTCMonth() + 3); // add three month.
        quarterDate.setUTCDate(0); // go to last day of previous month.
        this._lastDate = quarterDate;
      } else if (this._periodicity === 'semester') {
        var semesterDate = new Date(this.firstDate.valueOf());
        semesterDate.setUTCMonth(semesterDate.getUTCMonth() + 6); // add six month.
        semesterDate.setUTCDate(0); // go to last day of previous month.
        this._lastDate = semesterDate;
      } else if (this._periodicity === 'year')
        this._lastDate = new Date(this._value + '-12-31T00:00:00Z');
      else if (this._periodicity === 'all') this._lastDate = new Date(8640000000000000);
    }

    return this._lastDate;
  }

  get parentPeriodicities() {
    return TimeSlot.upperSlots[this._periodicity];
  }

  get childPeriodicities() {
    return Object.keys(TimeSlot.upperSlots).filter(
      p => TimeSlot.upperSlots[p].indexOf(this._periodicity) !== -1
    );
  }

  /**
   * Creates a TimeSlot instance with a longer periodicity that contains this one.
   *
   * @param  {string} newPeriodicity The desired periodicity
   * @return {TimeSlot} A TimeSlot.fromValue instance.
   *
   * @example
   * let t  = TimeSlot.fromValue('2010-07'),
   *     t2 = t.toParentPeriodicity('quarter');
   *
   * t2.value; // 2010-Q3
   */
  toParentPeriodicity(newPeriodicity) {
    if (!this._parents[newPeriodicity]) {
      if (newPeriodicity == this._periodicity) {
        this._parents[newPeriodicity] = this;
      } else {
        // Raise when we make invalid conversions
        if (this.parentPeriodicities.indexOf(newPeriodicity) === -1)
          throw new Error('Cannot convert ' + this._periodicity + ' to ' + newPeriodicity);

        // For days, months, quarters, semesters, we can assume that getting the slot from any date works
        var upperSlotDate = this.firstDate;

        // if it's a week, we need to be a bit more cautious.
        // the month/quarter/year is not that of the first or last day, but that of the middle day of the week
        // (which depend on the kind of week, but adding 3 days to the beginning gives the good date).
        if (
          this._periodicity === 'week_sat' ||
          this._periodicity === 'week_sun' ||
          this._periodicity === 'week_mon'
        )
          upperSlotDate = new Date(upperSlotDate.getTime() + 3 * 24 * 60 * 60 * 1000);

        this._parents[newPeriodicity] = TimeSlot.fromDate(upperSlotDate, newPeriodicity);
      }
    }

    return this._parents[newPeriodicity];
  }

  toChildPeriodicity(newPeriodicity) {
    if (!this._children[newPeriodicity]) {
      if (this._periodicity === 'all')
        throw new Error('Would yield an infinite amount of children');

      if (this._periodicity == newPeriodicity) this._children[newPeriodicity] = [this];
      else {
        // Invalid conversions
        if (this.childPeriodicities.indexOf(newPeriodicity) === -1)
          throw new Error('Cannot convert ' + this._periodicity + ' to ' + newPeriodicity);

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

  previous() {
    if (!this._previous) {
      if (this._periodicity === 'all') throw new Error('There is no previous slot');

      var date = new Date(this.firstDate.valueOf());
      date.setUTCDate(date.getUTCDate() - 1);
      this._previous = TimeSlot.fromDate(date, this._periodicity);
    }

    return this._previous;
  }

  /**
   * Creates a TimeSlot instance of the same periodicity than the current once, but which follows it
   *
   * @return {TimeSlot}
   * @example
   * var ts = TimeSlot.fromValue('2010');
   * ts.next().value // 2011
   *
   * var ts2 = TimeSlot.fromValue('2010-W52-sat');
   * ts.next().value // 2011-W01-sat
   */
  next() {
    if (!this._next) {
      if (this._periodicity === 'all') throw new Error('There is no next slot');

      var date = new Date(this.lastDate.valueOf());
      date.setUTCDate(date.getUTCDate() + 1);
      this._next = TimeSlot.fromDate(date, this._periodicity);
    }

    return this._next;
  }

  /**
   * Humanize the TimeSlot periodicity
   *
   * @param {'en'|'fr'|'es'} language
   * @return string Humanized label
   */
  humanizePeriodicity(language = 'en') {
    // Protect against remote code execution if run server-side.
    if (!/^[a-z]{2}$/.test(language)) throw new Error('Language does not match expected format');

    try {
      const locale = require('./locale/' + language);
      return locale.humanizePeriodicity(this._periodicity);
    } catch (e) {
      throw new Error('Requested locale is not defined.');
    }
  }

  /**
   * Humanize the TimeSlot value
   *
   * @param {'en'|'fr'|'es'} language
   * @return string Humanized label
   */
  humanizeValue(language = 'en') {
    // Protect against remote code execution if run server-side.
    if (!/^[a-z]{2}$/.test(language)) throw new Error('Language does not match expected format');

    try {
      const locale = require('./locale/' + language);
      return locale.humanizeValue(this._periodicity, this._value);
    } catch (e) {
      throw new Error('Requested locale is not defined.');
    }
  }
}

/**
 * Static member documenting which periodicity contains the others.
 *
 * @private
 * @type {Object}
 */
TimeSlot.upperSlots = {
  day: [
    'month_week_sat',
    'month_week_sun',
    'month_week_mon',
    'week_sat',
    'week_sun',
    'week_mon',
    'month',
    'quarter',
    'semester',
    'year',
    'all',
  ],
  month_week_sat: ['week_sat', 'month', 'quarter', 'semester', 'year', 'all'],
  month_week_sun: ['week_sun', 'month', 'quarter', 'semester', 'year', 'all'],
  month_week_mon: ['week_mon', 'month', 'quarter', 'semester', 'year', 'all'],
  week_sat: ['month', 'quarter', 'semester', 'year', 'all'],
  week_sun: ['month', 'quarter', 'semester', 'year', 'all'],
  week_mon: ['month', 'quarter', 'semester', 'year', 'all'],
  month: ['quarter', 'semester', 'year', 'all'],
  quarter: ['semester', 'year', 'all'],
  semester: ['year', 'all'],
  year: ['all'],
  all: [],
};

module.exports = TimeSlot;

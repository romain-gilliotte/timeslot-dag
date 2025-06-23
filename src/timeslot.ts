import { TimeSlotPeriodicity } from './periodicity';
import en from './locale/en';
import fr from './locale/fr';
import es from './locale/es';
import { TimeSlotStrategyFactory, registerStrategies, TimeSlotStrategy } from './timeslot/strategies';

const LOCALES: Record<string, typeof en> = { en, fr, es };

// Register all strategies on module load
registerStrategies();

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
  private _strategy: TimeSlotStrategy;

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

    const strategy = TimeSlotStrategyFactory.get(periodicity);
    const value = strategy.fromDate(utcDate);
    return TimeSlot.fromValue(value);
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

    // Determine periodicity and get strategy
    this._periodicity = TimeSlotStrategyFactory.determinePeriodicity(value);
    this._strategy = TimeSlotStrategyFactory.get(this._periodicity);

    if (check) {
      try {
        const newValue = TimeSlot.fromDate(this.firstDate, this._periodicity);
        if (newValue.value !== value) {
          throw new Error();
        }
      } catch {
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
      this._firstDate = this._strategy.calculateFirstDate(this._value);
    }
    return this._firstDate;
  }

  get lastDate(): Date {
    if (this._lastDate === null) {
      const firstDate = this.firstDate;
      this._lastDate = this._strategy.calculateLastDate(this._value, firstDate);
    }
    return this._lastDate;
  }

  get parentPeriodicities(): TimeSlotPeriodicity[] {
    return this._strategy.parentPeriodicities;
  }

  get childPeriodicities(): TimeSlotPeriodicity[] {
    return this._strategy.childPeriodicities;
  }

  toParentPeriodicity(newPeriodicity: TimeSlotPeriodicity): TimeSlot {
    if (!this._parents[newPeriodicity]) {
      if (newPeriodicity === this.periodicity) {
        this._parents[newPeriodicity] = this;
      } else {
        const parentValue = this._strategy.toParentPeriodicity(this._value, newPeriodicity);
        this._parents[newPeriodicity] = TimeSlot.fromValue(parentValue);
      }
    }

    return this._parents[newPeriodicity];
  }

  toChildPeriodicity(newPeriodicity: TimeSlotPeriodicity): TimeSlot[] {
    if (!this._children[newPeriodicity]) {
      const childValues = this._strategy.toChildPeriodicity(this._value, newPeriodicity);
      this._children[newPeriodicity] = childValues.map(value => TimeSlot.fromValue(value));
    }

    return this._children[newPeriodicity];
  }

  previous(): TimeSlot {
    if (this._previous === null) {
      const previousValue = this._strategy.calculatePrevious(this._value);
      this._previous = TimeSlot.fromValue(previousValue);
    }
    return this._previous;
  }

  next(): TimeSlot {
    if (this._next === null) {
      const nextValue = this._strategy.calculateNext(this._value);
      this._next = TimeSlot.fromValue(nextValue);
    }
    return this._next;
  }

  humanizePeriodicity(language: string = 'en'): string {
    const locale = LOCALES[language];
    if (!locale) {
      throw new Error(`Unknown locale: ${language}`);
    }
    return locale.humanizePeriodicity(this.periodicity);
  }

  humanizeValue(language: string = 'en'): string {
    const locale = LOCALES[language];
    if (!locale) {
      throw new Error(`Unknown locale: ${language}`);
    }
    return locale.humanizeValue(this.periodicity, this.value);
  }
} 
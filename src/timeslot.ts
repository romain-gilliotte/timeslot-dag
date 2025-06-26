import { TimeSlotPeriodicity, getParentPeriodicities, getChildPeriodicities } from './periodicity';
import en from './locale/en';
import fr from './locale/fr';
import es from './locale/es';
import {
  TimeSlotStrategyFactory,
  registerStrategies,
  TimeSlotStrategy,
} from './timeslot/strategies';
import { memoize } from './memoize';

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
  private _periodicity!: TimeSlotPeriodicity;
  private _strategy: TimeSlotStrategy;

  /**
   * Constructs a TimeSlot instance from a time slot value.
   * The periodicity will be automatically computed.
   *
   * @param  {string} value A valid TimeSlot value (those can be found calling the `value` getter).
   * @param  {boolean} check Whether to validate the value format
   */
  constructor(value: string, check: boolean = false) {
    this._value = value;

    // Determine periodicity and get strategy
    this._periodicity = TimeSlotStrategyFactory.determinePeriodicity(value);
    this._strategy = TimeSlotStrategyFactory.get(this._periodicity);

    if (check) {
      this._validateValue(value);
    }
  }

  @memoize
  get firstDate(): Date {
    return this._strategy.calculateFirstDate(this._value);
  }

  @memoize
  get lastDate(): Date {
    return this._strategy.calculateLastDate(this._value, this.firstDate);
  }

  get value(): string {
    return this._value;
  }

  get periodicity(): TimeSlotPeriodicity {
    return this._strategy.periodicity;
  }

  get parentPeriodicities(): TimeSlotPeriodicity[] {
    return getParentPeriodicities(this._strategy.periodicity);
  }

  get childPeriodicities(): TimeSlotPeriodicity[] {
    return getChildPeriodicities(this._strategy.periodicity);
  }

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

  @memoize
  toParentPeriodicity(newPeriodicity: TimeSlotPeriodicity): TimeSlot {
    if (newPeriodicity === this.periodicity) return this;

    const parentValue = this._strategy.toParentPeriodicity(this._value, newPeriodicity);
    return TimeSlot.fromValue(parentValue);
  }

  @memoize
  toChildPeriodicity(newPeriodicity: TimeSlotPeriodicity): TimeSlot[] {
    if (newPeriodicity === this.periodicity) return [this];

    const childValues = this._strategy.toChildPeriodicity(this._value, newPeriodicity);
    return childValues.map(value => TimeSlot.fromValue(value));
  }

  @memoize
  previous(): TimeSlot {
    const previousValue = this._strategy.calculatePrevious(this._value);
    return TimeSlot.fromValue(previousValue);
  }

  @memoize
  next(): TimeSlot {
    const nextValue = this._strategy.calculateNext(this._value);
    return TimeSlot.fromValue(nextValue);
  }

  humanizePeriodicity(language: string = 'en'): string {
    return this._getLocale(language).humanizePeriodicity(this.periodicity);
  }

  humanizeValue(language: string = 'en'): string {
    return this._getLocale(language).humanizeValue(this.periodicity, this.value);
  }

  private _validateValue(value: string): void {
    try {
      const newValue = TimeSlot.fromDate(this.firstDate, this._periodicity);
      if (newValue.value !== value) {
        throw new Error();
      }
    } catch {
      throw new Error('Invalid time slot value');
    }
  }

  private _getLocale(language: string): typeof en {
    const locale = LOCALES[language];
    if (!locale) {
      throw new Error(`Unknown locale: ${language}`);
    }
    return locale;
  }
}

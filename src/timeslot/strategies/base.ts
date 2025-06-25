import { TimeSlotStrategy, TimeSlotStrategyFactory } from '../strategy';
import {
  TimeSlotPeriodicity,
  getParentPeriodicities,
  getChildPeriodicities,
} from '../../periodicity';

export abstract class BaseTimeSlotStrategy implements TimeSlotStrategy {
  abstract readonly periodicity: TimeSlotPeriodicity;

  toParentPeriodicity(value: string, newPeriodicity: TimeSlotPeriodicity): string {
    // Validate that the conversion is valid
    const parentPeriodicities = getParentPeriodicities(this.periodicity);
    if (parentPeriodicities.indexOf(newPeriodicity) === -1) {
      throw new Error(`Cannot convert to ${newPeriodicity}`);
    }

    const firstDate = this.calculateFirstDate(value);
    const lastDate = this.calculateLastDate(value);
    const middleDate = new Date(
      firstDate.getTime() + (lastDate.getTime() - firstDate.getTime()) / 2
    );

    const parentStrategy = TimeSlotStrategyFactory.get(newPeriodicity);
    return parentStrategy.fromDate(middleDate);
  }

  toChildPeriodicity(value: string, newPeriodicity: TimeSlotPeriodicity): string[] {
    // Validate that the conversion is valid
    const childPeriodicities = getChildPeriodicities(this.periodicity);
    if (childPeriodicities.indexOf(newPeriodicity) === -1) {
      throw new Error(`Cannot convert to ${newPeriodicity}`);
    }

    const firstDate = this.calculateFirstDate(value);
    const lastDate = this.calculateLastDate(value);
    const childStrategy = TimeSlotStrategyFactory.get(newPeriodicity);

    const result: string[] = [];
    let currentValue = childStrategy.fromDate(firstDate);
    let currentDate = childStrategy.calculateFirstDate(currentValue);

    // Include children that start within the range
    while (currentDate.getTime() < lastDate.getTime()) {
      result.push(currentValue);
      currentValue = childStrategy.calculateNext(currentValue);
      currentDate = childStrategy.calculateFirstDate(currentValue);
    }

    return result;
  }

  abstract calculateFirstDate(value: string): Date;
  abstract calculateLastDate(value: string): Date;
  abstract calculatePrevious(value: string): string;
  abstract calculateNext(value: string): string;
  abstract fromDate(date: Date): string;
}

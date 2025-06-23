import { TimeSlot } from '../src/timeslot';

describe('TimeSlot Constructor', () => {
  describe('.fromValue', () => {
    it('should not allow invalid values with fromValue', () => {
      expect(() => TimeSlot.fromValue('Malaria', true)).toThrow();
    });

    it('should not allow invalid values with constructor', () => {
      expect(() => new TimeSlot('Malaria', true)).toThrow();
    });

    it('should allow valid values without validation', () => {
      expect(() => TimeSlot.fromValue('2010-01-01')).not.toThrow();
      expect(() => new TimeSlot('2010-01-01')).not.toThrow();
    });
  });
}); 
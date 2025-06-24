import { TimeSlot } from '../src/timeslot';

describe('TimeSlot Dates', () => {
  describe('.firstDate', () => {
    it('should work with month_week_sun format week 1', () => {
      const ts = TimeSlot.fromValue('2017-05-W1-sun');
      expect(ts.firstDate.getUTCDate()).toBe(1);
    });

    it('should work with month_week_sun format week 2', () => {
      const ts = TimeSlot.fromValue('2017-05-W2-sun');
      expect(ts.firstDate.getUTCDate()).toBe(7);
    });

    it('should work with month_week_sun format week 5', () => {
      const ts = TimeSlot.fromValue('2017-05-W5-sun');
      expect(ts.firstDate.getUTCDate()).toBe(28);
    });

    it('should work with day format', () => {
      const ts = TimeSlot.fromValue('2017-05-15');
      expect(ts.firstDate.getUTCDate()).toBe(15);
      expect(ts.firstDate.getUTCMonth()).toBe(4); // May is month 4 (0-indexed)
      expect(ts.firstDate.getUTCFullYear()).toBe(2017);
    });

    it('should work with month format', () => {
      const ts = TimeSlot.fromValue('2017-05');
      expect(ts.firstDate.getUTCDate()).toBe(1);
      expect(ts.firstDate.getUTCMonth()).toBe(4); // May is month 4 (0-indexed)
      expect(ts.firstDate.getUTCFullYear()).toBe(2017);
    });
  });

  describe('.lastDate', () => {
    it('should work with month_week_sun format week 1', () => {
      const ts = TimeSlot.fromValue('2017-05-W1-sun');
      expect(ts.lastDate.getUTCDate()).toBe(6);
    });

    it('should work with month_week_sun format week 2', () => {
      const ts = TimeSlot.fromValue('2017-05-W2-sun');
      expect(ts.lastDate.getUTCDate()).toBe(13);
    });

    it('should work with month_week_sun format week 5', () => {
      const ts = TimeSlot.fromValue('2017-05-W5-sun');
      expect(ts.lastDate.getUTCDate()).toBe(31);
    });

    it('should work with day format', () => {
      const ts = TimeSlot.fromValue('2017-05-15');
      expect(ts.lastDate.getUTCDate()).toBe(15);
      expect(ts.lastDate.getUTCMonth()).toBe(4); // May is month 4 (0-indexed)
      expect(ts.lastDate.getUTCFullYear()).toBe(2017);
    });

    it('should work with month format', () => {
      const ts = TimeSlot.fromValue('2017-05');
      expect(ts.lastDate.getUTCDate()).toBe(31);
      expect(ts.lastDate.getUTCMonth()).toBe(4); // May is month 4 (0-indexed)
      expect(ts.lastDate.getUTCFullYear()).toBe(2017);
    });
  });
}); 
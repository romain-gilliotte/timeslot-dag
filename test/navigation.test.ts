import { TimeSlot } from '../src/timeslot';

describe('TimeSlot Navigation', () => {
  describe('.previous()', () => {
    it('should work with month_week_sun formats within same month', () => {
      let ts = TimeSlot.fromValue('2017-07-W6-sun');
      ts = ts.previous();
      expect(ts.value).toBe('2017-07-W5-sun');
      ts = ts.previous();
      expect(ts.value).toBe('2017-07-W4-sun');
      ts = ts.previous();
      expect(ts.value).toBe('2017-07-W3-sun');
      ts = ts.previous();
      expect(ts.value).toBe('2017-07-W2-sun');
      ts = ts.previous();
      expect(ts.value).toBe('2017-07-W1-sun');
    });

    it('should work with month_week_sun formats across month boundaries', () => {
      let ts = TimeSlot.fromValue('2017-07-W1-sun');
      ts = ts.previous();
      expect(ts.value).toBe('2017-06-W5-sun');
      ts = ts.previous();
      expect(ts.value).toBe('2017-06-W4-sun');
      ts = ts.previous();
      expect(ts.value).toBe('2017-06-W3-sun');
      ts = ts.previous();
      expect(ts.value).toBe('2017-06-W2-sun');
      ts = ts.previous();
      expect(ts.value).toBe('2017-06-W1-sun');
    });

    it('should work with month_week_sun formats across multiple months', () => {
      let ts = TimeSlot.fromValue('2017-06-W1-sun');
      ts = ts.previous();
      expect(ts.value).toBe('2017-05-W5-sun');
      ts = ts.previous();
      expect(ts.value).toBe('2017-05-W4-sun');
      ts = ts.previous();
      expect(ts.value).toBe('2017-05-W3-sun');
      ts = ts.previous();
      expect(ts.value).toBe('2017-05-W2-sun');
      ts = ts.previous();
      expect(ts.value).toBe('2017-05-W1-sun');
    });

    it('should work with day format', () => {
      let ts = TimeSlot.fromValue('2017-05-15');
      ts = ts.previous();
      expect(ts.value).toBe('2017-05-14');
    });

    it('should work with month format', () => {
      let ts = TimeSlot.fromValue('2017-05');
      ts = ts.previous();
      expect(ts.value).toBe('2017-04');
    });
  });

  describe('.next()', () => {
    it('should work with month_week_sun formats within same month', () => {
      let ts = TimeSlot.fromValue('2017-05-W1-sun');
      ts = ts.next();
      expect(ts.value).toBe('2017-05-W2-sun');
      ts = ts.next();
      expect(ts.value).toBe('2017-05-W3-sun');
      ts = ts.next();
      expect(ts.value).toBe('2017-05-W4-sun');
      ts = ts.next();
      expect(ts.value).toBe('2017-05-W5-sun');
    });

    it('should work with month_week_sun formats across month boundaries', () => {
      let ts = TimeSlot.fromValue('2017-05-W5-sun');
      ts = ts.next();
      expect(ts.value).toBe('2017-06-W1-sun');
      ts = ts.next();
      expect(ts.value).toBe('2017-06-W2-sun');
      ts = ts.next();
      expect(ts.value).toBe('2017-06-W3-sun');
      ts = ts.next();
      expect(ts.value).toBe('2017-06-W4-sun');
      ts = ts.next();
      expect(ts.value).toBe('2017-06-W5-sun');
    });

    it('should work with month_week_sun formats across multiple months', () => {
      let ts = TimeSlot.fromValue('2017-06-W5-sun');
      ts = ts.next();
      expect(ts.value).toBe('2017-07-W1-sun');
      ts = ts.next();
      expect(ts.value).toBe('2017-07-W2-sun');
      ts = ts.next();
      expect(ts.value).toBe('2017-07-W3-sun');
      ts = ts.next();
      expect(ts.value).toBe('2017-07-W4-sun');
      ts = ts.next();
      expect(ts.value).toBe('2017-07-W5-sun');
      ts = ts.next();
      expect(ts.value).toBe('2017-07-W6-sun');
    });

    it('should work with day format', () => {
      let ts = TimeSlot.fromValue('2017-05-15');
      ts = ts.next();
      expect(ts.value).toBe('2017-05-16');
    });

    it('should work with month format', () => {
      let ts = TimeSlot.fromValue('2017-05');
      ts = ts.next();
      expect(ts.value).toBe('2017-06');
    });
  });
}); 
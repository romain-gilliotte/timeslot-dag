import { TimeSlot } from '../src/timeslot';

describe('TimeSlot Epidemiologic Weeks', () => {
  describe('_getEpidemiologicWeekEpoch', () => {
    // Test the private method through reflection or public interface
    it('should calculate correct epoch for Sunday-based weeks in 2023', () => {
      // 2023-01-01 is a Sunday, so the first epidemiologic week starts on 2023-01-01
      const ts = TimeSlot.fromValue('2023-W01-sun');
      expect(ts.firstDate.getUTCDate()).toBe(1);
      expect(ts.firstDate.getUTCMonth()).toBe(0); // January
      expect(ts.firstDate.getUTCFullYear()).toBe(2023);
    });

    it('should calculate correct epoch for Sunday-based weeks in 2024', () => {
      // 2024-01-01 is a Monday, so the first epidemiologic week starts on 2023-12-31
      const ts = TimeSlot.fromValue('2024-W01-sun');
      expect(ts.firstDate.getUTCDate()).toBe(31);
      expect(ts.firstDate.getUTCMonth()).toBe(11); // December
      expect(ts.firstDate.getUTCFullYear()).toBe(2023);
    });

    it('should calculate correct epoch for Monday-based weeks in 2023', () => {
      // 2023-01-01 is a Sunday, so the first epidemiologic week starts on 2023-01-02
      const ts = TimeSlot.fromValue('2023-W01-mon');
      expect(ts.firstDate.getUTCDate()).toBe(2);
      expect(ts.firstDate.getUTCMonth()).toBe(0); // January
      expect(ts.firstDate.getUTCFullYear()).toBe(2023);
    });

    it('should calculate correct epoch for Monday-based weeks in 2024', () => {
      // 2024-01-01 is a Monday, so the first epidemiologic week starts on 2024-01-01
      const ts = TimeSlot.fromValue('2024-W01-mon');
      expect(ts.firstDate.getUTCDate()).toBe(1);
      expect(ts.firstDate.getUTCMonth()).toBe(0); // January
      expect(ts.firstDate.getUTCFullYear()).toBe(2024);
    });

    it('should calculate correct epoch for Saturday-based weeks in 2023', () => {
      // 2023-01-01 is a Sunday, so the first epidemiologic week starts on 2022-12-31
      const ts = TimeSlot.fromValue('2023-W01-sat');
      expect(ts.firstDate.getUTCDate()).toBe(31);
      expect(ts.firstDate.getUTCMonth()).toBe(11); // December
      expect(ts.firstDate.getUTCFullYear()).toBe(2022);
    });

    it('should calculate correct epoch for Saturday-based weeks in 2024', () => {
      // 2024-01-01 is a Monday, so the first epidemiologic week starts on 2023-12-30
      const ts = TimeSlot.fromValue('2024-W01-sat');
      expect(ts.firstDate.getUTCDate()).toBe(30);
      expect(ts.firstDate.getUTCMonth()).toBe(11); // December
      expect(ts.firstDate.getUTCFullYear()).toBe(2023);
    });
  });
}); 
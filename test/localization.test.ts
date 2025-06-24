import { TimeSlot } from '../src/timeslot';

describe('TimeSlot Localization', () => {
  describe('.humanizePeriodicity', () => {
    it('should work with English locale', () => {
      const ts = TimeSlot.fromValue('2017-05-W1-sun');
      expect(ts.humanizePeriodicity('en')).toBe('Week (sunday to saturday / split by month)');
    });

    it('should work with French locale', () => {
      const ts = TimeSlot.fromValue('2017-05-W1-sun');
      expect(ts.humanizePeriodicity('fr')).toBe('Semaines (dimanche à samedi / coupées par mois)');
    });

    it('should work with Spanish locale', () => {
      const ts = TimeSlot.fromValue('2017-05-W1-sun');
      expect(ts.humanizePeriodicity('es')).toBe('Semana (domingo a sábado / cortado por mes)');
    });

    it('should throw error for unknown locale', () => {
      const ts = TimeSlot.fromValue('2017-05-W1-sun');
      expect(() => ts.humanizePeriodicity('unknown')).toThrow(/Unknown locale: unknown/);
    });
  });

  describe('.humanizeValue', () => {
    it('should work with English locale', () => {
      const ts = TimeSlot.fromValue('2017-05-W1-sun');
      expect(ts.humanizeValue('en')).toBe('2017-05-W1');
    });

    it('should work with French locale', () => {
      const ts = TimeSlot.fromValue('2017-05-W1-sun');
      expect(ts.humanizeValue('fr')).toBe('Sem. 1 Mai 2017');
    });

    it('should work with Spanish locale', () => {
      const ts = TimeSlot.fromValue('2017-05-W1-sun');
      expect(ts.humanizeValue('es')).toBe('Sem. 1 Mayo 2017');
    });

    it('should throw error for unknown locale', () => {
      const ts = TimeSlot.fromValue('2017-05-W1-sun');
      expect(() => ts.humanizeValue('unknown')).toThrow(/Unknown locale: unknown/);
    });
  });
}); 
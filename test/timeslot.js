const assert = require('assert');
const TimeSlot = require('../src/timeslot');

describe("TimeSlot", () => {

	describe(".periodicity", () => {

		it("should work with year format", () => {
			let ts = TimeSlot.fromValue('2010');
			assert.equal(ts.periodicity, 'year');
		});

		it("should work with semester format", () => {
			let ts = TimeSlot.fromValue('2010-S1');
			assert.equal(ts.periodicity, 'semester');
		});

		it("should work with quarter format", () => {
			let ts = TimeSlot.fromValue('2010-Q1');
			assert.equal(ts.periodicity, 'quarter');
		});

		it("should work with month format", () => {
			let ts = TimeSlot.fromValue('2010-10');
			assert.equal(ts.periodicity, 'month');
		});

		it("should work with month_week_sat formats", () => {
			let ts = TimeSlot.fromValue('2010-05-W1-sat');
			assert.equal(ts.periodicity, 'month_week_sat');
		});

		it("should work with month_week_sun formats", () => {
			let ts = TimeSlot.fromValue('2010-05-W1-sun');
			assert.equal(ts.periodicity, 'month_week_sun');
		});

		it("should work with month_week_mon formats", () => {
			let ts = TimeSlot.fromValue('2010-05-W1-mon');
			assert.equal(ts.periodicity, 'month_week_mon');
		});

		it("should work with week_sat formats", () => {
			let ts = TimeSlot.fromValue('2010-W01-sat');
			assert.equal(ts.periodicity, 'week_sat');
		});

		it("should work with week_sun formats", () => {
			let ts = TimeSlot.fromValue('2010-W01-sun');
			assert.equal(ts.periodicity, 'week_sun');
		});

		it("should work with week_mon formats", () => {
			let ts = TimeSlot.fromValue('2010-W01-mon');
			assert.equal(ts.periodicity, 'week_mon');
		});

		it("should work with day formats", () => {
			let ts = TimeSlot.fromValue('2010-01-02');
			assert.equal(ts.periodicity, 'day');
		});
	});

	describe(".firstDate", () => {

		it("should work with month_week_sun formats", () => {
			let ts;
			ts = TimeSlot.fromValue('2017-05-W1-sun');
			assert.equal(ts.firstDate.getUTCDate(), 1);

			ts = TimeSlot.fromValue('2017-05-W2-sun');
			assert.equal(ts.firstDate.getUTCDate(), 7);

			ts = TimeSlot.fromValue('2017-05-W5-sun');
			assert.equal(ts.firstDate.getUTCDate(), 28);
		});

	});

	describe(".lastDate", () => {

		it("should work with month_week_sun formats", () => {
			let ts;
			ts = TimeSlot.fromValue('2017-05-W1-sun');
			assert.equal(ts.lastDate.getUTCDate(), 6);

			ts = TimeSlot.fromValue('2017-05-W2-sun');
			assert.equal(ts.lastDate.getUTCDate(), 13);

			ts = TimeSlot.fromValue('2017-05-W5-sun');
			assert.equal(ts.lastDate.getUTCDate(), 31);
		});

	});

	describe(".previous()", () => {

		it("should work with month_week_sun formats", () => {
			let ts = TimeSlot.fromValue('2017-07-W6-sun');
			ts = ts.previous(); assert.equal(ts.value, '2017-07-W5-sun');
			ts = ts.previous(); assert.equal(ts.value, '2017-07-W4-sun');
			ts = ts.previous(); assert.equal(ts.value, '2017-07-W3-sun');
			ts = ts.previous(); assert.equal(ts.value, '2017-07-W2-sun');
			ts = ts.previous(); assert.equal(ts.value, '2017-07-W1-sun');
			ts = ts.previous(); assert.equal(ts.value, '2017-06-W5-sun');
			ts = ts.previous(); assert.equal(ts.value, '2017-06-W4-sun');
			ts = ts.previous(); assert.equal(ts.value, '2017-06-W3-sun');
			ts = ts.previous(); assert.equal(ts.value, '2017-06-W2-sun');
			ts = ts.previous(); assert.equal(ts.value, '2017-06-W1-sun');
			ts = ts.previous(); assert.equal(ts.value, '2017-05-W5-sun');
			ts = ts.previous(); assert.equal(ts.value, '2017-05-W4-sun');
			ts = ts.previous(); assert.equal(ts.value, '2017-05-W3-sun');
			ts = ts.previous(); assert.equal(ts.value, '2017-05-W2-sun');
			ts = ts.previous(); assert.equal(ts.value, '2017-05-W1-sun');
		});

	});

	describe(".next()", () => {

		it("should work with month_week_sun formats", () => {
			let ts = TimeSlot.fromValue('2017-05-W1-sun');

			ts = ts.next(); assert.equal(ts.value, '2017-05-W2-sun');
			ts = ts.next(); assert.equal(ts.value, '2017-05-W3-sun');
			ts = ts.next(); assert.equal(ts.value, '2017-05-W4-sun');
			ts = ts.next(); assert.equal(ts.value, '2017-05-W5-sun');
			ts = ts.next(); assert.equal(ts.value, '2017-06-W1-sun');
			ts = ts.next(); assert.equal(ts.value, '2017-06-W2-sun');
			ts = ts.next(); assert.equal(ts.value, '2017-06-W3-sun');
			ts = ts.next(); assert.equal(ts.value, '2017-06-W4-sun');
			ts = ts.next(); assert.equal(ts.value, '2017-06-W5-sun');
			ts = ts.next(); assert.equal(ts.value, '2017-07-W1-sun');
			ts = ts.next(); assert.equal(ts.value, '2017-07-W2-sun');
			ts = ts.next(); assert.equal(ts.value, '2017-07-W3-sun');
			ts = ts.next(); assert.equal(ts.value, '2017-07-W4-sun');
			ts = ts.next(); assert.equal(ts.value, '2017-07-W5-sun');
			ts = ts.next(); assert.equal(ts.value, '2017-07-W6-sun');
		});

	});

	describe(".parentPeriodicities", () => {

		it('should work', () => {
			let ts = TimeSlot.fromValue('2017-05-W1-sun');
			assert.deepEqual(ts.parentPeriodicities, ['week_sun', 'month', 'quarter', 'semester', 'year', 'all']);
		});

	});

	describe(".childPeriodicities", () => {

		it('should work with weeks', () => {
			let ts = TimeSlot.fromValue('2017-05-W1-sun');
			assert.deepEqual(ts.childPeriodicities, ['day']);
		});

		it('should work with month', () => {
			let ts = TimeSlot.fromValue('2017-05');
			assert.deepEqual(ts.childPeriodicities, ['day', 'month_week_sat', 'month_week_sun', 'month_week_mon', 'week_sat', 'week_sun', 'week_mon']);
		});

	});

	describe(".toParentPeriodicity()", () => {

		it('should work', () => {
			let ts = TimeSlot.fromValue('2017-05-W1-sun');
			assert.deepEqual(ts.toParentPeriodicity('year'), TimeSlot.fromValue('2017'));
			assert.deepEqual(ts.toParentPeriodicity('month'), TimeSlot.fromValue('2017-05'));
		});

	});

	describe(".toChildPeriodicity()", () => {

		it('should work', () => {
			let ts = TimeSlot.fromValue('2018-W18-sun');
			assert.deepEqual(
				ts.toChildPeriodicity('day').map(t => t.value),
				[
					TimeSlot.fromValue('2018-04-29'),
					TimeSlot.fromValue('2018-04-30'),
					TimeSlot.fromValue('2018-05-01'),
					TimeSlot.fromValue('2018-05-02'),
					TimeSlot.fromValue('2018-05-03'),
					TimeSlot.fromValue('2018-05-04'),
					TimeSlot.fromValue('2018-05-05')
				].map(t => t.value)
			);
		});
	});

	describe(".humanizeValue()", () => {

		it('should raise on invalid locale', () => {
			let ts = TimeSlot.fromValue('2017-05-W1-sun');

			assert.throws(() => ts.humanizeValue('../../infected-pkg/test/something'));
		})

		it('should raise on missing locale', () => {
			let ts = TimeSlot.fromValue('2017-05-W1-sun');

			assert.throws(() => ts.humanizeValue('pt'));
		});

		it('should work with month_week_*', () => {
			let ts = TimeSlot.fromValue('2017-05-W1-sun');

			assert.equal(ts.humanizeValue('fr'), 'Sem. 1 Mai 2017');
			assert.equal(ts.humanizeValue('es'), 'Sem. 1 Mayo 2017');
			assert.equal(ts.humanizeValue('en'), '2017-05-W1');
		});

		it('should work with quarter', () => {
			let ts = TimeSlot.fromValue('2017-Q4');

			assert.equal(ts.humanizeValue('fr'), '4ème trim. 2017');
			assert.equal(ts.humanizeValue('es'), 'Cuarto trim. 2017');
			assert.equal(ts.humanizeValue('en'), '2017-Q4');
		});

		it('should work with all', () => {
			let ts = TimeSlot.fromValue('all');

			assert.equal(ts.humanizeValue('fr'), 'Tout');
			assert.equal(ts.humanizeValue('es'), 'Todo');
			assert.equal(ts.humanizeValue('en'), 'All');
		});

	});

	describe(".humanizePeriodicity()", () => {

		it('should raise on invalid locale', () => {
			let ts = TimeSlot.fromValue('2017-05');

			assert.throws(() => ts.humanizePeriodicity('../../infected-pkg/test/something'));
		})

		it('should raise on missing locale', () => {
			let ts = TimeSlot.fromValue('2017-05');

			assert.throws(() => ts.humanizePeriodicity('pt'));
		});

		it('should work with provided locales', () => {
			let ts = TimeSlot.fromValue('2017-05');

			assert.equal(ts.humanizePeriodicity('fr'), 'Mois');
			assert.equal(ts.humanizePeriodicity('es'), 'Mes');
			assert.equal(ts.humanizePeriodicity('en'), 'Month');
		});


		it('should work with all', () => {
			let ts = TimeSlot.fromValue('all');

			assert.equal(ts.humanizePeriodicity('fr'), 'Tout');
			assert.equal(ts.humanizePeriodicity('es'), 'Todo');
			assert.equal(ts.humanizePeriodicity('en'), 'All');
		});

	});


});
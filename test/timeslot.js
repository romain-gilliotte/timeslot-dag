import assert from 'assert';
import TimeSlot, {timeSlotRange} from '../lib/timeslot';


describe("TimeSlot", () => {

	describe(".periodicity", () => {

		it("should work with year format", () => {
			let ts = new TimeSlot('2010');
			assert.equal(ts.periodicity, 'year');
		});

		it("should work with quarter format", () => {
			let ts = new TimeSlot('2010-Q1');
			assert.equal(ts.periodicity, 'quarter');
		});

		it("should work with month format", () => {
			let ts = new TimeSlot('2010-10');
			assert.equal(ts.periodicity, 'month');
		});

		it("should work with month_week_sat formats", () => {
			let ts = new TimeSlot('2010-05-W1-sat');
			assert.equal(ts.periodicity, 'month_week_sat');
		});

		it("should work with month_week_sun formats", () => {
			let ts = new TimeSlot('2010-05-W1-sun');
			assert.equal(ts.periodicity, 'month_week_sun');
		});

		it("should work with month_week_mon formats", () => {
			let ts = new TimeSlot('2010-05-W1-mon');
			assert.equal(ts.periodicity, 'month_week_mon');
		});

		it("should work with week_sat formats", () => {
			let ts = new TimeSlot('2010-W01-sat');
			assert.equal(ts.periodicity, 'week_sat');
		});

		it("should work with week_sun formats", () => {
			let ts = new TimeSlot('2010-W01-sun');
			assert.equal(ts.periodicity, 'week_sun');
		});

		it("should work with week_mon formats", () => {
			let ts = new TimeSlot('2010-W01-mon');
			assert.equal(ts.periodicity, 'week_mon');
		});

		it("should work with day formats", () => {
			let ts = new TimeSlot('2010-01-02');
			assert.equal(ts.periodicity, 'day');
		});
	});

	describe(".firstDate", () => {

		it("should work with month_week_sun formats", () => {
			let ts;
			ts = new TimeSlot('2017-05-W1-sun');
			assert.equal(ts.firstDate.getUTCDate(), 1);

			ts = new TimeSlot('2017-05-W2-sun');
			assert.equal(ts.firstDate.getUTCDate(), 7);

			ts = new TimeSlot('2017-05-W5-sun');
			assert.equal(ts.firstDate.getUTCDate(), 28);
		});

	});

	describe(".lastDate", () => {

		it("should work with month_week_sun formats", () => {
			let ts;
			ts = new TimeSlot('2017-05-W1-sun');
			assert.equal(ts.lastDate.getUTCDate(), 6);

			ts = new TimeSlot('2017-05-W2-sun');
			assert.equal(ts.lastDate.getUTCDate(), 13);

			ts = new TimeSlot('2017-05-W5-sun');
			assert.equal(ts.lastDate.getUTCDate(), 31);
		});

	});

	describe(".next()", () => {

		it("should work with month_week_sun formats", () => {
			let ts = new TimeSlot('2017-05-W1-sun');

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

	describe(".toUpperSlot()", () => {

		it('should work', () => {
			let ts = new TimeSlot('2017-05-W1-sun');
			assert.deepEqual(ts.toUpperSlot('year'), new TimeSlot('2017'));
			assert.deepEqual(ts.toUpperSlot('month'), new TimeSlot('2017-05'));
		});

	});

});

describe('range', () => {

	it('should iterate between timeslots', () => {

		const [ts1, ts2] = [new TimeSlot('2010-01-15'), new TimeSlot('2010-03-01')];
		const content = Array.from(timeSlotRange(ts1, ts2)).map(ts => ts.value);

		assert.deepEqual(content, [
			'2010-01-15', '2010-01-16', '2010-01-17', '2010-01-18', '2010-01-19', '2010-01-20',
			'2010-01-21', '2010-01-22', '2010-01-23', '2010-01-24', '2010-01-25', '2010-01-26',
			'2010-01-27', '2010-01-28', '2010-01-29', '2010-01-30', '2010-01-31', '2010-02-01',
			'2010-02-02', '2010-02-03', '2010-02-04', '2010-02-05', '2010-02-06', '2010-02-07',
			'2010-02-08', '2010-02-09', '2010-02-10', '2010-02-11', '2010-02-12', '2010-02-13',
			'2010-02-14', '2010-02-15', '2010-02-16', '2010-02-17', '2010-02-18', '2010-02-19',
			'2010-02-20', '2010-02-21', '2010-02-22', '2010-02-23', '2010-02-24', '2010-02-25',
			'2010-02-26', '2010-02-27', '2010-02-28', '2010-03-01'
		]);
	});
});

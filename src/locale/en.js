const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const PERIODICITIES = {
  day: 'Day',
  month_week_sat: 'Week (saturday to friday / split by month)',
  month_week_sun: 'Week (sunday to saturday / split by month)',
  month_week_mon: 'Week (monday to sunday / split by month)',
  week_sat: 'Week (saturday to friday)',
  week_sun: 'Week (sunday to saturday)',
  week_mon: 'Week (monday to sunday)',
  month: 'Month',
  quarter: 'Quarter',
  semester: 'Semester',
  year: 'Year',
  all: 'All',
};

module.exports = {
  humanizeValue(periodicity, value) {
    const year = value.substring(0, 4);

    switch (periodicity) {
      case 'all':
        return 'All';

      case 'year':
      case 'semester':
      case 'quarter':
        return value;

      case 'month':
        return MONTHS[value.substring(5, 7) - 1] + ' ' + year;

      case 'month_week_sat':
      case 'month_week_sun':
      case 'month_week_mon':
        return value.substring(0, 10);

      case 'week_sat':
      case 'week_sun':
      case 'week_mon':
        return value.substring(0, 8);

      case 'day':
        return MONTHS[value.substring(5, 7) - 1] + ' ' + value.substring(8) + ', ' + year;

      default:
        return value;
    }
  },

  humanizePeriodicity(periodicity) {
    return PERIODICITIES[periodicity];
  },
};


const MONTHS = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre"
];

const SEMESTERS = [
    "1er sem.", '2ème sem.'
];

const QUARTERS = [
    "1er trim.", "2ème trim.", "3ème trim.", "4ème trim."
];

const PERIODICITIES = {
    day: 'Jour',
    month_week_sat: "Semaines (samedi à vendredi / coupées par mois)",
    month_week_sun: "Semaines (dimanche à samedi / coupées par mois)",
    month_week_mon: "Semaines (lundi à dimanche / coupées par mois)",
    week_sat: "Semaines (samedi à vendredi)",
    week_sun: "Semaines (dimanche à samedi)",
    week_mon: "Semaines (lundi à dimanche)",
    month: 'Mois',
    quarter: "Trimestre",
    semester: "Semestre",
    year: "Année",
}


module.exports = {
    humanizeValue(periodicity, value) {
        const year = value.substring(0, 4);

        switch (periodicity) {
            case 'year':
                return year;

            case 'semester':
                return SEMESTERS[value.substring(6) * 1] + ' ' + year;

            case 'quarter':
                return QUARTERS[value.substring(6) * 1] + ' ' + year;

            case 'month':
                return MONTHS[value.substring(5, 7) - 1] + ' ' + year;

            case 'month_week_sat':
            case 'month_week_sun':
            case 'month_week_mon':
                return 'Sem. '
                    + value.substring(9, 10)
                    + ' '
                    + MONTHS[value.substring(5, 7) - 1]
                    + ' '
                    + year;

            case 'week_sat':
            case 'week_sun':
            case 'week_mon':
                return 'Sem. ' + value.substring(6, 8) + ' ' + year;

            case 'day':
                return value.substring(8)
                    + ' '
                    + MONTHS[value.substring(5, 7) - 1]
                    + ' '
                    + year;

            default:
                return value;
        }
    },

    humanizePeriodicity(periodicity) {
        return PERIODICITIES[periodicity];
    }
};

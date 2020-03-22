
const MONTHS = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre"
];

const SEMESTERS = [
    "Primer sem.", 'Segundo sem.'
];

const QUARTERS = [
    "Primer trim.", "Segundo trim.", "Tercero trim.", "Cuarto trim."
];

const PERIODICITIES = {
    day: 'Día',
    month_week_sat: 'Semana (sábado a viernes / cortado por mes)',
    month_week_sun: 'Semana (domingo a sábado / cortado por mes)',
    month_week_mon: 'Semana (lunes a domingo / cortado por mes)',
    week_sat: 'Semana (sábado a viernes)',
    week_sun: 'Semana (domingo a sábado)',
    week_mon: 'Semana (lunes a domingo)',
    month: 'Mes',
    quarter: "Trimestre",
    semester: "Semestre",
    year: "Año",
};


module.exports = {
    humanizeValue(periodicity, value) {
        const year = value.substring(0, 4);

        switch (periodicity) {
            case 'year':
                return year;

            case 'semester':
                return SEMESTERS[value.substring(6) - 1] + ' ' + year;

            case 'quarter':
                return QUARTERS[value.substring(6) - 1] + ' ' + year;

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

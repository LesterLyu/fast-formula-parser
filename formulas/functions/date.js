const FormulaError = require('../error');
const {FormulaHelpers, Types} = require('../helpers');
const H = FormulaHelpers;

const MS_PER_DAY = 1000 * 60 * 60 * 24;
const d1900 = new Date(Date.UTC(1900, 0, 1));
const WEEK_STARTS = [
    undefined, 0, 1, undefined, undefined, undefined, undefined, undefined, undefined,
    undefined, undefined, undefined, 1, 2, 3, 4, 5, 6, 0];
const WEEK_TYPES = [
    [],
    [1, 2, 3, 4, 5, 6, 7],
    [7, 1, 2, 3, 4, 5, 6],
    [6, 0, 1, 2, 3, 4, 5],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [7, 1, 2, 3, 4, 5, 6],
    [6, 7, 1, 2, 3, 4, 5],
    [5, 6, 7, 1, 2, 3, 4],
    [4, 5, 6, 7, 1, 2, 3],
    [3, 4, 5, 6, 7, 1, 2],
    [2, 3, 4, 5, 6, 7, 1],
    [1, 2, 3, 4, 5, 6, 7]
];
const WEEKEND_TYPES = [
    [],
    [6, 0],
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
    [5, 6],
    undefined,
    undefined,
    undefined, [0, 0],
    [1, 1],
    [2, 2],
    [3, 3],
    [4, 4],
    [5, 5],
    [6, 6]
];

const dateFormates = ['MM/DD/YYYY', 'dddd, MMMM, DD, YYYY', 'YYYY-MM-DD', 'M/DD', 'M/DD/YY', 'MM/DD/YY', 'DD-MMM',
    'DD-MMM-YY', 'D-MMM-YY', 'MMM-YY', 'MMMM-YY', 'MMMM DD, YYYY', 'M/DD/YY h:m A',
    'M/DD/YY HH:m', 'M/DD/YYYY', 'DD-MMM-YYYY', 'h:mm A', 'h:mm:ss A', 'H:mm', 'H:mm:ss', 'M/DD/YYYY h:mm A',
    'M/DD/YYYY h:mm:ss A', 'M/DD/YYYY H:mm:ss', 'YYYY-MM-DD H:mm:ss', 'YYYY-MM-DD h:mm:ss A', 'YY-MM-DD H:mm:ss',
    'YY-MM-DD h:mm:ss A'];

const timeRegex = /^\s*(\d\d?)(:\d\d?)?(:\d\d?)?\s*(pm|am)\s*$/i;

/**
 * Parse a UTC date to excel serial number.
 * @param date
 * @returns {number}
 */
function toSerial(date) {
    const addOn = (date > -2203891200000) ? 2 : 1;
    return Math.ceil((date - d1900) / 86400000) + addOn;
}

/**
 * Parse an excel serial number to UTC date.
 * @param serial
 * @returns {Date}
 */
function toDate(serial) {
    if (serial < 0) {
        throw FormulaError.VALUE;
    }
    if (serial <= 60) {
        return new Date(d1900.getTime() + (serial - 1) * 86400000);
    }
    return new Date(d1900.getTime() + (serial - 2) * 86400000);
}

function parseDate(serialOrString) {
    serialOrString = H.accept(serialOrString);
    if (!isNaN(serialOrString)) {
        serialOrString = Number(serialOrString);
        return toDate(serialOrString);
    } else {
        // support time without date
        if (timeRegex.test(serialOrString)) {
            const date = new Date(Date.parse(`1/1/2000 ${serialOrString} UTC`));
            let now = new Date();
            now = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(),
                now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds()));

            return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),
                date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds()));
        } else {
            return new Date(Date.parse(`${serialOrString} UTC`));
        }
    }
}

const DateFunctions = {
    DATE: (year, month, day) => {
        year = H.accept(year, Types.NUMBER);
        month = H.accept(month, Types.NUMBER);
        day = H.accept(day, Types.NUMBER);
        if (year < 0 || year >= 10000)
            throw FormulaError.NUM;

        // If year is between 0 (zero) and 1899 (inclusive), Excel adds that value to 1900 to calculate the year.
        if (year < 1900) {
            year += 1900;
        }

        return toSerial(Date.UTC(year, month - 1, day));
    },

    DATEDIF: (startDate, endDate, unit) => {
        startDate = parseDate(startDate);
        endDate = parseDate(endDate);
        unit = H.accept(unit, Types.STRING).toLowerCase();

        if (startDate > endDate)
            throw FormulaError.NUM;
        const yearDiff = endDate.getUTCFullYear() - startDate.getUTCFullYear();
        const monthDiff = endDate.getUTCMonth() - startDate.getUTCMonth();
        const dayDiff = endDate.getUTCDate() - startDate.getUTCDate();
        let offset;
        switch (unit) {
            case 'y':
                offset = monthDiff < 0 || monthDiff === 0 && dayDiff < 0 ? -1 : 0;
                return offset + yearDiff;
            case 'm':
                offset = dayDiff < 0 ? -1 : 0;
                return yearDiff * 12 + monthDiff + offset;
            case 'd':
                return Math.floor(endDate - startDate) / MS_PER_DAY;
            case 'md':
                // The months and years of the dates are ignored.
                startDate.setUTCFullYear(endDate.getUTCFullYear());
                if (dayDiff < 0) {
                    startDate.setUTCMonth(endDate.getUTCMonth() - 1)
                } else {
                    startDate.setUTCMonth(endDate.getUTCMonth())
                }
                return Math.floor(endDate - startDate) / MS_PER_DAY;
            case 'ym':
                // The days and years of the dates are ignored
                offset = dayDiff < 0 ? -1 : 0;
                return (offset + yearDiff * 12 + monthDiff) % 12;
            case 'yd':
                // The years of the dates are ignored.
                if (monthDiff < 0 || monthDiff === 0 && dayDiff < 0) {
                    startDate.setUTCFullYear(endDate.getUTCFullYear() - 1);
                } else {
                    startDate.setUTCFullYear(endDate.getUTCFullYear());
                }
                return Math.floor(endDate - startDate) / MS_PER_DAY;

        }
    },

    /**
     * Limitation: Year must be four digit, only support ISO 8016 date format.
     * Does not support date without year, i.e. "5-JUL".
     * @param {string} dateText
     */
    DATEVALUE: (dateText) => {
        dateText = H.accept(dateText, Types.STRING);
        const date = Date.parse(`${dateText} UTC`);
        const serial = toSerial(date);
        if (serial < 0 || serial > 2958465)
            throw FormulaError.VALUE;
        return toSerial(date);
    },

    DAY: serialOrString => {
        const date = parseDate(serialOrString);
        return date.getUTCDate();
    },

    DAYS: (endDate, startDate) => {
        endDate = parseDate(endDate);
        startDate = parseDate(startDate);

        return Math.floor(endDate - startDate) / MS_PER_DAY;
    },

    DAYS360: serialeNumber => {

    },

    EDATE: serialeNumber => {

    },

    EOMONTH: serialeNumber => {

    },

    HOUR: serialOrString => {
        const date = parseDate(serialOrString);
        return date.getUTCHours();
    },

    ISOWEEKNUM: () => {

    },

    MINUTE: serialOrString => {
        const date = parseDate(serialOrString);
        return date.getUTCMinutes();
    },

    MONTH: (serialOrString) => {
        const date = parseDate(serialOrString);
        return date.getUTCMonth() + 1;
    },

    NETWORKDAYS: () => {

    },

    'NETWORKDAYS.INTL': () => {

    },

    NOW: () => {
        const now = new Date();
        return toSerial(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(),
            now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds()));
    },

    SECOND: (serialOrString) => {
        const date = parseDate(serialOrString);
        return date.getUTCSeconds();
    },

    TIME: () => {

    },

    TIMEVALUE: () => {

    },

    TODAY: () => {
        const now = new Date();
        return toSerial(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
    },

    WEEKDAY: (serialNumber, returnType) => {
        serialNumber = H.accept(serialNumber, Types.NUMBER);
        returnType = H.accept(returnType, Types.NUMBER, null);
        if (returnType == null)
            returnType = 1;

        const day = toDate(serialNumber).getUTCDay();
        return WEEK_TYPES[returnType][day];

    },

    WEEKNUM: () => {

    },

    WORKDAY: () => {

    },

    'WORKDAY.INTL': () => {

    },

    YEAR: (serialNumber) => {
        serialNumber = H.accept(serialNumber, Types.NUMBER);
        const date = toDate(serialNumber);
        return date.getUTCFullYear();
    },

    YEARFRAC: () => {

    },
};

module.exports = DateFunctions;

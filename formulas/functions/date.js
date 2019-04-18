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

// Formats: h:mm:ss A, h:mm A, H:mm, H:mm:ss, H A
const timeRegex = /^\s*(\d\d?)\s*(:\s*\d\d?)?\s*(:\s*\d\d?)?\s*(pm|am)?\s*$/i;
// 12-3, 12/3
const dateRegex1 = /^\s*((\d\d?)\s*([-\/])\s*(\d\d?))([\d:.apm\s]*)$/i;
// 3-Dec, 3/Dec
const dateRegex2 = /^\s*((\d\d?)\s*([-/])\s*(jan\w*|feb\w*|mar\w*|apr\w*|may\w*|jun\w*|jul\w*|aug\w*|sep\w*|oct\w*|nov\w*|dec\w*))([\d:.apm\s]*)$/i;
// Dec-3, Dec/3
const dateRegex3 = /^\s*((jan\w*|feb\w*|mar\w*|apr\w*|may\w*|jun\w*|jul\w*|aug\w*|sep\w*|oct\w*|nov\w*|dec\w*)\s*([-/])\s*(\d\d?))([\d:.apm\s]*)$/i;

function parseSimplifiedDate(text) {
    const fmt1 = text.match(dateRegex1);
    const fmt2 = text.match(dateRegex2);
    const fmt3 = text.match(dateRegex3);
    if (fmt1) {
        text = fmt1[1] + fmt1[3] + new Date().getFullYear() + fmt1[5];
    } else if (fmt2) {
        text = fmt2[1] + fmt2[3] + new Date().getFullYear() + fmt2[5];
    } else if (fmt3) {
        text = fmt3[1] + fmt3[3] + new Date().getFullYear() + fmt3[5];
    }
    return new Date(Date.parse(`${text} UTC`));
}

/**
 * Parse time string to date in UTC.
 * @param {string} text
 */
function parseTime(text) {
    const res = text.match(timeRegex);
    if (!res) return;

    //  ["4:50:55 pm", "4", ":50", ":55", "pm", ...]
    const minutes = res[2] ? res[2] : ':00';
    const seconds = res[3] ? res[3] : ':00';
    const ampm = res[4] ? ' ' + res[4] : '';

    const date = new Date(Date.parse(`1/1/1900 ${res[1] + minutes + seconds + ampm} UTC`));
    let now = new Date();
    now = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(),
        now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds()));

    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),
        date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds()));
}

/**
 * Parse a UTC date to excel serial number.
 * @param {Date|number} date - A UTC date.
 * @returns {number}
 */
function toSerial(date) {
    const addOn = (date > -2203891200000) ? 2 : 1;
    return Math.floor((date - d1900) / 86400000) + addOn;
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

function parseDateWithExtra(serialOrString) {
    serialOrString = H.accept(serialOrString);
    let isDateGiven = true, date;
    if (!isNaN(serialOrString)) {
        serialOrString = Number(serialOrString);
        date = toDate(serialOrString);
    } else {
        // support time without date
        date = parseTime(serialOrString);

        if (!date) {
           date = parseSimplifiedDate(serialOrString);
        } else {
            isDateGiven = false;
        }
    }
    return {date, isDateGiven};
}

function parseDate(serialOrString) {
    return parseDateWithExtra(serialOrString).date;
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
        const {date, isDateGiven} = parseDateWithExtra(dateText);
        if (!isDateGiven) return 0;
        const serial = toSerial(date);
        if (serial < 0 || serial > 2958465)
            throw FormulaError.VALUE;
        return serial;
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

    DAYS360: (startDate, endDate, method) => {
        startDate = parseDate(startDate);
        endDate = parseDate(endDate);
        // default is US method
        method = H.accept(method, Types.BOOLEAN, false);

        if (startDate.getUTCDate() === 31) {
            startDate.setUTCDate(30);
        }
        if (!method && startDate.getUTCDate() < 30 && endDate.getUTCDate() > 30) {
            // if endDate is last day of the month
            const copy = new Date(endDate);
            copy.setUTCMonth(copy.getUTCMonth() + 1, 0);
            if (copy.getUTCDate() === endDate.getUTCDate()) {
                endDate.setUTCMonth(endDate.getUTCMonth() + 1, 1);
            }
        } else {
            // European method
            if (endDate.getUTCDate() === 31) {
                endDate.setUTCDate(30);
            }
        }

        const yearDiff = endDate.getUTCFullYear() - startDate.getUTCFullYear();
        const monthDiff = endDate.getUTCMonth() - startDate.getUTCMonth();
        const dayDiff = endDate.getUTCDate() - startDate.getUTCDate();

        return (monthDiff) * 30 + dayDiff + yearDiff * 12 * 30;
    },

    EDATE: (startDate, months) => {
        startDate = parseDate(startDate);
        months = H.accept(months, Types.NUMBER);
        startDate.setUTCMonth(startDate.getUTCMonth() + months);
        return toSerial(startDate);
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

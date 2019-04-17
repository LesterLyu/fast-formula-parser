const moment = require('../../node_modules/moment/min/moment.min');
const FormulaError = require('../error');
const {FormulaHelpers, Types} = require('../helpers');
const H = FormulaHelpers;

const use1900 = true;
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
const d190031m = moment.utc('1900-3-1', dateFormates);

function toSerial(date) {
    var addOn = (date > -2203891200000) ? 2 : 1;

    return Math.ceil((date - d1900) / 86400000) + addOn;
}

function toDate(serial) {
    if (serial < 0) {
        throw FormulaError.VALUE;
    }
    if (serial <= 60) {
        return new Date(d1900.getTime() + (serial - 1) * 86400000);
    }
    return new Date(d1900.getTime() + (serial - 2) * 86400000);
}

function parseDate(date, returnSerial = false) {
    if (!isNaN(date)) {
        if (date instanceof Date) {
            return date;
        }
        const d = parseInt(date, 10);
        if (d < 0) {
            throw FormulaError.VALUE;
        }
        if (d <= 60) {
            return new Date(d1900.getTime() + (d - 1) * 86400000);
        }
        return new Date(d1900.getTime() + (d - 2) * 86400000);
    }
    if (typeof date === 'string') {
        const dateUTC = moment.utc(date, dateFormates);
        if (!dateUTC.isValid()) {
            throw FormulaError.VALUE;
        }
        if (returnSerial) {
            let modifier = 0;
            // implement excel leap year bug: https://support.microsoft.com/en-ca/help/214326/excel-incorrectly-assumes-that-the-year-1900-is-a-leap-year
            if (dateUTC > d190031m) {
                modifier++;
            }
            var dateSerial = dateUTC.clone();
            dateSerial.add(modifier, 'd');
            return [dateSerial, dateUTC.toDate()];
        } else {
            return dateUTC.toDate();
        }
    }
    throw FormulaError.VALUE;
}

const LogicalFunctions = {
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

        return toSerial(new Date(Date.UTC(year, month - 1, day)));
    },

    MONTH: (serialNumber) => {
        serialNumber = H.accept(serialNumber, Types.NUMBER);
        const date = toDate(serialNumber);
        return date.getUTCMonth() + 1;
    },

    WEEKDAY: (serialNumber, returnType) => {
        serialNumber = H.accept(serialNumber, Types.NUMBER);
        returnType = H.accept(returnType, Types.NUMBER, null);
        if (returnType == null)
            returnType = 1;

        const day = toDate(serialNumber).getUTCDay();
        return WEEK_TYPES[returnType][day];

    },

    YEAR: (serialNumber) => {
        serialNumber = H.accept(serialNumber, Types.NUMBER);
        const date = toDate(serialNumber);
        return date.getUTCFullYear();
    }
};

module.exports = LogicalFunctions;

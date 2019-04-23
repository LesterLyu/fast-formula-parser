const FormulaError = require('../error');
const {FormulaHelpers, Types} = require('../helpers');
const H = FormulaHelpers;

const MS_PER_DAY = 1000 * 60 * 60 * 24;
const d1900 = new Date(Date.UTC(1900, 0, 1));
const WEEK_STARTS = [
    undefined, 0, 1, undefined, undefined, undefined, undefined, undefined, undefined,
    undefined, undefined, undefined, 1, 2, 3, 4, 5, 6, 0];
const WEEK_TYPES = [
    undefined,
    [1, 2, 3, 4, 5, 6, 7],
    [7, 1, 2, 3, 4, 5, 6],
    [6, 0, 1, 2, 3, 4, 5],
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    [7, 1, 2, 3, 4, 5, 6],
    [6, 7, 1, 2, 3, 4, 5],
    [5, 6, 7, 1, 2, 3, 4],
    [4, 5, 6, 7, 1, 2, 3],
    [3, 4, 5, 6, 7, 1, 2],
    [2, 3, 4, 5, 6, 7, 1],
    [1, 2, 3, 4, 5, 6, 7]
];
const WEEKEND_TYPES = [
    undefined,
    [6, 0],
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
    [5, 6],
    undefined,
    undefined,
    undefined,
    [0],
    [1],
    [2],
    [3],
    [4],
    [5],
    [6]
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
    if (serialOrString instanceof Date) return {date: serialOrString};
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

function compareDateIgnoreTime(date1, date2) {
    return date1.getUTCFullYear() === date2.getUTCFullYear() &&
        date1.getUTCMonth() === date2.getUTCMonth() &&
        date1.getUTCDate() === date2.getUTCDate();
}

function isLeapYear(year) {
    if (year === 1900) {
        return true;
    }
    return new Date(year, 1, 29).getMonth() === 1;
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
        let offset = 0;
        if (startDate < -2203891200000 && -2203891200000 < endDate) {
            offset = 1;
        }
        return Math.floor(endDate - startDate) / MS_PER_DAY + offset;
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
            endDate.setUTCMonth(endDate.getUTCMonth() + 1, 1);
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

    EOMONTH: (startDate, months) => {
        startDate = parseDate(startDate);
        months = H.accept(months, Types.NUMBER);
        startDate.setUTCMonth(startDate.getUTCMonth() + months + 1, 0);
        return toSerial(startDate);
    },

    HOUR: serialOrString => {
        const date = parseDate(serialOrString);
        return date.getUTCHours();
    },

    ISOWEEKNUM: (serialOrString) => {
        const date = parseDate(serialOrString);

        // https://stackoverflow.com/questions/6117814/get-week-of-year-in-javascript-like-in-php
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const dayNum = d.getUTCDay();
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
    },

    MINUTE: serialOrString => {
        const date = parseDate(serialOrString);
        return date.getUTCMinutes();
    },

    MONTH: serialOrString => {
        const date = parseDate(serialOrString);
        return date.getUTCMonth() + 1;
    },

    NETWORKDAYS: (startDate, endDate, holidays) => {
        startDate = parseDate(startDate);
        endDate = parseDate(endDate);
        let sign = 1;
        if (startDate > endDate) {
            sign = -1;
            const temp = startDate;
            startDate = endDate;
            endDate = temp;
        }
        const holidaysArr = [];
        if (holidays != null) {
            H.flattenParams([holidays], Types.NUMBER, false, item => {
                holidaysArr.push(parseDate(item));
            });
        }
        let numWorkDays = 0;
        while (startDate <= endDate) {
            // Skips Sunday and Saturday
            if (startDate.getUTCDay() !== 0 && startDate.getUTCDay() !== 6) {
                let found = false;
                for (let i = 0; i < holidaysArr.length; i++) {
                    if (compareDateIgnoreTime(startDate, holidaysArr[i])) {
                        found = true;
                        break;
                    }
                }
                if (!found) numWorkDays++;
            }
            startDate.setUTCDate(startDate.getUTCDate() + 1);
        }
        return sign * numWorkDays;

    },

    'NETWORKDAYS.INTL': (startDate, endDate, weekend, holidays) => {
        startDate = parseDate(startDate);
        endDate = parseDate(endDate);
        let sign = 1;
        if (startDate > endDate) {
            sign = -1;
            const temp = startDate;
            startDate = endDate;
            endDate = temp;
        }
        weekend = H.accept(weekend, null, 1);
        // Using 1111111 will always return 0.
        if (weekend === '1111111')
            return 0;

        // using weekend string, i.e, 0000011
        if (typeof weekend === "string" && Number(weekend).toString() !== weekend) {
            if (weekend.length !== 7) throw FormulaError.VALUE;
            weekend = weekend.charAt(6) + weekend.slice(0, 6);
            const weekendArr = [];
            for (let i = 0; i < weekend.length; i++) {
                if (weekend.charAt(i) === '1')
                    weekendArr.push(i);
            }
            weekend = weekendArr;
        } else {
            // using weekend number
            if (typeof weekend !== "number")
                throw FormulaError.VALUE;
            weekend = WEEKEND_TYPES[weekend];
        }

        const holidaysArr = [];
        if (holidays != null) {
            H.flattenParams([holidays], Types.NUMBER, false, item => {
                holidaysArr.push(parseDate(item));
            });
        }
        let numWorkDays = 0;
        while (startDate <= endDate) {
            let skip = false;
            for (let i = 0; i < weekend.length; i++) {
                if (weekend[i] === startDate.getUTCDay()) {
                    skip = true;
                    break;
                }
            }

            if (!skip) {
                let found = false;
                for (let i = 0; i < holidaysArr.length; i++) {
                    if (compareDateIgnoreTime(startDate, holidaysArr[i])) {
                        found = true;
                        break;
                    }
                }
                if (!found) numWorkDays++;
            }
            startDate.setUTCDate(startDate.getUTCDate() + 1);
        }
        return sign * numWorkDays;

    },

    NOW: () => {
        const now = new Date();
        return toSerial(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(),
            now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds()))
            + (3600 * now.getHours() + 60 * now.getMinutes() + now.getSeconds()) / 86400;
    },

    SECOND: (serialOrString) => {
        const date = parseDate(serialOrString);
        return date.getUTCSeconds();
    },

    TIME: (hour, minute, second) => {
        hour = H.accept(hour, Types.NUMBER);
        minute = H.accept(minute, Types.NUMBER);
        second = H.accept(second, Types.NUMBER);

        if (hour < 0 || hour > 32767 || minute < 0 || minute > 32767 || second < 0 || second > 32767)
            throw FormulaError.NUM;
        return (3600 * hour + 60 * minute + second) / 86400;
    },

    TIMEVALUE: (timeText) => {
        timeText = parseDate(timeText);
        return (3600 * timeText.getUTCHours() + 60 * timeText.getUTCMinutes() + timeText.getUTCSeconds()) / 86400;
    },

    TODAY: () => {
        const now = new Date();
        return toSerial(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
    },

    WEEKDAY: (serialOrString, returnType) => {
        const date = parseDate(serialOrString);
        returnType = H.accept(returnType, Types.NUMBER, 1);

        const day = date.getUTCDay();
        const weekTypes = WEEK_TYPES[returnType];
        if (!weekTypes)
            throw FormulaError.NUM;
        return weekTypes[day];

    },

    WEEKNUM: (serialOrString, returnType) => {
        const date = parseDate(serialOrString);
        returnType = H.accept(returnType, Types.NUMBER, 1);
        if (returnType === 21) {
            return DateFunctions.ISOWEEKNUM(serialOrString);
        }
        const weekStart = WEEK_STARTS[returnType];
        const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
        const offset = yearStart.getUTCDay() < weekStart ? 1 : 0;
        return Math.ceil((((date - yearStart) / 86400000) + 1) / 7) + offset;
    },

    WORKDAY: (startDate, days, holidays) => {
        return DateFunctions["WORKDAY.INTL"](startDate, days, 1, holidays);
    },

    'WORKDAY.INTL': (startDate, days, weekend, holidays) => {
        startDate = parseDate(startDate);
        days = H.accept(days, Types.NUMBER);

        weekend = H.accept(weekend, null, 1);
        // Using 1111111 will always return value error.
        if (weekend === '1111111')
            throw FormulaError.VALUE;

        // using weekend string, i.e, 0000011
        if (typeof weekend === "string" && Number(weekend).toString() !== weekend) {
            if (weekend.length !== 7)
                throw FormulaError.VALUE;
            weekend = weekend.charAt(6) + weekend.slice(0, 6);
            const weekendArr = [];
            for (let i = 0; i < weekend.length; i++) {
                if (weekend.charAt(i) === '1')
                    weekendArr.push(i);
            }
            weekend = weekendArr;
        } else {
            // using weekend number
            if (typeof weekend !== "number")
                throw FormulaError.VALUE;
            weekend = WEEKEND_TYPES[weekend];
            if (weekend == null)
                throw FormulaError.NUM;
        }

        const holidaysArr = [];
        if (holidays != null) {
            H.flattenParams([holidays], Types.NUMBER, false, item => {
                holidaysArr.push(parseDate(item));
            });
        }
        startDate.setUTCDate(startDate.getUTCDate() + 1);
        let cnt = 0;
        while (cnt < days) {
            let skip = false;
            for (let i = 0; i < weekend.length; i++) {
                if (weekend[i] === startDate.getUTCDay()) {
                    skip = true;
                    break;
                }
            }

            if (!skip) {
                let found = false;
                for (let i = 0; i < holidaysArr.length; i++) {
                    if (compareDateIgnoreTime(startDate, holidaysArr[i])) {
                        found = true;
                        break;
                    }
                }
                if (!found) cnt++;
            }
            startDate.setUTCDate(startDate.getUTCDate() + 1);
        }
        return toSerial(startDate) - 1;
    },

    YEAR: (serialOrString) => {
        const date = parseDate(serialOrString);
        return date.getUTCFullYear();
    },

    // Warning: may have bugs
    YEARFRAC: (startDate, endDate, basis) => {
        startDate = parseDate(startDate);
        endDate = parseDate(endDate);
        if (startDate > endDate) {
            const temp = startDate;
            startDate = endDate;
            endDate = temp;
        }
        basis = H.accept(basis, Types.NUMBER, 0);
        basis = Math.trunc(basis);

        if (basis < 0 || basis > 4)
            throw FormulaError.VALUE;

        // https://github.com/LesterLyu/formula.js/blob/develop/lib/date-time.js#L508
        let sd = startDate.getUTCDate();
        const sm = startDate.getUTCMonth() + 1;
        const sy = startDate.getUTCFullYear();
        let ed = endDate.getUTCDate();
        const em = endDate.getUTCMonth() + 1;
        const ey = endDate.getUTCFullYear();

        switch (basis) {
            case 0:
                // US (NASD) 30/360
                if (sd === 31 && ed === 31) {
                    sd = 30;
                    ed = 30;
                } else if (sd === 31) {
                    sd = 30;
                } else if (sd === 30 && ed === 31) {
                    ed = 30;
                }
                return Math.abs((ed + em * 30 + ey * 360) - (sd + sm * 30 + sy * 360)) / 360;
            case 1:
                // Actual/actual
                if (ey - sy < 2) {
                    const yLength = isLeapYear(sy) && sy !== 1900 ? 366 : 365;
                    const days = DateFunctions.DAYS(endDate, startDate);
                    return days / yLength;
                } else {
                    const years = (ey - sy) + 1;
                    const days = (new Date(ey + 1, 0, 1) - new Date(sy, 0, 1)) / 1000 / 60 / 60 / 24;
                    const average = days / years;
                    return DateFunctions.DAYS(endDate, startDate) / average;
                }
            case 2:
                // Actual/360
                return Math.abs(DateFunctions.DAYS(endDate, startDate) / 360);
            case 3:
                // Actual/365
                return Math.abs(DateFunctions.DAYS(endDate, startDate) / 365);
            case 4:
                // European 30/360
                return Math.abs((ed + em * 30 + ey * 360) - (sd + sm * 30 + sy * 360)) / 360;
        }
    },
};

module.exports = DateFunctions;

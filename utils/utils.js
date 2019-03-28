const utils = {

    columnNameToNumber: columnName => {
        columnName = columnName.toUpperCase();
        const len = columnName.length;
        let number = 0;
        for (let i = 0; i < len; i++) {
            const code = columnName.charCodeAt(i);
            if (!isNaN(code)) {
                number += (code - 64) * 26 ** (len - i - 1)
            }
        }
        return number;
    },

    /**
     * Parse the cell address only.
     * @param {string} cellAddress
     * @return {{col: string | *, address: string | *, isColAbsolute: boolean, isRowAbsolute: boolean, row: string | *}}
     */
    parseCellAddress: cellAddress => {
        const res = cellAddress.match(/([$]?)([A-Za-z]{1,3})([$]?)([1-9][0-9]*)/);
        // console.log('parseCellAddress', cellAddress);
        return {
            address: res[0],
            isRowAbsolute: res[1].length !== 0,
            col: utils.columnNameToNumber(res[2]),
            isColAbsolute: res[3].length !== 0,
            row: res[4]
        }
    },

    /**
     * Apply + or - unary prefix.
     * @param {Array.<string>} prefixes
     * @param {*} value
     * @return {*}
     */
    applyPrefix: (prefixes, value) => {
        // console.log('applyPrefix', prefixes, value);
        prefixes.forEach(prefix => {
            if (prefix === '+') {

            } else if (prefix === '-') {
                value = -value;
            } else {
                throw new Error(`Unrecognized prefix: ${prefix}`);
            }
        });
        return value;
        // TO-DO if value is 1D or 2D array
    },

    applyPostfix: (value, postfix) => {
        if (value.value !== undefined) value = value.value;
        // console.log('applyPostfix', value, postfix);
        // TO-DO if value is 1D or 2D array
        if (postfix === '%') {
            return value / 100;
        }
        throw new Error(`Unrecognized postfix: ${postfix}`);
    },

    applyInfix: (value1, infix, value2) => {
        if (value1.value !== undefined) value1 = value1.value;
        if (value2.value !== undefined) value2 = value2.value;
        // console.log('applyInfix', value1, infix, value2)
        // TO-DO if value is 1D or 2D array
        switch (infix) {
            case '^':
                return value1 ** value2;
            case '*':
                return value1 * value2;
            case '/':
                return value1 / value2;
            case '+':
                return value1 + value2;
            case '-':
                return value1 - value2;
            case '&':
                return '' + value1 + value2;
            case '>':
                return value1 > value2;
            case '<':
                return value1 < value2;
            case '=':
                return value1 === value2;
            case '<>':
                return value1 !== value2;
            case '<=':
                return value1 <= value2;
            case '>=':
                return value1 >= value2;
            default:
                throw new Error(`Unrecognized infix: ${infix}`);
        }
    },

    applyIntersect: (...params) => {
        // console.log('applyIntersect', params)
        return [];
    },

    applyUnion: (...params) => {
        // console.log('applyUnion', params)
        return [];
    },

    toArray: (array) => {
        // TODO: check if array is valid
        // console.log('toArray', array);
        return array;
    },

    /**
     * @param {string} number
     * @return {number}
     */
    toNumber: (number) => {
        return Number(number);
    },

    /**
     * @param {string} string
     * @return {string}
     */
    toString: (string) => {
        return string.substring(1, string.length - 1);
    },

    /**
     * @param {string} bool
     * @return {boolean}
     */
    toBoolean: (bool) => {
        return bool === 'TRUE';
    },

    /**
     * @param {string} error
     * @return {string}
     */
    toError: (error) => {
        return error;
    }
};

module.exports = utils;

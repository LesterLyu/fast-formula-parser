const FormulaError = require('../formulas/error');
const {FormulaHelpers, Types} = require('../formulas/helpers');
const {Prefix, Postfix, Infix, Operators} = require('../formulas/operators');

class Utils {

    constructor(context) {
        this.context = context;
    }

    columnNameToNumber(columnName) {
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
    }

    /**
     * Parse the cell address only.
     * @param {string} cellAddress
     * @return {{ref: {col: (*|number), address: string, isColAbsolute: boolean, isRowAbsolute: boolean, row: number}, value: null}}
     */
    parseCellAddress(cellAddress) {
        const res = cellAddress.match(/([$]?)([A-Za-z]{1,3})([$]?)([1-9][0-9]*)/);
        // console.log('parseCellAddress', cellAddress);
        return {
            ref: {
                address: res[0],
                isRowAbsolute: res[1].length !== 0,
                col: this.columnNameToNumber(res[2]),
                isColAbsolute: res[3].length !== 0,
                row: +res[4]
            },
            value: undefined // `undefined` means the value is not yet retrieved.
        };
    }

    parseColRange(colRange) {
        const res = colRange.match(/([$]?)([A-Za-z]{1,3}):([$]?)([A-Za-z]{1,4})/);
        return {
            ref: {
                address: res[0],
                from: {
                    address: res[2],
                    col: this.columnNameToNumber(res[2]),
                    isColAbsolute: res[1].length !== 0,
                    isRowAbsolute: null,
                    row: null
                },
                to: {
                    address: res[4],
                    col: this.columnNameToNumber(res[4]),
                    isColAbsolute: res[3].length !== 0,
                    isRowAbsolute: null,
                    row: null
                }
            }
        }
    }

    parseRowRange(rowRange) {
        const res = rowRange.match(/([$]?)([1-9][0-9]*):([$]?)([1-9][0-9]*)/);
        return {
            ref: {
                address: res[0],
                from: {
                    address: res[2],
                    col: null,
                    isColAbsolute: null,
                    isRowAbsolute: res[1].length !== 0,
                    row: +res[2],
                },
                to: {
                    address: res[4],
                    col: null,
                    isColAbsolute: null,
                    isRowAbsolute: res[3].length !== 0,
                    row: +res[4]
                }
            }

        }
    }

    /**
     * Apply + or - unary prefix.
     * @param {Array.<string>} prefixes
     * @param {*} value
     * @return {*}
     */
    applyPrefix(prefixes, value) {
        // console.log('applyPrefix', prefixes, value);
        const {val, isArray} = this.extractRefValue(value);
        return Prefix.unaryOp(prefixes, val, isArray);
    }

    applyPostfix(value, postfix) {
        // console.log('applyPostfix', value, postfix);
        const {val, isArray} = this.extractRefValue(value);
        return Postfix.percentOp(val, postfix, isArray);
    }

    applyInfix(value1, infix, value2) {
        const res1 = this.extractRefValue(value1);
        const val1 = res1.val, isArray1 = res1.isArray;
        const res2 = this.extractRefValue(value2);
        const val2 = res1.val, isArray2 = res2.isArray;
        if (Operators.compareOp.includes(infix))
            return Infix.compareOp(val1, infix, val2, isArray1, isArray2);
        else if (Operators.concatOp.includes(infix))
            return Infix.concatOp(val1, infix, val2, isArray1, isArray2);
        else if (Operators.mathOp.includes(infix))
            return Infix.mathOp(val1, infix, val2, isArray1, isArray2);
        else
            throw new Error(`Unrecognized infix: ${infix}`);

    }

    applyIntersect(...params) {
        // console.log('applyIntersect', params)
        return [];
    }

    applyUnion(...params) {
        // console.log('applyUnion', params)
        return [];
    }

    /**
     * Apply multiple references, e.g. A1:B3:C8:.....
     * @param refs
     * @return {{ref: {sheet: string, from: {col: number, row: number}, to: {col: number, row: number}}}}
     */
    applyRange(refs) {
        let maxRow = -1, maxCol = -1, minRow = 1048577, minCol = 1048577;
        refs.forEach(ref => {
            ref = ref.ref;
            if (ref.row > maxRow)
                maxRow = ref.row;
            if (ref.row < minRow)
                minRow = ref.row;
            if (ref.col > maxCol)
                maxCol = ref.col;
            if (ref.col < minCol)
                minCol = ref.col;
        });
        return {
            ref: {
                from: {row: minRow, col: minCol},
                to: {row: maxRow, col: maxCol}
            }
        };
    }

    /**
     * Throw away the refs, and retrieve the value.
     */
    extractRefValue(obj) {
        let res = obj, isArray = false;
        if (Array.isArray(res))
            isArray = true;
        if (obj.ref) {
            // can be number or array
            return {val: this.context.retrieveRef(obj), isArray};

        }
        return {val: res, isArray};
    }

    /**
     *
     * @param array
     * @return {Array}
     */
    toArray(array) {
        // TODO: check if array is valid
        // console.log('toArray', array);
        return array;
    }

    /**
     * @param {string} number
     * @return {number}
     */
    toNumber(number) {
        return Number(number);
    }

    /**
     * @param {string} string
     * @return {string}
     */
    toString(string) {
        return string.substring(1, string.length - 1);
    }

    /**
     * @param {string} bool
     * @return {boolean}
     */
    toBoolean(bool) {
        return bool === 'TRUE';
    }

    /**
     * Throw an error.
     * @param {string} error
     * @return {string}
     */
    toError(error) {
        throw new FormulaError(error.toUpperCase());
    }
}

module.exports = Utils;

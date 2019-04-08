const FormulaError = require('../error');
const {FormulaHelpers, Types, WildCard, Address} = require('../helpers');
const H = FormulaHelpers;

const ReferenceFunctions = {

    ADDRESS: (rowNumber, columnNumber, absNum, a1, sheetText) => {
        rowNumber = H.accept(rowNumber, Types.NUMBER);
        columnNumber = H.accept(columnNumber, Types.NUMBER);
        absNum = H.accept(absNum, Types.NUMBER, 1);
        a1 = H.accept(a1, Types.BOOLEAN, true);
        sheetText = H.accept(sheetText, Types.STRING, '');

        if (rowNumber < 1 || columnNumber < 1 || absNum < 1 || absNum > 4)
            throw FormulaError.VALUE;

        let result = '';
        if (sheetText.length > 0) {
            if (/[^A-Za-z_.\d\u007F-\uFFFF]/.test(sheetText)) {
                result += `'${sheetText}'!`;
            } else {
                result += sheetText + '!';
            }
        }
        if (a1) {
            // A1 style
            result += (absNum === 1 || absNum === 3) ? '$' : '';
            result += Address.columnNumberToName(columnNumber);
            result += (absNum === 1 || absNum === 2) ? '$' : '';
            result += rowNumber;
        } else {
            // R1C1 style
            result += 'R';
            result += (absNum === 4 || absNum === 3) ? `[${rowNumber}]` : rowNumber;
            result += 'C';
            result += (absNum === 4 || absNum === 2) ? `[${columnNumber}]` : columnNumber;
        }
        return result;
    },

    AREAS: refs => {
        refs = H.accept(refs);
        if (refs.collections) {
            return refs.collections.length;
        }
        return 1;
    },

    CHOOSE: (indexNum, ...values) => {

    },

    // Special
    COLUMN: (context, obj) => {
        if (obj == null) {
            if (context.position.col != null)
                return context.position.col;
            else
                throw Error('FormulaParser.parse is called without position parameter.')
        } else {
            if (typeof obj !== 'object' || Array.isArray(obj))
                throw FormulaError.VALUE;
            if (H.isCellRef(obj)) {
                return obj.ref.col;
            } else if (H.isRangeRef(obj)) {
                return obj.ref.from.col;
            } else {
                throw Error('ReferenceFunctions.COLUMN should not reach here.')
            }
        }
    },

    // Special
    COLUMNS: (context, obj) => {
        if (obj == null) {
            throw Error('COLUMNS requires one argument');
        }
        if (typeof obj != 'object' || Array.isArray(obj))
            throw FormulaError.VALUE;
        if (H.isCellRef(obj)) {
            return 1;
        } else if (H.isRangeRef(obj)) {
            return Math.abs(obj.ref.from.col - obj.ref.to.col) + 1;
        } else {
            throw Error('ReferenceFunctions.COLUMNS should not reach here.')
        }
    },

    HLOOKUP: (lookupValue, tableArray, rowIndexNum, rangeLookup) => {
        // preserve type of lookupValue
        lookupValue = H.accept(lookupValue);
        try {
            tableArray = H.accept(tableArray, Types.ARRAY, null, false);
        } catch (e) {
            // catch #VALUE! and throw #N/A
            if (e instanceof FormulaError)
                throw FormulaError.NA;
            throw e;
        }
        rowIndexNum = H.accept(rowIndexNum, Types.NUMBER);
        rangeLookup = H.accept(rangeLookup, Types.BOOLEAN, true);

        // check if rowIndexNum out of bound
        if (rowIndexNum < 1)
            throw FormulaError.VALUE;
        if (tableArray[rowIndexNum - 1] === undefined)
            throw FormulaError.REF;

        const lookupType = typeof lookupValue; // 'number', 'string', 'boolean'

        // approximate lookup (assume the array is sorted)
        if (rangeLookup) {
            let prevValue = lookupType === typeof tableArray[0][0] ? tableArray[0][0] : null;
            for (let i = 1; i < tableArray[0].length; i++) {
                const currValue = tableArray[0][i];
                const type = typeof currValue;
                // skip the value if type does not match
                if (type !== lookupType)
                    continue;
                // if the previous two values are greater than lookup value, throw #N/A
                if (prevValue > lookupValue && currValue > lookupValue) {
                    throw FormulaError.NA;
                }
                if (currValue === lookupValue)
                    return tableArray[rowIndexNum - 1][i];
                // if previous value <= lookup value and current value > lookup value
                if (prevValue != null && currValue > lookupValue && prevValue <= lookupValue) {
                    return tableArray[rowIndexNum - 1][i - 1];
                }
                prevValue = currValue;
            }
            if (prevValue == null)
                throw FormulaError.NA;
            return prevValue;
        }
        // exact lookup with wildcard support
        else {
            let index = -1;
            if (WildCard.isWildCard(lookupValue)) {
                index = tableArray[0].findIndex(item => {
                    return WildCard.toRegex(lookupValue, 'i').test(item);
                });
            } else {
                index = tableArray[0].findIndex(item => {
                    return item === lookupValue;
                });
            }
            // the exact match is not found
            if (index === -1) throw FormulaError.NA;
            return tableArray[rowIndexNum - 1][index];
        }
    },

    // Special
    ROW: (context, obj) => {
        if (obj == null) {
            if (context.position.row != null)
                return context.position.row;
            else
                throw Error('FormulaParser.parse is called without position parameter.')
        } else {
            if (typeof obj !== 'object' || Array.isArray(obj))
                throw FormulaError.VALUE;
            if (H.isCellRef(obj)) {
                return obj.ref.row;
            } else if (H.isRangeRef(obj)) {
                return obj.ref.from.row;
            } else {
                throw Error('ReferenceFunctions.ROW should not reach here.')
            }
        }
    },

    // Special
    ROWS: (context, obj) => {
        if (obj == null) {
            throw Error('ROWS requires one argument');
        }
        if (typeof obj != 'object' || Array.isArray(obj))
            throw FormulaError.VALUE;
        if (H.isCellRef(obj)) {
            return 1;
        } else if (H.isRangeRef(obj)) {
            return Math.abs(obj.ref.from.row - obj.ref.to.row) + 1;
        } else {
            throw Error('ReferenceFunctions.ROWS should not reach here.')
        }
    },

    TRANSPOSE: (array) => {
        array = H.accept(array, Types.ARRAY, null, false);
        // https://github.com/numbers/numbers.js/blob/master/lib/numbers/matrix.js#L171
        const result = [];

        for (let i = 0; i < array[0].length; i++) {
            result[i] = [];

            for (let j = 0; j < array.length; j++) {
                result[i][j] = array[j][i];
            }
        }

        return result;
    },

    VLOOKUP: (lookupValue, tableArray, colIndexNum, rangeLookup) => {
        // preserve type of lookupValue
        lookupValue = H.accept(lookupValue);
        try {
            tableArray = H.accept(tableArray, Types.ARRAY, null, false);
        } catch (e) {
            // catch #VALUE! and throw #N/A
            if (e instanceof FormulaError)
                throw FormulaError.NA;
            throw e;
        }
        colIndexNum = H.accept(colIndexNum, Types.NUMBER);
        rangeLookup = H.accept(rangeLookup, Types.BOOLEAN, true);

        // check if colIndexNum out of bound
        if (colIndexNum < 1)
            throw FormulaError.VALUE;
        if (tableArray[0][colIndexNum - 1] === undefined)
            throw FormulaError.REF;

        const lookupType = typeof lookupValue; // 'number', 'string', 'boolean'

        // approximate lookup (assume the array is sorted)
        if (rangeLookup) {
            let prevValue = lookupType === typeof tableArray[0][0] ? tableArray[0][0] : null;
            for (let i = 1; i < tableArray.length; i++) {
                const currRow = tableArray[i];
                const currValue = tableArray[i][0];
                const type = typeof currValue;
                // skip the value if type does not match
                if (type !== lookupType)
                    continue;
                // if the previous two values are greater than lookup value, throw #N/A
                if (prevValue > lookupValue && currValue > lookupValue) {
                    throw FormulaError.NA;
                }
                if (currValue === lookupValue)
                    return currRow[colIndexNum - 1];
                // if previous value <= lookup value and current value > lookup value
                if (prevValue != null && currValue > lookupValue && prevValue <= lookupValue) {
                    return tableArray[i - 1][colIndexNum - 1];
                }
                prevValue = currValue;
            }
            if (prevValue == null)
                throw FormulaError.NA;
            return prevValue;
        }
        // exact lookup with wildcard support
        else {
            let index = -1;
            if (WildCard.isWildCard(lookupValue)) {
                index = tableArray.findIndex(currRow => {
                    return WildCard.toRegex(lookupValue, 'i').test(currRow[0]);
                });
            } else {
                index = tableArray.findIndex(currRow => {
                    return currRow[0] === lookupValue;
                });
            }
            // the exact match is not found
            if (index === -1) throw FormulaError.NA;
            return tableArray[index][colIndexNum - 1];
        }
    },
};

module.exports = ReferenceFunctions;

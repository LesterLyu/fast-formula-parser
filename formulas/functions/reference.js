const FormulaError = require('../error');
const {FormulaHelpers, Types, WildCard} = require('../helpers');
const {Infix} = require('../operators');
const H = FormulaHelpers;

const ReferenceFunctions = {
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
        // exact lookup
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

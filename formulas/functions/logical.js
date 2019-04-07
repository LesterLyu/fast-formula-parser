const FormulaError = require('../error');
const {FormulaHelpers, Types, Factorials} = require('../helpers');
const H = FormulaHelpers;

const LogicalFunctions = {
    AND: (...params) => {
        let result = H.accept(params.shift(), Types.BOOLEAN);
        params.forEach(param => {
            result = result && H.accept(param, Types.BOOLEAN);
        });
        return result;
    },

    FALSE: () => {
        return false;
    },

    IF: (logicalTest, valueIfTrue, valueIfFalse) => {
        logicalTest = H.accept(logicalTest, Types.BOOLEAN);
        valueIfTrue = H.accept(valueIfTrue); // do not parse type
        valueIfFalse = H.accept(valueIfFalse, null, false); // do not parse type

        return logicalTest ? valueIfTrue : valueIfFalse;
    },

    IFERROR: (value, valueIfError) => {
        return value.value instanceof FormulaError ? H.accept(valueIfError) : H.accept(value);
    },

    IFNA: (value, valueIfNa) => {
       return value.value === FormulaError.NA ? H.accept(valueIfNa) : H.accept(value);
    },

    IFS: (...params) => {

    },

    NOT: (logical) => {
        logical = H.accept(logical, Types.BOOLEAN);
        return !logical;
    },

    OR: (...params) => {
        let result = H.accept(params.shift(), Types.BOOLEAN);
        params.forEach(param => {
            result = result || H.accept(param, Types.BOOLEAN);
        });
        return result;
    },

    SWITCH: (...params) => {

    },

    TRUE: () => {
        return true;
    },

    XOR: (...params) => {

    },
};

module.exports = LogicalFunctions;

const FormulaError = require('../error');
const {FormulaHelpers, Types} = require('../helpers');
const H = FormulaHelpers;

const error2Number = {
    '#NULL!': 1, '#DIV/0!': 2, '#VALUE!': 3, '#REF!': 4, '#NAME?': 5,
    '#NUM!': 6, '#N/A': 7
};

const InfoFunctions = {

    CELL: (infoType, reference) => {
        // throw FormulaError.NOT_IMPLEMENTED('CELL');
    },

    'ERROR.TYPE': (value) => {
        value = H.accept(value);
        if ( value instanceof FormulaError)
            return error2Number[value.toString()];
        throw FormulaError.NA;
    },

    INFO: () => {
    },

    ISBLANK: (value) => {
        if (!value.ref)
            return false;
        // null and undefined are also blank
        return value.value == null || value.value === '';
    },

    ISERR: (value) => {
        value = H.accept(value);
        return value instanceof FormulaError && value.toString() !== '#N/A';
    },

    ISERROR: (value) => {
        value = H.accept(value);
        return value instanceof FormulaError;
    },

    ISEVEN: number => {
        number = H.accept(number, Types.NUMBER);
        number = Math.trunc(number);
        return number % 2 === 0;
    },

    ISLOGICAL: (value) => {
        value = H.accept(value);
        return typeof value === 'boolean';
    },

    ISNA: (value) => {
        value = H.accept(value);
        return value instanceof FormulaError && value.toString() === '#N/A';
    },

    ISNONTEXT: (value) => {
        value = H.accept(value);
        return typeof value !== 'string';
    },

    ISNUMBER: (value) => {
        value = H.accept(value);
        return typeof value === "number";
    },

    ISREF: (value) => {
        if (!value.ref)
            return false;
        if (H.isCellRef(value) && (value.ref.row > 1048576 || value.ref.col > 16384)) {
            return false;
        }
        if (H.isRangeRef(value) && (value.ref.from.row > 1048576 || value.ref.from.col > 16384
            || value.ref.to.row > 1048576 || value.ref.to.col > 16384)) {
            return false;
        }
        value = H.accept(value);
        return !(value instanceof FormulaError && value.toString() === '#REF!');
    },

    ISTEXT: (value) => {
        value = H.accept(value);
        return typeof value === 'string';
    },

    N: value => {
        value = H.accept(value);
        const type = typeof value;
        if (type === 'number')
            return value;
        else if (type === "boolean")
            return Number(value);
        else if (value instanceof FormulaError)
            throw value;
        return 0;
    },

    NA: () => {
        throw FormulaError.NA;
    },

    TYPE: value => {
        // a reference
        if (value.ref) {
            if (H.isRangeRef(value)) {
                return 16;
            } else if (H.isCellRef(value)) {
                value = H.accept(value);
                // empty cell is number type
                if (typeof value === "string" && value.length === 0)
                    return 1;
            }
        }
        value = H.accept(value);
        const type = typeof value;
        if (type === 'number')
            return 1;
        else if (type === "string")
            return 2;
        else if (type === "boolean")
            return 4;
        else if (value instanceof FormulaError)
            return 16;
        else if (Array.isArray(value))
            return 64;
    },
};


module.exports = InfoFunctions;

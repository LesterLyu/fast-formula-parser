const FormulaError = require('../error');
const {FormulaHelpers, Types} = require('../helpers');
const H = FormulaHelpers;

const InfoFunctions = {

    CELL: () => {

    },

    'ERROR.TYPE': (err) => {
        // if (!value.ref)
        //     return false;
    },

    ISBLANK: (value) => {
        if (!value.ref)
            return false;
        value = H.accept(value);
        return typeof value === 'string' && value.length === 0;
    },

    ISERR: (value) => {
        value = H.accept(value);
        return value instanceof FormulaError && value.toString() !== '#N/A';
    },

    ISERROR: (value) => {
        value = H.accept(value);
        return value instanceof FormulaError;
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
};


module.exports = InfoFunctions;

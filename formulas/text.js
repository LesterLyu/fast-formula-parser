const FormulaError = require('./error');
const {FormulaHelpers, Types} = require('./helpers');
const H = FormulaHelpers;

const TextFunctions = {
    ASC: (...params) => {

    },

    BAHTTEXT: (...params) => {

    },

    CHAR: (number) => {
        number = H.accept(number, [Types.NUMBER]);
        if (number > 255 || number < 1)
            throw FormulaError.VALUE;
        return String.fromCharCode(number);
    },

    CLEAN: (...params) => {

    },

    CODE: (...params) => {

    },

    CONCAT: (...params) => {

    },

    CONCATENATE: (...params) => {
        let texts = H.accept(params.shift(), [Types.STRING]);
        params.forEach(param => {
            const text = H.accept(params.shift(), [Types.STRING], true);
            if (text)
                texts += text;
        });
        return texts
    },

    DBCS: (...params) => {

    },

    DOLLAR: (...params) => {

    },

    EXACT: (...params) => {

    },

    FIND: (...params) => {

    },

    FINDB: (...params) => {

    },

    FIXED: (...params) => {

    },

    LEFT: (...params) => {

    },

    LEFTB: (...params) => {

    },

    LEN: (...params) => {

    },

    LENB: (...params) => {

    },

    LOWER: (...params) => {

    },

    MID: (...params) => {

    },

    MIDB: (...params) => {

    },

    NUMBERVALUE: (...params) => {

    },

    PHONETIC: (...params) => {

    },

    PROPER: (...params) => {

    },

    REPLACE: (...params) => {

    },

    REPLACEB: (...params) => {

    },

    REPT: (...params) => {

    },

    RIGHT: (...params) => {

    },

    RIGHTB: (...params) => {

    },

    SEARCH: (...params) => {

    },

    SEARCHB: (...params) => {

    },

    SUBSTITUTE: (...params) => {

    },

    T: (...params) => {

    },

    TEXT: (...params) => {

    },

    TEXTJOIN: (...params) => {

    },

    TRIM: (...params) => {

    },

    TEXTJOIN: (...params) => {

    },

    UNICHAR: (...params) => {

    },

    UNICODE: (...params) => {

    },
};

module.exports = TextFunctions;

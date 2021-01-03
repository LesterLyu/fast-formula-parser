const {default: FormulaError} = require('../../../formulas/error');
module.exports = {
    'ERROR.TYPE': {
        'ERROR.TYPE(#NULL!)': 1,
        'ERROR.TYPE(#DIV/0!)': 2,
        'ERROR.TYPE(#N/A)': 7,
        'ERROR.TYPE(#VALUE!)': 3,
        'ERROR.TYPE(#REF!)': 4,
        'ERROR.TYPE(#NUM!)': 6,
        'ERROR.TYPE(#NAME?)': 5,
    },

    ISBLANK: {
        'ISBLANK(A1)': true,
        'ISBLANK(A2)': false,
        'ISBLANK("")': false,
        'ISBLANK(A3)': true,
        'ISBLANK(B3)': true,
        'ISBLANK({1})': false,
    },

    ISERR: {
        'ISERR(1/0)': true,
        'ISERR(#DIV/0!)': true,
        'ISERR(#N/A)': false,
    },

    ISERROR: {
        'ISERROR(1/0)': true,
        'ISERROR(#DIV/0!)': true,
        'ISERROR(#N/A)': true,
        'ISERROR(#VALUE!)': true,
        'ISERROR(#REF!)': true,
        'ISERROR(#NUM!)': true,
        'ISERROR(#NAME?)': true,
    },

    ISEVEN: {
        'ISEVEN(2)': true,
        'ISEVEN(-2)': true,
        'ISEVEN(2.5)': true,
        'ISEVEN(3)': false,
    },

    ISLOGICAL: {
        'ISLOGICAL(TRUE)': true,
        'ISLOGICAL(FALSE)': true,
        'ISLOGICAL("TRUE")': false
    },

    ISNA: {
        'ISNA(#N/A)': true,
        'ISNA(#NAME?)': false,
    },

    ISNONTEXT: {
        'ISNONTEXT(123)': true,

    },

    ISNUMBER: {
        'ISNUMBER(123)': true,
        'ISNUMBER(A1)': false,
        'ISNUMBER(B1)': true,
    },

    ISREF: {
        'ISREF(B2)': true,
        'ISREF(123)': false,
        'ISREF("A1")': false,
        'ISREF(#REF!)': false,
        'ISREF(XYZ1)': false,
        'ISREF(A1:XYZ1)': false,
        'ISREF(XYZ1:A1)': false
    },

    ISTEXT: {
        'ISTEXT(123)': false,
        'ISTEXT("123")': true,
    },

    N: {
        'N(1)': 1,
        'N(TRUE)': 1,
        'N(FALSE)': 0,
        'N(1/0)': FormulaError.DIV0,
        'N("123")': 0,
    },

    NA: {
        'NA()': FormulaError.NA,
    },

    TYPE: {
        // empty cell
        'TYPE(A1)': 1,
        'TYPE(12)': 1,
        'TYPE("12")': 2,
        'TYPE("")': 2,
        'TYPE(TRUE)': 4,
        'TYPE(1/0)': 16,
        'TYPE({1;2;3})': 64,
    }
};

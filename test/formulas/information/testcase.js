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
        'ISBLANK(A1)': 'TRUE',
        'ISBLANK(A2)': 'FALSE',
        'ISBLANK("")': 'FALSE',
    },

    ISERR: {
        'ISERR(1/0)': 'TRUE',
        'ISERR(#DIV/0!)': 'TRUE',
        'ISERR(#N/A)': 'FALSE',
    },

    ISERROR: {
        'ISERROR(1/0)': 'TRUE',
        'ISERROR(#DIV/0!)': 'TRUE',
        'ISERROR(#N/A)': 'TRUE',
        'ISERROR(#VALUE!)': 'TRUE',
        'ISERROR(#REF!)': 'TRUE',
        'ISERROR(#NUM!)': 'TRUE',
        'ISERROR(#NAME?)': 'TRUE',
    },

    ISEVEN: {
        'ISEVEN(2)': 'TRUE',
        'ISEVEN(-2)': 'TRUE',
        'ISEVEN(2.5)': 'TRUE',
        'ISEVEN(3)': 'FALSE',
    },

    ISLOGICAL: {
        'ISLOGICAL(TRUE)': 'TRUE',
        'ISLOGICAL(FALSE)': 'TRUE',
        'ISLOGICAL("TRUE")': 'FALSE'
    },

    ISNA: {
        'ISNA(#N/A)': 'TRUE',
        'ISNA(#NAME?)': 'FALSE',
    },

    ISNONTEXT: {
        'ISNONTEXT(123)': 'TRUE',

    },

    ISNUMBER: {
        'ISNUMBER(123)': 'TRUE',
        'ISNUMBER(A1)': 'FALSE',
        'ISNUMBER(B1)': 'TRUE',
    },

    ISREF: {
        'ISREF(B2)': 'TRUE',
        'ISREF(123)': 'FALSE',
        'ISREF("A1")': 'FALSE',
        'ISREF(#REF!)': 'FALSE',
        'ISREF(XYZ1)': 'FALSE',
        'ISREF(A1:XYZ1)': 'FALSE',
        'ISREF(XYZ1:A1)': 'FALSE'
    },

    ISTEXT: {
        'ISTEXT(123)': 'FALSE',
        'ISTEXT("123")': 'TRUE',
    },

    N: {
        'N(1)': 1,
        'N(TRUE)': 1,
        'N(FALSE)': 0,
        'N(1/0)': '#DIV/0!',
        'N("123")': 0,
    },

    NA: {
        'NA()': '#N/A',
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

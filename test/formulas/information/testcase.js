module.exports = {
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
};

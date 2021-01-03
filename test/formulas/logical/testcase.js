const {default: FormulaError} = require('../../../formulas/error');
module.exports = {
    AND: {
        'AND(A1)': FormulaError.VALUE,
        'AND(1,1,1)': true,
        'AND(1,0,0)': false,
        'AND(A2:C2)': true,
        'AND("Test", "TRUE")': true,
        'AND("Test", "FALSE")': false,
        'AND({0,1,0}, FALSE)': false,
        'AND((A2:C2, A3))': true,
        'AND((A2:C2 C2))': true,
    },

    IF: {
        'IF(TRUE, A1, A2)': 'fruit',
        'IF(TRUE, A1&1, A2)': 'fruit1',
        'IF(A1 = "fruit", A1, A2)': 'fruit',
        'IF(IF(D1 < D5, A2) = "count", A1, A2)': 'Apples',
    },

    IFS: {
        'IFS(1=3,"Not me", 1=2, "Me neither", 1=1, "Yes me")': 'Yes me',
        'IFS(D5<60,"F",D5<70,"D",D5<80,"C",D5<90,"B",D5>=90,"A")': 'F',
        'IFS(1=3,"Not me", 1=2, "Me neither", 1=4, "Not me")': FormulaError.NA,
        'IFS("HELLO","Not me", 1=2, "Me neither", 1=4, "Not me")': FormulaError.VALUE,
        'IFS("HELLO")': FormulaError.NA,
    },

    IFNA: {
        'IFNA(#N/A, 1, 2)': FormulaError.NA,
        'IFNA(#N/A, 1)': 1,
        'IFNA("Good", 1)': 'Good'
    },

    OR: {
        'OR(A1)': FormulaError.VALUE,
        'OR(1,1,0)': true,
        'OR(0,0,0)': false,
        'OR(A2:C2)': true,
        'OR("Test", "TRUE")': true,
        'OR("Test", "FALSE")': false,
        'OR({0,1,0}, FALSE)': true,
        'OR((A2:C2, A3))': true,
        'OR((A2:C2 C2))': true,
    },

    XOR: {
        'XOR(A1)': FormulaError.VALUE,
        'XOR(1,1,0)': false,
        'XOR(1,1,1)': true,
        'XOR(A2:C2)': false,
        'XOR(A2:C2, "TRUE")': true,
        'XOR("Test", "TRUE")': true,
        'XOR({1,1,1}, FALSE)': true,
        'XOR((A2:C2, A3))': false,
        'XOR((A2:C2 C2))': true,
    }
};

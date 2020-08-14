const FormulaError = require('../../../formulas/error');
module.exports = {
    IF: {
        'IF(TRUE, A1, A2)': 'fruit',
        'IF(TRUE, A1&1, A2)': 'fruit1',
        'IF(A1 = "fruit", A1, A2)': 'fruit',
        'IF(IF(D1 < D5, A2) = "count", A1, A2)': 'Apples',
    },
    IFNA: {
        'IFNA(#N/A, 1, 2)': FormulaError.NA,
        'IFNA(#N/A, 1)': 1,
        'IFNA("Good", 1)': 'Good'
    },
};

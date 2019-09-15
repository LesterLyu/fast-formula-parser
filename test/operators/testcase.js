const FormulaError = require('../../formulas/error');
module.exports = {
    'unaryOp': {
        '+1': 1,
        '-1': -1,
        '--1': 1,
        '---1': -1,
        '+"A"': 'A',
        '+++"A"': 'A',
        '+++{"A"}': 'A',
        '++-+"A"': FormulaError.VALUE,
        '-"A"': FormulaError.VALUE,
        '+++{1,2,3}': 1,
        '+A1': 1,
        '+A6': 'string',
    },

    'reference': {
        'A1': 1,
        'A1+2': 3,
    },

    'binaryOp': {
        '1>2': false,
        '1<2': true,
        '1=1': true,
        '1=2': false,
        '1<>1': false,
        '1<>2': true,
        '1>=2': false,
        '1<=2': true,
        '"a" & "b"': 'ab',
        '1&2': '12',
    },
    'Operator Precedence': {
        // '1+2*2': 5,
        '1+4/2+1': 4,
        '1+4/2+2*3': 9,
        '(1+4/2+2*3)/3^2': 1,
        '1-234/78+9/-78+45%': -1.6653846153846200
    }
};

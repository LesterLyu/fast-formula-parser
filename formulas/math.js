const FormulaError = require('./error');

const MathFunctions = {
    ABS: (number) => {
        if (Array.isArray(number))
            number = number[0][0];
        const res = Math.abs(number);
        if (isNaN(res)) {
            throw FormulaError.VALUE;
        }
        return res;
    },



};

module.exports = MathFunctions;

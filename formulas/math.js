const FormulaError = require('./error');
const {FormulaHelpers, Types} = require('./helpers');
const H = FormulaHelpers;

const MathFunctions = {
    ABS: (number) => {
        number = H.accept(number, [Types.NUMBER]);
        const res = Math.abs(number);
        return H.checkResult(res);
    },

    ACOS: number => {
        number = H.accept(number, [Types.NUMBER]);
        const res = Math.abs(number);
        return H.checkResult(res);
    },



};



module.exports = MathFunctions;

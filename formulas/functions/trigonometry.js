const FormulaError = require('../error');
const {FormulaHelpers, Types} = require('../helpers');
const H = FormulaHelpers;
const MAX_NUMBER = 2 ** 27 - 1;

// https://support.office.com/en-us/article/excel-functions-by-category-5f91f4e9-7b42-46d2-9bd1-63f26a86c0eb
const TrigFunctions = {
    ACOS: number => {
        number = H.accept(number, Types.NUMBER);
        if (number > 1 || number < -1)
            throw FormulaError.NUM;
        return Math.acos(number);
    },

    ACOSH: number => {
        number = H.accept(number, Types.NUMBER);
        if (number < 1)
            throw FormulaError.NUM;
        return Math.acosh(number);
    },

    ACOT: number => {
        number = H.accept(number, Types.NUMBER);
        return Math.PI / 2 - Math.atan(number);
    },

    ACOTH: number => {
        number = H.accept(number, Types.NUMBER);
        if (Math.abs(number) <= 1)
            throw FormulaError.NUM;
        return Math.atanh(1 / number);
    },

    ASIN: number => {
        number = H.accept(number, Types.NUMBER);
        if (number > 1 || number < -1)
            throw FormulaError.NUM;
        return Math.asin(number);
    },

    ASINH: number => {
        number = H.accept(number, Types.NUMBER);
        return Math.asinh(number);
    },

    ATAN: number => {
        number = H.accept(number, Types.NUMBER);
        return Math.atan(number);
    },

    ATAN2: (x, y) => {
        x = H.accept(x, Types.NUMBER);
        y = H.accept(y, Types.NUMBER);
        if (y === 0 && x === 0)
            throw FormulaError.DIV0;
        return Math.atan2(y, x);
    },

    ATANH: number => {
        number = H.accept(number, Types.NUMBER);
        if (Math.abs(number) > 1)
            throw FormulaError.NUM;
        return Math.atanh(number);
    },

    COS: number => {
        number = H.accept(number, Types.NUMBER);
        if (Math.abs(number) > MAX_NUMBER)
            throw FormulaError.NUM;
        return Math.cos(number);
    },

    COSH: number => {
        number = H.accept(number, Types.NUMBER);
        return Math.cosh(number);
    },

    COT: number => {
        number = H.accept(number, Types.NUMBER);
        if (Math.abs(number) > MAX_NUMBER)
            throw FormulaError.NUM;
        if (number === 0)
            throw FormulaError.DIV0;
        return 1 / Math.tan(number);
    },

    COTH: number => {
        number = H.accept(number, Types.NUMBER);
        if (number === 0)
            throw FormulaError.DIV0;
        return 1 / Math.tanh(number);
    },

    CSC: number => {
        number = H.accept(number, Types.NUMBER);
        if (Math.abs(number) > MAX_NUMBER)
            throw FormulaError.NUM;
        return 1 / Math.sin(number);
    },

    CSCH: number => {
        number = H.accept(number, Types.NUMBER);
        if (number === 0)
            throw FormulaError.DIV0;
        return 1 / Math.sinh(number);
    },

    SEC: number => {
        number = H.accept(number, Types.NUMBER);
        if (Math.abs(number) > MAX_NUMBER)
            throw FormulaError.NUM;
        return 1 / Math.cos(number);
    },

    SECH: number => {
        number = H.accept(number, Types.NUMBER);
        return 1 / Math.cosh(number);
    },

    SIN: number => {
        number = H.accept(number, Types.NUMBER);
        if (Math.abs(number) > MAX_NUMBER)
            throw FormulaError.NUM;
        return Math.sin(number);
    },

    SINH: number => {
        number = H.accept(number, Types.NUMBER);
        return Math.sinh(number);
    },

    TAN: number => {
        number = H.accept(number, Types.NUMBER);
        if (Math.abs(number) > MAX_NUMBER)
            throw FormulaError.NUM;
        return Math.tan(number);
    },

    TANH: number => {
        number = H.accept(number, Types.NUMBER);
        return Math.tanh(number);
    },
};

module.exports = TrigFunctions;

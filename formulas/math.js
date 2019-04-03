const FormulaError = require('./error');
const {FormulaHelpers, Types} = require('./helpers');
const H = FormulaHelpers;

// https://support.office.com/en-us/article/excel-functions-by-category-5f91f4e9-7b42-46d2-9bd1-63f26a86c0eb
const MathFunctions = {
    ABS: number => {
        number = H.accept(number, [Types.NUMBER]);
        return Math.abs(number);
    },

    AGGREGATE: (functionNum, options, ref1, ...refs) => {
        functionNum = H.accept(functionNum, [Types.NUMBER]);
        throw FormulaError.NOT_IMPLEMENTED('AGGREGATE');
    },

    ARABIC: text => {
        text = H.accept(text, [Types.STRING]).toUpperCase();
        // Credits: Rafa? Kukawski
        if (!/^M*(?:D?C{0,3}|C[MD])(?:L?X{0,3}|X[CL])(?:V?I{0,3}|I[XV])$/.test(text)) {
            throw FormulaError.VALUE;
        }
        let r = 0;
        text.replace(/[MDLV]|C[MD]?|X[CL]?|I[XV]?/g, function (i) {
            r += {
                M: 1000,
                CM: 900,
                D: 500,
                CD: 400,
                C: 100,
                XC: 90,
                L: 50,
                XL: 40,
                X: 10,
                IX: 9,
                V: 5,
                IV: 4,
                I: 1
            }[i];
        });
        return r;
    },

    BASE: (number, radix, minLength = 0) => {
        number = H.accept(number, [Types.NUMBER]);
        if (number < 0 || number > 2 ** 53)
            throw FormulaError.NUM;
        radix = H.accept(radix, [Types.NUMBER]);
        if (radix < 2 || radix > 36)
            throw FormulaError.NUM;
        minLength = H.accept(minLength, [Types.NUMBER]);
        if (!minLength && minLength < 0) {
            throw FormulaError.NUM;
        }

        const result = number.toString(radix);
        return new Array(Math.max(minLength + 1 - result.length, 0)).join('0') + result;
    },

    'CEILING.MATH': (number, significance, mode = 0) => {
        number = H.accept(number, [Types.NUMBER]);
        if (number >= 9.99E+307 || number <= -2.229E-308)
            throw FormulaError.NUM;
        significance = H.accept(significance, [Types.NUMBER], true);
        if (significance === undefined)
            significance = number > 0 ? 1 : -1;
        mode = H.accept(mode, [Types.NUMBER]);


    },

    ROUND: (number, digits) => {
        number = H.accept(number, [Types.NUMBER]);
        digits = H.accept(digits, [Types.NUMBER]);

        const multiplier = Math.pow(10, Math.abs(digits));
        const sign = number > 0 ? 1 : -1;
        if (digits > 0) {
            return sign * Math.round(Math.abs(number) * multiplier) / multiplier;
        } else if (digits === 0) {
            return sign * Math.round(Math.abs(number));
        } else {
            return sign * Math.round(Math.abs(number) / multiplier) * multiplier;
        }
    },

    ROUNDDOWN: (number, digits) => {
        number = H.accept(number, [Types.NUMBER]);
        digits = H.accept(digits, [Types.NUMBER]);

        const multiplier = Math.pow(10, Math.abs(digits));
        const sign = number > 0 ? 1 : -1;
        if (digits > 0) {
            const offset = 1 / multiplier * 0.5;
            return sign * Math.round((Math.abs(number) - offset) * multiplier) / multiplier;
        } else if (digits === 0) {
            const offset = 0.5;
            return sign * Math.round((Math.abs(number) - offset));
        } else {
            const offset = multiplier * 0.5;
            return sign * Math.round((Math.abs(number) - offset) / multiplier) * multiplier;
        }
    },

    ROUNDUP: (number, digits) => {
        number = H.accept(number, [Types.NUMBER]);
        digits = H.accept(digits, [Types.NUMBER]);

        const multiplier = Math.pow(10, Math.abs(digits));
        const sign = number > 0 ? 1 : -1;
        if (digits > 0) {
            const offset = 1 / multiplier * 0.5;
            return sign * Math.round((Math.abs(number) + offset) * multiplier) / multiplier;
        } else if (digits === 0) {
            const offset = 0.5;
            return sign * Math.round((Math.abs(number) + offset));
        } else {
            const offset = multiplier * 0.5;
            return sign * Math.round((Math.abs(number) + offset) / multiplier) * multiplier;
        }
    },


};


module.exports = MathFunctions;

const FormulaError = require('../error');
const {FormulaHelpers, Types} = require('../helpers');
const H = FormulaHelpers;
const bessel = require("bessel");

const EngineeringFunctions = {
    BESSELI: (x,n) => {
        x = H.accept(x, [Types.NUMBER]);
        n = H.accept(n, [Types.NUMBER]);
        if (n < 0){
            return "#NUM!";
        }

        return Number(bessel.besseli(x,n).toFixed(9));
    },

    BESSELJ: (x,n) => {
        x = H.accept(x, [Types.NUMBER]);
        n = H.accept(n, [Types.NUMBER]);
        if (n < 0){
            return "#NUM!";
        }

        return Number(bessel.besselj(x,n).toFixed(9));
    },

    BESSELK: (x,n) => {
        x = H.accept(x, [Types.NUMBER]);
        n = H.accept(n, [Types.NUMBER]);
        if (n < 0){
            return "#NUM!";
        }

        return Number(bessel.besselk(x,n).toFixed(9));
    },

    BESSELY: (x,n) => {
        x = H.accept(x, [Types.NUMBER]);
        n = H.accept(n, [Types.NUMBER]);
        if (n < 0){
            return "#NUM!";
        }

        return Number(bessel.bessely(x,n).toFixed(9));
    },

    BIN2DEC: (number) => {
        number = H.accept(number, [Types.NUMBER]);
        number = number.toString();
        if (number.length > 10){
            return "#NUM!"
        }

        if (number.length === 10 && number.substring(0, 1) === '1') {
            return parseInt(number.substring(1), 2) - 512;
        } else {
            return parseInt(number,2);
        }
    },

    BIN2HEX: (...params) => {

    },

    BIN2OCT: (...params) => {

    },

    BITAND: (...params) => {

    },

    BITLSHIFT: (...params) => {

    },

    BITOR: (...params) => {

    },

    BITRSHHIFT: (...params) => {

    },

    BITXOR: (...params) => {

    },

    COMPLEX: (...params) => {

    },

    CONVERT: (...params) => {

    },

    DEC2BIN: (...params) => {

    },

    DEC2HEX: (...params) => {

    },

    DEC2OCT: (...params) => {

    },

    DELTA: (...params) => {

    },

    ERF: (...params) => {

    },

    ERFC: (...params) => {

    },

    GESTEP: (...params) => {

    },

    HEX2BIN: (...params) => {

    },

    HEX2DEC: (...params) => {

    },

    HEX2OCT: (...params) => {

    },

    IMABS: (...params) => {

    },

    IMAGINARY: (...params) => {

    },

    IMARGUMENT: (...params) => {

    },

    IMCONJUGATE: (...params) => {

    },

    IMCOS: (...params) => {

    },

    IMCOSH: (...params) => {

    },

    IMCOT: (...params) => {

    },

    IMCSC: (...params) => {

    },

    IMCSCH: (...params) => {

    },

    IMDIV: (...params) => {

    },

    IMEXP: (...params) => {

    },

    IMLN: (...params) => {

    },

    IMLOG10: (...params) => {

    },

    IMLOG2: (...params) => {

    },

    IMPOWER: (...params) => {

    },

    IMPRODUCT: (...params) => {

    },

    IMREAL: (...params) => {

    },

    IMSEC: (...params) => {

    },

    IMSECH: (...params) => {

    },

    IMSIN: (...params) => {

    },

    IMSINH: (...params) => {

    },

    IMSQRT: (...params) => {

    },

    IMSUB: (...params) => {

    },

    IMSUM: (...params) => {

    },

    IMTAN: (...params) => {

    },

    OCT2BIN: (...params) => {

    },

    OCT2DEC: (...params) => {

    },

    OCT2HEX: (...params) => {

    },
};

module.exports = EngineeringFunctions;

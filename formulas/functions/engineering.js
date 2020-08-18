const FormulaError = require('../error');
const TextFunctions = require('./text');
const {FormulaHelpers, Types} = require('../helpers');
const H = FormulaHelpers;
const bessel = require("bessel");
const jStat = require("jstat");
const MAX_OCT = 536870911, // OCT2DEC(3777777777)
    MIN_OCT = -536870912, // OCT2DEC4000000000)
    MAX_HEX = 549755813887,
    MIN_HEX = -549755813888,
    MAX_BIN = 511, // BIN2DEC(111111111)
    MIN_BIN = -512; // BIN2DEC(1000000000)

const numberRegex = /^\s?[+-]?\s?[0-9]+[.]?[0-9]*([eE][+\-][0-9]+)?\s?$/;
const IMWithoutRealRegex = /^\s?([+-]?\s?([0-9]+[.]?[0-9]*([eE][+\-][0-9]+)?)?)\s?[ij]\s?$/;
const IMRegex = /^\s?([+-]?\s?[0-9]+[.]?[0-9]*([eE][+\-][0-9]+)?)\s?([+-]?\s?([0-9]+[.]?[0-9]*([eE][+\-][0-9]+)?)?)\s?[ij]\s?$/;

function parseIM(textOrNumber) {
    textOrNumber = H.accept(textOrNumber);
    let real = 0, im = 0, unit = 'i';
    if (typeof textOrNumber === "number")
        return {real: textOrNumber, im, unit};
    if (typeof textOrNumber === "boolean")
        throw FormulaError.VALUE;
    let match = textOrNumber.match(numberRegex);
    if (match) {
        real = Number(match[0]);
        return {real, im, unit};
    }
    match = textOrNumber.match(IMWithoutRealRegex);
    if (match) {
        im = Number(/^\s?[+-]?\s?$/.test(match[1]) ? match[1] + '1' : match[1]);
        unit = match[0].slice(-1);
        return {real, im, unit};
    }
    match = textOrNumber.match(IMRegex);
    if (match) {
        real = Number(match[1]);
        im = Number(/^\s?[+-]?\s?$/.test(match[3]) ? match[3] + '1' : match[3]);
        unit = match[0].slice(-1);
        return {real, im, unit};
    }
    throw FormulaError.NUM;
}

const EngineeringFunctions = {
    BESSELI: (x, n) => {
        x = H.accept(x, Types.NUMBER_NO_BOOLEAN);
        n = H.accept(n, Types.NUMBER_NO_BOOLEAN);
        // if n is not an integer, it is truncated.
        n = Math.trunc(n);
        if (n < 0) {
            throw FormulaError.NUM;
        }
        return bessel.besseli(x, n);
    },

    BESSELJ: (x, n) => {
        x = H.accept(x, Types.NUMBER_NO_BOOLEAN);
        n = H.accept(n, Types.NUMBER_NO_BOOLEAN);
        // if n is not an integer, it is truncated.
        n = Math.trunc(n);
        if (n < 0) {
            throw FormulaError.NUM;
        }
        return bessel.besselj(x, n);
    },

    BESSELK: (x, n) => {
        x = H.accept(x, Types.NUMBER_NO_BOOLEAN);
        n = H.accept(n, Types.NUMBER_NO_BOOLEAN);
        // if n is not an integer, it is truncated.
        n = Math.trunc(n);
        if (n < 0) {
            throw FormulaError.NUM;
        }

        return bessel.besselk(x, n);
    },

    BESSELY: (x, n) => {
        x = H.accept(x, Types.NUMBER_NO_BOOLEAN);
        n = H.accept(n, Types.NUMBER_NO_BOOLEAN);
        // if n is not an integer, it is truncated.
        n = Math.trunc(n);
        if (n < 0) {
            throw FormulaError.NUM;
        }

        return bessel.bessely(x, n);
    },

    BIN2DEC: (number) => {
        number = H.accept(number, Types.NUMBER_NO_BOOLEAN);
        let numberStr = number.toString();

        if (numberStr.length > 10) {
            throw FormulaError.NUM;
        }

        if (numberStr.length === 10 && numberStr.substring(0, 1) === '1') {
            return parseInt(numberStr.substring(1), 2) + MIN_BIN;
        } else {
            return parseInt(numberStr, 2);
        }
    },

    BIN2HEX: (number, places) => {
        number = H.accept(number, Types.NUMBER_NO_BOOLEAN);
        places = H.accept(places, Types.NUMBER_NO_BOOLEAN, null);

        const numberStr = number.toString();
        if (numberStr.length > 10) {
            throw FormulaError.NUM;
        }
        if (numberStr.length === 10 && numberStr.substring(0, 1) === '1') {
            return (parseInt(numberStr.substring(1), 2) + 1099511627264).toString(16).toUpperCase();
        }
        // convert BIN to HEX
        const result = parseInt(number, 2).toString(16);

        if (places == null) {
            return result.toUpperCase();
        } else {
            if (places < 0) {
                throw FormulaError.NUM;
            }
            // truncate places in case it is not an integer
            places = Math.trunc(places);
            if (places >= result.length) {
                return (TextFunctions.REPT('0', places - result.length) + result).toUpperCase();
            } else {
                throw FormulaError.NUM;
            }
        }
    },

    BIN2OCT: (number, places) => {
        number = H.accept(number, Types.NUMBER_NO_BOOLEAN);
        places = H.accept(places, Types.NUMBER, null);

        let numberStr = number.toString();
        if (numberStr.length > 10) {
            throw FormulaError.NUM;
        }
        if (numberStr.length === 10 && numberStr.substr(0, 1) === "1") {
            return (parseInt(numberStr.substr(1), 2) + 1073741312).toString(8);
        }

        let result = parseInt(number, 2).toString(8);
        if (places == null) {
            return result.toUpperCase();
        } else {
            if (places < 0) {
                throw FormulaError.NUM;
            }
            // truncate places in case it is not an integer
            places = Math.trunc(places);
            if (places >= result.length) {
                return (TextFunctions.REPT('0', places - result.length) + result);
            } else {
                throw FormulaError.NUM;
            }
        }
    },

    BITAND: (number1, number2) => {
        number1 = H.accept(number1, Types.NUMBER);
        number2 = H.accept(number2, Types.NUMBER);
        if (number1 < 0 || number2 < 0) {
            throw FormulaError.NUM;
        }
        // check if they are non-integer, if yes, return error
        if (Math.floor(number1) !== number1 || Math.floor(number2) !== number2) {
            throw FormulaError.NUM;
        }
        if (number1 > 281474976710655 || number2 > 281474976710655) {
            throw FormulaError.NUM;
        }

        return number1 & number2;
    },

    BITLSHIFT: (number, shiftAmount) => {
        number = H.accept(number, Types.NUMBER);
        shiftAmount = H.accept(shiftAmount, Types.NUMBER);
        shiftAmount = Math.trunc(shiftAmount);
        if (Math.abs(shiftAmount) > 53) {
            throw FormulaError.NUM;
        }

        if (number < 0 || Math.floor(number) !== number || number > 281474976710655) {
            throw FormulaError.NUM;
        }
        const result = (shiftAmount >= 0) ? number * 2 ** shiftAmount : Math.trunc(number / 2 ** -shiftAmount);
        if (result > 281474976710655)
            throw FormulaError.NUM;
        else
            return result;
    },

    BITOR: (number1, number2) => {
        number1 = H.accept(number1, Types.NUMBER);
        number2 = H.accept(number2, Types.NUMBER);
        if (number1 < 0 || number2 < 0) {
            throw FormulaError.NUM;
        }
        // check if they are non-integer, if yes, return error
        if (Math.floor(number1) !== number1 || Math.floor(number2) !== number2) {
            throw FormulaError.NUM;
        }
        if (number1 > 281474976710655 || number2 > 281474976710655) {
            throw FormulaError.NUM;
        }

        return number1 | number2;
    },

    BITRSHIFT: (number, shiftAmount) => {
        number = H.accept(number, Types.NUMBER);
        shiftAmount = H.accept(shiftAmount, Types.NUMBER);
        return EngineeringFunctions.BITLSHIFT(number, -shiftAmount);
    },

    BITXOR: (number1, number2) => {
        number1 = H.accept(number1, Types.NUMBER);
        number2 = H.accept(number2, Types.NUMBER);
        if (number1 < 0 || number1 > 281474976710655 || Math.floor(number1) !== number1) {
            throw FormulaError.NUM;
        }
        if (number2 < 0 || number2 > 281474976710655 || Math.floor(number2) !== number2) {
            throw FormulaError.NUM;
        }
        // // to check if the number is a non-integer
        // if (Math.abs(number1) !== number1 || Math.abs(number2) !== number2) {
        //     throw FormulaError.NUM;
        // }

        return number1 ^ number2;
    },

    COMPLEX: (realNum, iNum, suffix) => {
        realNum = H.accept(realNum, Types.NUMBER_NO_BOOLEAN);
        iNum = H.accept(iNum, Types.NUMBER_NO_BOOLEAN);
        suffix = H.accept(suffix, Types.STRING, "i");
        if (suffix !== "i" && suffix !== "j") {
            throw FormulaError.VALUE;
        }
        if (realNum === 0 && iNum === 0) {
            return 0;
        } else if (realNum === 0) {
            if (iNum === 1) {
                return suffix;
            } else if (iNum === -1) {
                return "-" + suffix;
            } else {
                return iNum.toString() + suffix;
            }
        } else if (iNum === 0) {
            return realNum.toString()
        } else {
            let sign = (iNum > 0) ? "+" : "";
            if (iNum === 1) {
                return realNum.toString() + sign + suffix;
            } else if (iNum === -1) {
                return realNum.toString() + sign + "-" + suffix;
            } else {
                return realNum.toString() + sign + iNum.toString() + suffix;
            }
        }
    },

    DEC2BIN: (number, places) => {
        number = H.accept(number, Types.NUMBER);
        places = H.accept(places, Types.NUMBER, null);
        if (number < MIN_BIN || number > MAX_BIN) {
            throw FormulaError.NUM;
        }

        // if the number is negative, valid place values are ignored and it returns a 10-character binary number.
        if (number < 0) {
            return "1" + TextFunctions.REPT("0", 9 - (512 + number).toString(2).length) + (512 + number).toString(2);
        }

        let result = parseInt(number, 10).toString(2);
        if (places == null) {
            return result;
        } else {
            // if places is not an integer, it is truncated
            places = Math.trunc(places);
            if (places <= 0) {
                throw FormulaError.NUM;
            }
            if (places < result.length)
                throw FormulaError.NUM;
            return TextFunctions.REPT("0", places - result.length) + result;
        }
    },

    DEC2HEX: (number, places) => {
        number = H.accept(number, Types.NUMBER);
        places = H.accept(places, Types.NUMBER, null);
        if (number < -549755813888 || number > 549755813888) {
            throw FormulaError.NUM;
        }

        // if the number is negative, valid place values are ignored and it returns a 10-character binary number.
        if (number < 0) {
            return (1099511627776 + number).toString(16).toUpperCase();
        }

        let result = parseInt(number, 10).toString(16);

        if (places == null) {
            return result.toUpperCase();
        } else {
            // if places is not an integer, it is truncated
            places = Math.trunc(places);
            if (places <= 0) {
                throw FormulaError.NUM;
            }
            if (places < result.length)
                throw FormulaError.NUM;
            return TextFunctions.REPT("0", places - result.length) + result.toUpperCase();
        }
    },

    DEC2OCT: (number, places) => {
        number = H.accept(number, Types.NUMBER);
        places = H.accept(places, Types.NUMBER, null);
        if (number < -536870912 || number > 536870912) {
            throw FormulaError.NUM;
        }

        // if the number is negative, valid place values are ignored and it returns a 10-character binary number.
        if (number < 0) {
            return (number + 1073741824).toString(8);
        }

        let result = parseInt(number, 10).toString(8);

        if (places == null) {
            return result.toUpperCase();
        } else {
            // if places is not an integer, it is truncated
            places = Math.trunc(places);
            if (places <= 0) {
                throw FormulaError.NUM;
            }
            if (places < result.length)
                throw FormulaError.NUM;
            return TextFunctions.REPT("0", places - result.length) + result;
        }
    },

    DELTA: (number1, number2) => {
        number1 = H.accept(number1, Types.NUMBER_NO_BOOLEAN);
        number2 = H.accept(number2, Types.NUMBER_NO_BOOLEAN, 0);

        return number1 === number2 ? 1 : 0;
    },

    ERF: (lowerLimit, upperLimit) => {
        lowerLimit = H.accept(lowerLimit, Types.NUMBER_NO_BOOLEAN);
        upperLimit = H.accept(upperLimit, Types.NUMBER_NO_BOOLEAN, 0);
        return jStat.erf(lowerLimit);
    },

    ERFC: (x) => {
        x = H.accept(x, Types.NUMBER_NO_BOOLEAN);
        return jStat.erfc(x);
    },

    GESTEP: (number, step) => {
        number = H.accept(number, Types.NUMBER_NO_BOOLEAN);
        step = H.accept(step, Types.NUMBER_NO_BOOLEAN, 0);
        return number >= step ? 1 : 0;
    },

    HEX2BIN: (number, places) => {
        number = H.accept(number, Types.STRING);
        places = H.accept(places, Types.NUMBER, null);

        if (number.length > 10 || !/^[0-9a-fA-F]*$/.test(number)) {
            throw FormulaError.NUM;
        }
        // to check if the number is negative
        let ifNegative = (number.length === 10 && number.substr(0, 1).toLowerCase() === "f");
        // convert HEX to DEC
        let toDecimal = ifNegative ? parseInt(number, 16) - 1099511627776 : parseInt(number, 16);
        // if number is lower than -512 or grater than 511, return error
        if (toDecimal < MIN_BIN || toDecimal > MAX_BIN) {
            throw FormulaError.NUM;
        }
        // if the number is negative, valid place values are ignored and it returns a 10-character binary number.
        if (ifNegative) {
            return "1" + TextFunctions.REPT('0', 9 - (toDecimal + 512).toString(2).length) + (toDecimal + 512).toString(2)
        }
        // convert decimal to binary
        let toBinary = toDecimal.toString(2);

        if (places == null) {
            return toBinary;
        } else {
            // if places is not an integer, it is truncated
            places = Math.trunc(places);
            if (places <= 0 || places < toBinary.length) {
                throw FormulaError.NUM;
            }
            return TextFunctions.REPT("0", places - toBinary.length) + toBinary;
        }
    },

    HEX2DEC: (number) => {
        number = H.accept(number, Types.STRING);
        if (number.length > 10 || !/^[0-9a-fA-F]*$/.test(number)) {
            throw FormulaError.NUM;
        }
        let result = parseInt(number, 16);
        //david: validate
        // If the places is larger than 10, or number is larger than, return #NUM!
        // If number is not a valid Hex number,  returns the #NUM! error value.

        return (result >= 549755813888) ? result - 1099511627776 : result;
    },

    HEX2OCT: (number, places) => {
        number = H.accept(number, Types.STRING);
        if (number.length > 10 || !/^[0-9a-fA-F]*$/.test(number)) {
            throw FormulaError.NUM;
        }
        // convert HEX to DEC
        let toDecimal = EngineeringFunctions.HEX2DEC(number);
        if (toDecimal > MAX_OCT || toDecimal < MIN_OCT) {
            throw FormulaError.NUM;
        }
        return EngineeringFunctions.DEC2OCT(toDecimal, places);
    },

    IMABS: (iNumber) => {
        const {real, im} = parseIM(iNumber);
        return Math.sqrt(Math.pow(real, 2) + Math.pow(im, 2));
    },

    IMAGINARY: (iNumber) => {
        return parseIM(iNumber).im;
    },

    IMARGUMENT: (iNumber) => {
        const {real, im} = parseIM(iNumber);
        // x + yi => x cannot be 0, since theta = tan-1(y / x)
        if (real === 0 && im === 0) {
            throw FormulaError.DIV0;
        }
        // return PI/2 if x is equal to 0 and y is positive
        if (real === 0 && im > 0) {
            return Math.PI / 2;
        }
        // while return -PI/2 if x is equal to 0 and y is negative
        if (real === 0 && im < 0) {
            return -Math.PI / 2;
        }
        // return -PI if x is negative and y is equal to 0
        if (real < 0 && im === 0) {
            return Math.PI
        }
        // return 0 if x is positive and y is equal to 0
        if (real > 0 && im === 0) {
            return 0;
        }
        // return argument of iNumber
        if (real > 0) {
            return Math.atan(im / real);
        } else if (real < 0 && im > 0) {
            return Math.atan(im / real) + Math.PI;
        } else {
            return Math.atan(im / real) - Math.PI;
        }

    },

    IMCONJUGATE: (iNumber) => {
        const {real, im, unit} = parseIM(iNumber);
        return (im !== 0) ? EngineeringFunctions.COMPLEX(real, -im, unit) : '' + real;
    },

    IMCOS: (iNumber) => {
        const {real, im, unit} = parseIM(iNumber);
        let realInput = Math.cos(real) * (Math.exp(im) + Math.exp(-im)) / 2;
        let imaginaryInput = -Math.sin(real) * (Math.exp(im) - Math.exp(-im)) / 2;

        return EngineeringFunctions.COMPLEX(realInput, imaginaryInput, unit);
    },

    IMCOSH: (iNumber) => {
        const {real, im, unit} = parseIM(iNumber);
        let realInput = Math.cos(im) * (Math.exp(real) + Math.exp(-real)) / 2;
        let imaginaryInput = -Math.sin(im) * (Math.exp(real) - Math.exp(-real)) / 2;
        return EngineeringFunctions.COMPLEX(realInput, -imaginaryInput, unit);
    },

    IMCOT: (iNumber) => {
        iNumber = H.accept(iNumber);
        let real = EngineeringFunctions.IMCOS(iNumber);
        let imaginary = EngineeringFunctions.IMSIN(iNumber);
        return EngineeringFunctions.IMDIV(real, imaginary);
    },

    IMCSC: (iNumber) => {
        iNumber = H.accept(iNumber);
        return EngineeringFunctions.IMDIV('1', EngineeringFunctions.IMSIN(iNumber));
    },

    IMCSCH: (iNumber) => {
        iNumber = H.accept(iNumber);
        return EngineeringFunctions.IMDIV('1', EngineeringFunctions.IMSINH(iNumber));
    },

    IMDIV: (iNumber1, iNumber2) => {
        const res1 = parseIM(iNumber1);
        const a = res1.real, b = res1.im, unit1 = res1.unit;

        const res2 = parseIM(iNumber2);
        const c = res2.real, d = res2.im, unit2 = res2.unit;

        if (c === 0 && d === 0 || unit1 !== unit2) {
            throw FormulaError.NUM;
        }
        let unit = unit1;

        let denominator = Math.pow(c, 2) + Math.pow(d, 2);
        return EngineeringFunctions.COMPLEX((a * c + b * d) / denominator, (b * c - a * d) / denominator, unit);
    },

    IMEXP: (iNumber) => {
        const {real, im, unit} = parseIM(iNumber);
        // return exponential of complex number
        let e = Math.exp(real);
        return EngineeringFunctions.COMPLEX(e * Math.cos(im), e * Math.sin(im), unit)
    },

    IMLN: (iNumber) => {
        const {real, im, unit} = parseIM(iNumber);
        return EngineeringFunctions.COMPLEX(Math.log(Math.sqrt(Math.pow(real, 2) + Math.pow(im, 2))),
            Math.atan(im / real), unit);
    },

    IMLOG10: (iNumber) => {
        const {real, im, unit} = parseIM(iNumber);
        let realInput = Math.log(Math.sqrt(Math.pow(real, 2) + Math.pow(im, 2))) / Math.log(10);
        let imaginaryInput = Math.atan(im / real) / Math.log(10);
        return EngineeringFunctions.COMPLEX(realInput, imaginaryInput, unit);
    },

    IMLOG2: (iNumber) => {
        const {real, im, unit} = parseIM(iNumber);
        let realInput = Math.log(Math.sqrt(Math.pow(real, 2) + Math.pow(im, 2))) / Math.log(2);
        let imaginaryInput = Math.atan(im / real) / Math.log(2);
        return EngineeringFunctions.COMPLEX(realInput, imaginaryInput, unit);
    },

    IMPOWER: (iNumber, number) => {
        let {unit} = parseIM(iNumber);
        number = H.accept(number, Types.NUMBER_NO_BOOLEAN);

        // calculate power of modules
        let p = Math.pow(EngineeringFunctions.IMABS(iNumber), number);
        // calculate argument
        let t = EngineeringFunctions.IMARGUMENT(iNumber);

        let real = p * Math.cos(number * t);
        let imaginary = p * Math.sin(number * t);
        return EngineeringFunctions.COMPLEX(real, imaginary, unit);
    },

    IMPRODUCT: (...params) => {
        let result;
        let i = 0;
        H.flattenParams(params, null, false, (item) => {
            if (i === 0) {
                result = H.accept(item);
                parseIM(result);
            } else {
                const res1 = parseIM(result);
                const a = res1.real, b = res1.im, unit1 = res1.unit;
                const res2 = parseIM(item);
                const c = res2.real, d = res2.im, unit2 = res2.unit;
                if (unit1 !== unit2)
                    throw FormulaError.VALUE;
                result = EngineeringFunctions.COMPLEX(a * c - b * d, a * d + b * c);
            }
            i++;
        }, 1);
        return result;
    },

    IMREAL: (iNumber) => {
        return parseIM(iNumber).real;
    },

    IMSEC: (iNumber) => {
        return EngineeringFunctions.IMDIV('1', EngineeringFunctions.IMCOS(iNumber));
    },

    IMSECH: (iNumber) => {
        return EngineeringFunctions.IMDIV('1', EngineeringFunctions.IMCOSH(iNumber));
    },

    IMSIN: (iNumber) => {
        const {real, im, unit} = parseIM(iNumber);

        let realInput = Math.sin(real) * (Math.exp(im) + Math.exp(-im)) / 2;
        let imaginaryInput = Math.cos(real) * (Math.exp(im) - Math.exp(-im)) / 2;
        return EngineeringFunctions.COMPLEX(realInput, imaginaryInput, unit);
    },

    IMSINH: (iNumber) => {
        const {real, im, unit} = parseIM(iNumber);
        let realInput = Math.cos(im) * (Math.exp(real) - Math.exp(-real)) / 2;
        let imaginaryInput = Math.sin(im) * (Math.exp(real) + Math.exp(-real)) / 2;
        return EngineeringFunctions.COMPLEX(realInput, imaginaryInput, unit);
    },

    IMSQRT: (iNumber) => {
        const {unit} = parseIM(iNumber);
        // calculate the power of modulus
        let power = Math.sqrt(EngineeringFunctions.IMABS(iNumber));
        // calculate argument
        let argument = EngineeringFunctions.IMARGUMENT(iNumber);
        return EngineeringFunctions.COMPLEX(power * Math.cos(argument / 2), power * Math.sin(argument / 2), unit);
    },

    IMSUB: (iNumber1, iNumber2) => {
        const res1 = parseIM(iNumber1);
        const a = res1.real, b = res1.im, unit1 = res1.unit;
        const res2 = parseIM(iNumber2);
        const c = res2.real, d = res2.im, unit2 = res2.unit;

        if (unit1 !== unit2) {
            throw FormulaError.VALUE;
        }
        return EngineeringFunctions.COMPLEX(a - c, b - d, unit1);
    },

    IMSUM: (...params) => {
        let realSum = 0, imSum = 0, prevUnit;
        H.flattenParams(params, null, false, (item) => {
            const {real, im, unit} = parseIM(item);
            if (!prevUnit) prevUnit = unit;
            if (prevUnit !== unit)
                throw FormulaError.VALUE;
            realSum += real;
            imSum += im;
        });
        return EngineeringFunctions.COMPLEX(realSum, imSum, prevUnit);
    },

    IMTAN: (iNumber) => {
        const {unit} = parseIM(iNumber);
        return EngineeringFunctions.IMDIV(EngineeringFunctions.IMSIN(iNumber), EngineeringFunctions.IMCOS(iNumber), unit);
    },

    // FIXME: need to check the test cases
    OCT2BIN: (number, places) => {
        // office: If number is not a valid octal number, OCT2BIN returns the #NUM! error value.
        // office: If places is nonnumeric, OCT2BIN returns the #VALUE! error value.
        number = H.accept(number, Types.STRING);
        places = H.accept(places, Types.NUMBER, null);

        // 1. If number's length larger than 10, returns #NUM!
        if (number.length > 10) {
            throw FormulaError.NUM
        }
        // In microsoft Excel, if places is larger than 10, it will return #NUM!
        if (places > 10) {
            throw FormulaError.NUM;
        }

        // 2. office: If places is negative, OCT2BIN returns the #NUM! error value.
        if (places !== null && places < 0) {
            throw FormulaError.NUM;
        }
        // if places is not an integer, it is truncated
        // office: If places is not an integer, it is truncated.
        places = Math.trunc(places);

        // to check if the Oct number is negative
        let isNegative = (number.length === 10 && number.substring(0, 1) === '7');
        // convert OCT to DEC
        let toDecimal = EngineeringFunctions.OCT2DEC(number);
        // 2.
        // office: If number is negative, it cannot be less than 7777777000, and if number is positive, it cannot be greater than 777.
        // MiN_BIN = -512, MAX_BIN = 511
        if (toDecimal < MIN_BIN || toDecimal > MAX_BIN) {
            return FormulaError.NUM;
        }
        // if number is negative, ignores places and return a 10-character binary number
        // office: If number is negative, OCT2BIN ignores places and returns a 10-character binary number.
        if (isNegative) {
            return '1' + TextFunctions.REPT('0', 9 - (512 + toDecimal).toString(2).length) + (512 + toDecimal).toString(2);
        }

        // convert DEC to BIN
        let result = toDecimal.toString(2);


        //if (places === null) {
        if (places === 0) {
            return result;
        }

        // office: If OCT2BIN requires more than places characters, it returns the #NUM! error value.
        if (places < result.length) {
            throw FormulaError.NUM;
        }

        return TextFunctions.REPT('0', places - result.length) + result;
    },

    OCT2DEC: (number) => {
        number = H.accept(number, Types.STRING);
        // In microsoft Excel, if number contains more than ten characters (10 digits), it will return #NUM!
        if (number.length > 10) {
            throw FormulaError.NUM;
        }

        // If number is not a valid octal number, OCT2DEC returns the #NUM! error value.
        for (const n of number) {
            if (n < '0' || n > '7') {
                throw FormulaError.NUM;
            }
        }
        // convert to DEC
        let result = parseInt(number, 8);
        return (result >= 536870912) ? result - 1073741824 : result;
        //  536870912(4000000000) : -536870912;   1073741823(7777777777) : -1
    },

    OCT2HEX: (number, places) => {
        number = H.accept(number, Types.STRING);
        places = H.accept(places, Types.NUMBER_NO_BOOLEAN, null);
        if (number.length > 10) {
            throw FormulaError.NUM
        }
        // office: If number is not a valid octal number, OCT2DEC returns the #NUM! error value.
        for (const n of number) {
            if (n < '0' || n > '7') {
                throw FormulaError.NUM;
            }
        }
        // if places is not an integer, it is truncated
        places = Math.trunc(places);
        // office: If places is negative, OCT2HEX returns the #NUM! error value.
        if (places < 0 || places > 10) {
            throw FormulaError.NUM;
        }

        // convert OCT to DEC
        let toDecimal = EngineeringFunctions.OCT2DEC(number);

        // convert DEC to HEX
        // let toHex = EngineeringFunctions.DEC2HEX(toDecimal, places);
        let toHex = EngineeringFunctions.DEC2HEX(toDecimal);
        //if (places === null) {
        if (places === 0) {
            return toHex;
        }
        if (places < toHex.length) {
            throw FormulaError.NUM;
        } else {
            return TextFunctions.REPT('0', places - toHex.length) + toHex;
        }
    },
};

module.exports = EngineeringFunctions;

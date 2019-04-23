const FormulaError = require('../error');
const TextFunctions = require('./text');
const {FormulaHelpers, Types} = require('../helpers');
const H = FormulaHelpers;
const bessel = require("bessel");
const jStat = require("jstat/src/core");

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
            return parseInt(numberStr.substring(1), 2) - 512;
        } else {
            return parseInt(numberStr, 2);
        }
    },

    BIN2HEX: (number, places) => {
        number = H.accept(number, Types.NUMBER_NO_BOOLEAN);
        let defaultPlace = (parseInt(number, 2).toString(16)).length;
        places = H.accept(places, Types.NUMBER_NO_BOOLEAN, defaultPlace);

        let numberStr = number.toString();
        if (numberStr.length > 10) {
            throw FormulaError.NUM;
        }
        if (numberStr.length === 10 && numberStr.substring(0, 1) === '1') {
            return (parseInt(numberStr.substring(1), 2) + 1099511627264).toString(16).toUpperCase()
        }
        // convert BIN to HEX
        let result = parseInt(number, 2).toString(16);

        if (isNaN(places)) {
            throw FormulaError.VALUE;
        }
        if (places < 0) {
            throw FormulaError.NUM;
        }
        // truncate places in case it is not an integer
        places = Math.floor(places);
        if (places >= result.length) {
            return (TextFunctions.REPT('0', places - result.length) + result).toUpperCase();
        } else {
            throw FormulaError.NUM;
        }
    },

    BIN2OCT: (number, places) => {
        number = H.accept(number, Types.NUMBER_NO_BOOLEAN);
        places = H.accept(places, Types.NUMBER, undefined);
        // truncate places in case it is not integer
        places = Math.floor(places);
        if (places < 0) {
            throw FormulaError.NUM;
        }

        let numberStr = number.toString();
        if (numberStr.length > 10) {
            console.log("length us greater than 10");
            throw FormulaError.NUM;
        }
        if (numberStr.length === 10 && numberStr.substr(0, 1) === "1") {
            return (parseInt(numberStr.substr(1), 2) + 1073741312).toString(8);
        }

        let result = parseInt(number, 2).toString(8);
        if (places === undefined) {
            return result;
        }
        if (places < result.length) {
            throw FormulaError.NUM;
        }

        return TextFunctions.REPT(0, places - result.length) + result;
    },

    BITAND: (number1, number2) => {
        number1 = H.accept(number1, Types.NUMBER);
        number2 = H.accept(number2, Types.NUMBER);
        if (number1 < 0 || number2 < 0) {
            throw FormulaError.NUM;
        }
        // check if they are non-integer, if yes, return error
        if (Math.floor(number1) !== number1 || Math.floor(number2 !== number2)) {
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
        if (Math.abs(shiftAmount) > 53 || Math.floor(shiftAmount) !== shiftAmount) {
            throw FormulaError.NUM;
        }

        if (number < 0 || Math.floor(number) !== number || number > 281474976710655) {
            throw FormulaError.NUM;
        }

        return (shiftAmount >= 0) ? number << shiftAmount : number >> -shiftAmount;
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
        if (Math.abs(shiftAmount) > 53 || Math.floor(shiftAmount) !== shiftAmount) {
            throw FormulaError.NUM;
        }

        if (number < 0 || Math.floor(number) !== number || number > 281474976710655) {
            throw FormulaError.NUM;
        }

        let result;
        if (shiftAmount >= 0) {
            result = number >> shiftAmount;
        } else {
            result = number << -shiftAmount;
        }
        if (result > 281474976710655) {
            return FormulaError.NUM;
        }

        return result;
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
        // to check if the number is a non-integer
        if (Math.abs(number1) !== number1 || Math.abs(number2) !== number2) {
            throw FormulaError.NUM;
        }

        return number1 ^ number2;
    },

    COMPLEX: (realNum, iNum, suffix) => {
        realNum = H.accept(realNum, Types.NUMBER_NO_BOOLEAN);
        iNum = H.accept(iNum, Types.NUMBER_NO_BOOLEAN);
        suffix = H.accept(suffix, Types.STRING, "i");
        suffix = (suffix === undefined) ? "i" : suffix;
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

    // convert a number from one measurement system to another. For example, it can translate a table of
    // distances in miles to a table of distances in kilometers.
    CONVERT: (number, fromUnit, toUnit) => {
        number = H.accept(number, Types.NUMBER);

        // list of units supported by CONVERT and units defined by the International System of Unites
    },

    DEC2BIN: (number, places) => {
        number = H.accept(number, Types.NUMBER);
        places = H.accept(places, Types.NUMBER, false);
        if (number < -512 || number > 512) {
            throw FormulaError.NUM;
        }

        // if places is not an integer, it is truncated
        places = Math.floor(places);
        if (places <= 0) {
            throw FormulaError.NUM;
        }

        // if the number is negative, valid place values are ignored and it returns a 10-character binary number.
        if (number < 0) {
            return "1" + TextFunctions.REPT("0", 9 - (512 + number).toString(2).length) + (512 + number).toString(2);
        }

        let result = parseInt(number, 10).toString(2);
        if (typeof places === 'undefined') {
            return result;
        }
        return (places >= result.length) ? TextFunctions.REPT("0", places - result.length) + result : FormulaError.NUM;
    },

    DEC2HEX: (number, places) => {
        number = H.accept(number, Types.NUMBER);
        places = H.accept(places, Types.NUMBER, false);
        if (number < -549755813888 || number > 549755813888) {
            throw FormulaError.NUM;
        }
        // if places is not an integer, it is truncated
        places = Math.floor(places);
        if (places <= 0) {
            throw FormulaError.NUM;
        }

        // if the number is negative, valid place values are ignored and it returns a 10-character binary number.
        if (number < 0) {
            return (1099511627776 + number).toString(16);
        }

        let result = parseInt(number, 10).toString(16);
        if (typeof places === 'undefined') {
            return result;
        }
        return (places >= result.length) ? TextFunctions.REPT(0, places - result.length) + result : FormulaError.NUM;
    },

    DEC2OCT: (number, places) => {
        number = H.accept(number, Types.NUMBER);
        places = H.accept(places, Types.NUMBER, false);
        if (number < -536870912 || number > 536870912) {
            throw FormulaError.NUM;
        }
        // if places is not an integer, it is truncated
        places = Math.floor(places);
        if (places <= 0) {
            throw FormulaError.NUM;
        }

        // if the number is negative, valid place values are ignored and it returns a 10-character binary number.
        if (number < 0) {
            return (number + 1073741824).toString(8);
        }

        let result = parseInt(number, 10).toString(8);
        if (typeof places === "undefined") {
            return result;
        }
        return (places >= result.length) ? TextFunctions.REPT('0', places - result.length) + result : FormulaError.NUM;
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
        number = H.accept(number, Types.NUMBER);
        places = H.accept(places, Types.NUMBER, false);
        // if places is not an integer, it is truncated.
        places = Math.floor(places);
        if (places < 0) {
            throw FormulaError.NUM;
        }
        // to check if the number is negative
        let ifNegative = (number.length === 10 && number.substr(0, 1).toLowerCase() === "f");
        // convert HEX to DEC
        let toDecimal = ifNegative ? parseInt(number, 16) - 1099511627776 : parseInt(number, 16);
        // if number is lower than -512 or grater than 511, return error
        if (toDecimal < -512 || toDecimal > 511) {
            throw FormulaError.NUM;
        }
        // if the number is negative, valid place values are ignored and it returns a 10-character binary number.
        if (ifNegative) {
            return "1" + TextFunctions.REPT('0', 9 - (toDecimal + 512).toString(2).length) + (toDecimal + 512).toString(2)
        }
        // convert decimal to binary
        let toBinary = toDecimal.toString(2);
        if (places === undefined) {
            return toBinary;
        }
        return (places >= toBinary.length) ? TextFunctions.REPT('0', places - toBinary.length) + toBinary : FormulaError.NUM;
    },

    HEX2DEC: (number) => {
        number = H.accept(number, Types.NUMBER);
        let result = parseInt(number, 16);
        return (result >= 549755813888) ? result - 1099511627776 : result;
    },

    HEX2OCT: (number, places) => {
        number = H.accept(number, Types.NUMBER);
        places = H.accept(places, Types.NUMBER, false);
        // if places is not an integer, it is truncated.
        places = Math.floor(places);
        if (places < 0) {
            throw FormulaError.NUM;
        }
        // convert HEX to DEC
        let toDecimal = parseInt(number, 16);
        if (toDecimal > 536870911 && toDecimal < 1098974756864) {
            throw FormulaError.NUM;
        }
        // if the number is negative, valid place values are ignored and it returns a 10-character octal number.
        if (toDecimal >= 1098974756864) {
            return (toDecimal - 1098974756864).toString(8);
        }
        // convert DEC to OCT
        let toOctal = toDecimal.toString(8);
        if (places === undefined) {
            return toOctal;
        }
        return (places >= toOctal.length) ? TextFunctions.REPT('0', places - toOctal.length) + toOctal : FormulaError.NUM;
    },

    IMABS: (iNumber) => {
        iNumber = H.accept(iNumber, Types.STRING);
        let real = EngineeringFunctions.IMREAL(iNumber);
        let imaginary = EngineeringFunctions.IMAGINARY(iNumber);
        return Math.sqrt(Math.pow(real, 2) + Math.pow(imaginary, 2));
    },

    IMAGINARY: (iNumber) => {
        iNumber = H.accept(iNumber, Types.STRING);
        if (iNumber === 0 || iNumber === '0') {
            return 0;
        }
        if (['i', 'j'].indexOf(iNumber) >= 0) {
            return 1;
        }
        // normalize imaginary coefficient
        iNumber = iNumber.replace('+i', '+1i').replace('-i', '-1i').replace('+j', '+1j').replace('-j', '-1j');
        // look up sign
        let plusSign = iNumber.indexOf('+');
        let minusSign = iNumber.indexOf('-');
        if (plusSign === 0) {
            plusSign = iNumber.indexOf('+', 1)
        }
        if (minusSign === 0) {
            minusSign = iNumber.indexOf('-', 1);
        }
        // look up imaginary unit
        let unit = iNumber.substring(iNumber.length - 1, iNumber.length);
        let validUnit = (unit === 'i' || unit === 'j');

        if (plusSign >= 0 || minusSign >= 0) {
            if (!validUnit) {
                throw FormulaError.NUM
            }

            if (plusSign >= 0) {
                return Number(iNumber.substring(plusSign + 1, iNumber.length - 1));
            } else {
                return -Number(iNumber.substring(minusSign + 1, iNumber.length - 1));
            }
        } else {
            if (validUnit) {
                return Number(iNumber.substring(0, iNumber.length - 1));
            } else {
                return 0;
            }
        }
    },

    IMARGUMENT: (iNumber) => {
        iNumber = H.accept(iNumber, Types.STRING);
        let real = EngineeringFunctions.IMREAL(iNumber);
        let imaginary = EngineeringFunctions.IMAGINARY(iNumber);
        // x + yi => x cannot be 0, since theta = tan-1(y / x)
        if (real === 0 && imaginary === 0) {
            throw FormulaError.NUM;
        }
        // return PI/2 if x is equal to 0 and y is positive
        if (real === 0 && imaginary > 0) {
            return Math.PI / 2;
        }
        // while return -PI/2 if x is equal to 0 and y is negative
        if (real === 0 && imaginary < 0) {
            return -Math.PI / 2;
        }
        // return -PI if x is negative and y is equal to 0
        if (real < 0 && imaginary === 0) {
            return -Math.PI
        }
        // return 0 if x is positive and y is equal to 0
        if (real > 0 && imaginary === 0) {
            return 0;
        }
        // return argument of iNumber
        if (real > 0) {
            return Math.atan(imaginary / real);
        } else if (real < 0 && imaginary > 0) {
            return Math.atan(imaginary / real) + Math.PI;
        } else {
            return Math.atan(imaginary / real) - Math.PI;
        }

    },

    IMCONJUGATE: (iNumber) => {
        iNumber = H.accept(iNumber, Types.STRING);
        let real = EngineeringFunctions.IMREAL(iNumber);
        let imaginary = EngineeringFunctions.IMAGINARY(iNumber);
        // look up unit
        let unit = iNumber.substring(iNumber.length - 1, iNumber.length);
        unit = (unit === 'i' || unit === 'j') ? unit : 'i';
        console.log(imaginary);
        return (imaginary !== 0) ? EngineeringFunctions.COMPLEX(real, -imaginary, unit) : iNumber;
    },

    IMCOS: (iNumber) => {
        iNumber = H.accept(iNumber, Types.STRING);
        let real = EngineeringFunctions.IMREAL(iNumber);
        let imaginary = EngineeringFunctions.IMAGINARY(iNumber);
        // look up unit
        let unit = iNumber.substring(iNumber.length - 1, iNumber.length);
        unit = (unit === 'i' || unit === 'j') ? unit : 'i';
        let realInput = Math.cos(real) * (Math.exp(imaginary) + Math.exp(-imaginary)) / 2;
        let imaginaryInput = -Math.sin(real) * (Math.exp(imaginary) - Math.exp(-imaginary)) / 2;

        return EngineeringFunctions.COMPLEX(realInput, imaginaryInput, unit);
    },

    IMCOSH: (iNumber) => {
        iNumber = H.accept(iNumber, Types.STRING);
        let real = EngineeringFunctions.IMREAL(iNumber);
        let imaginary = EngineeringFunctions.IMAGINARY(iNumber);
        // look up unit
        let unit = iNumber.substring(iNumber.length - 1, iNumber.length);
        unit = (unit === 'i' || unit === 'j') ? unit : 'i';

        let realInput = Math.cos(real) * (Math.exp(imaginary) + Math.exp(-imaginary)) / 2;
        let imaginaryInput = -Math.sin(real) * (Math.exp(imaginary) - Math.exp(-imaginary)) / 2;
        return EngineeringFunctions.COMPLEX(realInput, imaginaryInput, unit);
    },

    IMCOT: (iNumber) => {
        iNumber = H.accept(iNumber, Types.STRING);
        if (iNumber === true || iNumber === false) {
            throw FormulaError.VALUE;
        }
        let real = EngineeringFunctions.IMCOS(EngineeringFunctions.IMREAL(iNumber));
        let imaginary = EngineeringFunctions.IMSIN(EngineeringFunctions.IMAGINARY(iNumber));
        return EngineeringFunctions.IMDIV(real, imaginary);
    },

    IMCSC: (iNumber) => {
        iNumber = H.accept(iNumber, Types.STRING);
        if (iNumber === true || iNumber === false) {
            throw FormulaError.VALUE;
        }

        return EngineeringFunctions.IMDIV('1', EngineeringFunctions.IMSIN(iNumber));
    },

    IMCSCH: (iNumber) => {
        iNumber = H.accept(iNumber, Types.STRING);
        if (iNumber === true || iNumber === false) {
            throw FormulaError.VALUE;
        }

        return EngineeringFunctions.IMDIV('1', EngineeringFunctions.IMSINH(iNumber));
    },

    IMDIV: (iNumber1, iNumber2) => {
        iNumber1 = H.accept(iNumber1, Types.STRING);  // a + bi
        iNumber2 = H.accept(iNumber2, Types.STRING);  // c + di
        let a = EngineeringFunctions.IMREAL(iNumber1);
        let b = EngineeringFunctions.IMAGINARY(iNumber1);
        let c = EngineeringFunctions.IMREAL(iNumber2);
        let d = EngineeringFunctions.IMAGINARY(iNumber2);
        if (c === 0 && d === 0) {
            throw FormulaError.NUM;
        }
        let unit1 = iNumber1.substring(iNumber1.length - 1, iNumber1.length);
        let unit2 = iNumber2.substring(iNumber2.length - 1, iNumber2.length);
        let unit = 'i';
        if (unit1 === 'j' || unit2 === 'j') {
            unit = 'j';
        }

        let denominator = Math.pow(c, 2) + Math.pow(d, 2);
        return EngineeringFunctions.COMPLEX((a * c + b * d) / denominator, (b * c - a * d) / denominator, unit);
    },

    IMEXP: (iNumber) => {
        iNumber = H.accept(iNumber, Types.STRING);
        if (iNumber === true || iNumber === false) {
            throw FormulaError.VALUE;
        }

        let real = EngineeringFunctions.IMREAL(iNumber);
        let imaginary = EngineeringFunctions.IMAGINARY(iNumber);
        // look up for unit
        let unit = iNumber.substring(iNumber.length - 1, iNumber.length);
        unit = (unit === 'i' || unit === 'j') ? unit : 'i';
        // return exponential of complex number
        let e = Math.exp(real);
        return EngineeringFunctions.COMPLEX(e * Math.cos(imaginary), e * Math.sin(imaginary), unit)
    },

    IMLN: (iNumber) => {
        iNumber = H.accept(iNumber, Types.STRING);
        let real = EngineeringFunctions.IMREAL(iNumber);
        let imaginary = EngineeringFunctions.IMAGINARY(iNumber);

        // look up imaginary unit
        let unit = iNumber.substring(iNumber.length - 1, iNumber.length);
        unit = (unit === 'i' || unit === 'j') ? unit : 'i';
        return EngineeringFunctions.COMPLEX(Math.log(Math.sqrt(Math.pow(real, 2) + Math.pow(imaginary, 2))), Math.atan(imaginary / real), unit);
    },

    IMLOG10: (iNumber) => {
        iNumber = H.accept(iNumber, Types.STRING);
        let real = EngineeringFunctions.IMREAL(iNumber);
        let imaginary = EngineeringFunctions.IMAGINARY(iNumber);
        // look up imaginary unit
        let unit = iNumber.substring(iNumber.length - 1, iNumber.length);
        unit = (unit === 'i' || unit === 'j') ? unit : 'i';
        let realInput = Math.log(Math.sqrt(Math.pow(real, 2) + Math.pow(imaginary, 2))) / Math.log(10);
        let imaginaryInput = Math.atan(imaginary / real) / Math.log(10);
        return EngineeringFunctions.COMPLEX(realInput, imaginaryInput, unit);
    },

    IMLOG2: (iNumber) => {
        iNumber = H.accept(iNumber, Types.STRING);
        let real = EngineeringFunctions.IMREAL(iNumber);
        let imaginary = EngineeringFunctions.IMAGINARY(iNumber);
        // look up imaginary unit
        let unit = iNumber.substring(iNumber.length - 1, iNumber.length);
        unit = (unit === 'i' || unit === 'j') ? unit : 'i';
        let realInput = Math.log(Math.sqrt(Math.pow(real, 2) + Math.pow(imaginary, 2))) / Math.log(2);
        let imaginaryInput = Math.atan(imaginary / real) / Math.log(2);
        return EngineeringFunctions.COMPLEX(realInput, imaginaryInput, unit);
    },

    IMPOWER: (iNumber, number) => {
        iNumber = H.accept(iNumber, Types.STRING);
        number = H.accept(number, Types.NUMBER);

        // look up imaginary unit
        let unit = iNumber.substring(iNumber.length - 1, iNumber.length);
        unit = (unit === 'i' || unit === 'j') ? unit : 'i';
        // calculate power of modules
        let p = Math.pow(EngineeringFunctions.IMABS(iNumber), number);
        // calculate argument
        let t = EngineeringFunctions.IMARGUMENT(iNumber);

        let real = p * Math.cos(number * t);
        let imaginary = p * Math.sin(number * t);
        return EngineeringFunctions.COMPLEX(real, imaginary, unit);
    },

    IMPRODUCT: (...params) => {
        let result = params[0];
        if (!params.length) {
            throw FormulaError.VALUE;
        }
        // loop on all numbers
        for (let i = 1; i < params.length; i++) {
            let a = EngineeringFunctions.IMREAL(result);
            let b = EngineeringFunctions.IMAGINARY(result);
            let c = EngineeringFunctions.IMREAL(result[i]);
            let d = EngineeringFunctions.IMAGINARY(result[i]);
            result = EngineeringFunctions.COMPLEX(a * c - b * d, a * d + b * c);
        }
        return result;
    },

    IMREAL: (iNumber) => {
        iNumber = H.accept(iNumber, Types.STRING);
        if (iNumber === 0 || iNumber === '0') {
            return 0;
        }
        // handle special cases
        if (['i', '+i', '1i', '+1i', '-i', '-1i', 'j', '+j', '1j', '+1j', '-j', '-1j'].indexOf(iNumber) >= 0) {
            return 0;
        }
        // look up sign
        let plusSign = iNumber.indexOf('+');
        let minusSign = iNumber.indexOf('-');
        if (plusSign === 0) {
            plusSign = iNumber.indexOf('+', 1);
        }
        if (minusSign === 0) {
            minusSign = iNumber.indexOf('-', 1);
        }
        // look up unit
        let unit = iNumber.substring(iNumber.length - 1, iNumber.length);
        let validUnit = (unit === 'i' || unit === 'j');

        if (plusSign >= 0 || minusSign >= 0) {
            if (!validUnit) {
                return FormulaError.NUM;
            }
            if (plusSign >= 0) {
                return Number(iNumber.substring(0, plusSign));
            } else {
                return Number(iNumber.substring(0, minusSign));
            }
        } else {
            if (validUnit) {
                return 0;
            } else {
                return Number(iNumber);   // should use Number instead if parseInt
            }
        }
    },

    IMSEC: (iNumber) => {
        iNumber = H.accept(iNumber, Types.STRING);
        if (iNumber === true || iNumber === false) {
            throw FormulaError.VALUE;
        }
        return EngineeringFunctions.IMDIV('1', EngineeringFunctions.IMCOS(iNumber));
    },

    IMSECH: (iNumber) => {
        iNumber = H.accept(iNumber, Types.STRING);
        if (iNumber === true || iNumber === false) {
            throw FormulaError.VALUE;
        }
        return EngineeringFunctions.IMDIV('1', EngineeringFunctions.IMCOSH(iNumber));
    },

    IMSIN: (iNumber) => {
        iNumber = H.accept(iNumber, Types.STRING);
        let real = EngineeringFunctions.IMREAL(iNumber);
        let imaginary = EngineeringFunctions.IMAGINARY(iNumber);
        // look up unit
        let unit = iNumber.substring(iNumber.length - 1, iNumber.length);
        unit = (unit === 'i' || unit === 'j') ? unit : 'i';

        let realInput = Math.sin(real) * (Math.exp(imaginary) + Math.exp(-imaginary)) / 2;
        let imaginaryInput = Math.cos(real) * (Math.exp(imaginary) - Math.exp(-imaginary)) / 2;
        return EngineeringFunctions.COMPLEX(realInput, imaginaryInput, unit);
    },

    IMSINH: (iNumber) => {
        iNumber = H.accept(iNumber, Types.STRING);
        let real = EngineeringFunctions.IMREAL(iNumber);
        let imaginary = EngineeringFunctions.IMAGINARY(iNumber);

        // look up unit
        let unit = iNumber.substring(iNumber.length - 1, iNumber.length);
        unit = (unit === 'i' || unit === 'j') ? unit : 'i';
        let realInput = Math.cos(imaginary) * (Math.exp(real) - Math.exp(-real)) / 2;
        let imaginaryInput = Math.sin(imaginary) * (Math.exp(real) + Math.exp(-real)) / 2;
        return EngineeringFunctions.COMPLEX(realInput, imaginaryInput, unit);
    },

    IMSQRT: (iNumber) => {
        iNumber = H.accept(iNumber, Types.STRING);
        // look up unit
        let unit = iNumber.substring(iNumber.length - 1, iNumber.length);
        unit = (unit === 'i' || unit === 'j') ? unit : 'i';
        // calculate the power of modulus
        let power = Math.sqrt(EngineeringFunctions.IMABS(iNumber));
        // calculate argument
        let argument = EngineeringFunctions.IMARGUMENT(iNumber);
        return EngineeringFunctions.COMPLEX(power * Math.cos(argument / 2), power * Math.sin(argument / 2), unit);
    },

    IMSUB: (iNumber1, iNumber2) => {
        iNumber1 = H.accept(iNumber1, Types.STRING);
        iNumber2 = H.accept(iNumber2, Types.STRING);
        let a = EngineeringFunctions.IMREAL(iNumber1);
        let b = EngineeringFunctions.IMAGINARY(iNumber1);
        let c = EngineeringFunctions.IMREAL(iNumber2);
        let d = EngineeringFunctions.IMAGINARY(iNumber2);
        let unit1 = iNumber1.substring(iNumber1.length - 1, iNumber1.length);
        let unit2 = iNumber2.substring(iNumber2.length - 1, iNumber2.length);
        let unit = 'i';
        if (unit1 === 'j' || unit2 === 'i') {
            unit = 'j'
        }
        return EngineeringFunctions.COMPLEX(a - c, b - d, unit);
    },

    IMSUM: (...params) => {
        if (!params.length) {
            throw FormulaError.VALUE;
        }
        let iNumber = params[0];
        let a = EngineeringFunctions.IMREAL(iNumber);
        let b = EngineeringFunctions.IMAGINARY(iNumber);
        for (let i = 0; i < params.length; i++) {
            let c = EngineeringFunctions.IMREAL(params[i]);
            let d = EngineeringFunctions.IMAGINARY(params[i]);
            iNumber = EngineeringFunctions.COMPLEX(a + c, b + d);
        }
        return iNumber;
    },

    IMTAN: (iNumber) => {
        iNumber = H.accept(iNumber, Types.STRING);
        if (iNumber === true || iNumber === false) {
            throw FormulaError.VALUE;
        }
        let unit = iNumber.substring(iNumber.length - 1, iNumber.length);
        unit = (unit === 'i' || unit === 'j') ? unit : 'i';
        return EngineeringFunctions.COMPLEX(EngineeringFunctions.IMSIN(iNumber), EngineeringFunctions.IMCOS(iNumber), unit);
    },

    OCT2BIN: (number, places) => {
        number = H.accept(number, Types.STRING);
        places = H.accept(places, Types.NUMBER, false);
        // if places is not an integer, it is truncated
        places = Math.floor(places);
        if (places < 0) {
            throw FormulaError.NUM;
        }
        if (number.length > 10) {
            throw FormulaError.NUM
        }
        // to check if the Oct number is negative
        let isNegative = (number.length === 10 && number.substring(0, 1) === '7');
        // convert OCT to DEC
        let toDecimal = isNegative ? parseInt(number, 8) - 1073741824 : parseInt(number, 8);
        if (toDecimal < -512 || toDecimal > 512) {
            return FormulaError.NUM;
        }

        // if number is negative, ignores places and return a 10-character binary number
        if (isNegative) {
            return '1' + TextFunctions.REPT('0', 9 - (512 + toDecimal).toString(2).length) + (512 + toDecimal).toString(2);
        }
        // convert DEC to BIN
        let result = toDecimal.toString(2);
        if (typeof places === 'undefined') {
            return result;
        }

        return (places >= result.length) ? TextFunctions.REPT('0', places - result.length) + result : FormulaError.NUM;
    },

    OCT2DEC: (number) => {
        number = H.accept(number, Types.STRING);
        // conver to DEC
        let result = parseInt(number, 8);
        return (result >= 536870912) ? result - 1073741824 : result;
    },

    OCT2HEX: (number, places) => {
        number = H.accept(number, Types.STRING);
        places = H.accept(places, Types.NUMBER, false);
        // if places is not an integer, it is truncated
        places = Math.floor(places);
        if (places < 0) {
            throw FormulaError.NUM;
        }
        if (number.length > 10) {
            throw FormulaError.NUM
        }

        // convert OCT to DEC
        let toDecimal = parseInt(number, 8);
        // if number is negative, ignores places and return a 10-character octal number.
        if (toDecimal >= 536870912) {
            return 'ff' + (toDecimal + 3221225472).toString(16);
        }

        // convert DEC to HEX
        let toHex = toDecimal.toString(16);
        if (typeof places === 'undefined') {
            return toHex;
        }

        return (places >= toHex.length) ? TextFunctions.REPT('0', places - toHex.length) + toHex : FormulaError.NUM;
    },
};

module.exports = EngineeringFunctions;

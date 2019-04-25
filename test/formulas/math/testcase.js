module.exports = {

    ABS: {
        'ABS(-1)': 1,
    },

    ARABIC: {
        'ARABIC("LVII")': 57,
        'ARABIC("")': 0,
        'ARABIC("LVIIA")': '#VALUE!',
    },

    BASE: {
        'BASE(7,2)': '111',
        'BASE(100,16)': '64',
        'BASE(15,2,10)': '0000001111',
        'BASE(2^53-1,36)': '2GOSA7PA2GV',

        'BASE(-1,2)': '#NUM!',
        'BASE(2^53-1,2)': '11111111111111111111111111111111111111111111111111111',
        'BASE(2^53,2)': '#NUM!',

        'BASE(7,1)': '#NUM!',
        'BASE(7,37)': '#NUM!',

        'BASE(7,2,-1)': '#NUM!',
        'BASE(7,2,0)': '111',
        'BASE(7,2,2)': '111',
        'BASE(7,2,5)': '00111',
    },

    CEILING: {
        'CEILING(2.5, 1)': 3,
        'CEILING(-2.5, -2)': -4,
        'CEILING(-2.5, 2)': -2,
        'CEILING(1.5, 0.1)': 1.5,
        'CEILING(0.234, 0.01)': 0.24,
        'CEILING(1.5, 0)': 0,
        'CEILING(2^1024, 1)': '#NUM!',
    },

    'CEILING.MATH': {
        'CEILING.MATH(24.3,5)': 25,
        'CEILING.MATH(6.7)': 7,
        'CEILING.MATH(-6.7)': -7,
        'CEILING.MATH(-8.1,2)': -8,
        'CEILING.MATH(-5.5,2,-1)': -6
    },

    'CEILING.PRECISE': {
        'CEILING.PRECISE(4.3)': 5,
        'CEILING.PRECISE(-4.3)': -4,
        'CEILING.PRECISE(4.3, 2)': 6,
        'CEILING.PRECISE(4.3,-2)': 6,
        'CEILING.PRECISE(-4.3,2)': -4,
        'CEILING.PRECISE(-4.3,-2)': -4,
    },

    COMBINE: {
        'COMBIN(8,2)': 28,
        'COMBIN(-1,2)': '#NUM!',
        'COMBIN(1,2)': '#NUM!',
        'COMBIN(1,-2)': '#NUM!',
    },

    COMBINA: {
        'COMBINA(4,3)': 20,
        'COMBINA(0,0)': 1,
        'COMBINA(1,0)': 1,
        'COMBINA(-1,2)': '#NUM!',
        'COMBINA(1,2)': 1,
        'COMBINA(1,-2)': '#NUM!',
    },

    DECIMAL: {
        'DECIMAL("FF",16)': 255,
        'DECIMAL("8000000000",16)': 549755813888,
        'DECIMAL(111,2)': 7,
        'DECIMAL("zap",36)': 45745,
        'DECIMAL("zap",2)': '#NUM!',
        'DECIMAL("zap",37)': '#NUM!',
        'DECIMAL("zap",1)': '#NUM!',
    },

    EVEN: {
        'EVEN(1.5)': 2,
        'EVEN(3)': 4,
        'EVEN(2)': 2,
        'EVEN(-1)': -2,
    },

    EXP: {
        'EXP(1)': 2.71828183
    },

    FACT: {
        'FACT(5)': 120,
        'FACT(150)': 5.7133839564458575e+262, // more accurate than excel...
        'FACT(150) + 1': 5.7133839564458575e+262 + 1, // memorization
        'FACT(1.9)': 1,
        'FACT(0)': 1,
        'FACT(-1)': '#NUM!',
        'FACT(1)': 1,
    },

    FACTDOUBLE: {
        'FACTDOUBLE(6)': 48,
        'FACTDOUBLE(6) + 1': 49, // memorization
        'FACTDOUBLE(7)': 105,
        'FACTDOUBLE(0)': 1,
        'FACTDOUBLE(-1)': 1,
        'FACTDOUBLE(-2)': '#NUM!',
        'FACTDOUBLE(1)': 1,
    },

    FLOOR: {
        'FLOOR(0,)': 0,
        'FLOOR(12,0)': 0,
        'FLOOR(3.7,2)': 2,
        'FLOOR(-2.5,-2)': -2,
        'FLOOR(-2.5,2)': -4,
        'FLOOR(2.5,-2)': '#NUM!',
        'FLOOR(1.58,0.1)': 1.5,
        'FLOOR(0.234,0.01)': 0.23,
        'FLOOR(-8.1,2)': -10,
    },

    'FLOOR.MATH': {
        'FLOOR.MATH(0)': 0,
        'FLOOR.MATH(12, 0)': 0,
        'FLOOR.MATH(24.3,5)': 20,
        'FLOOR.MATH(6.7)': 6,
        'FLOOR.MATH(-8.1,2)': -10,
        'FLOOR.MATH(-5.5,2,-1)': -4,
        'FLOOR.MATH(-5.5,2,1)': -4,
        'FLOOR.MATH(-5.5,2,)': -6,
        'FLOOR.MATH(-5.5,2)': -6,
        'FLOOR.MATH(-5.5,-2)': -6,
        'FLOOR.MATH(5.5,2)': 4,
        'FLOOR.MATH(5.5,-2)': 4,
        'FLOOR.MATH(24.3,-5)': 20,
        'FLOOR.MATH(-8.1,-2)': -10,
    },

    'FLOOR.PRECISE': {
        'FLOOR.PRECISE(-3.2,-1)': -4,
        'FLOOR.PRECISE(3.2, 1)': 3,
        'FLOOR.PRECISE(-3.2, 1)': -4,
        'FLOOR.PRECISE(3.2,-1)': 3,
        'FLOOR.PRECISE(3.2)': 3,
        'FLOOR.PRECISE(0)': 0,
        'FLOOR.PRECISE(3.2, 0)': 0,
    },

    GCD: {
        'GCD(5, 2)': 1,
        'GCD(24, 36)': 12,
        'GCD(7, 1)': 1,
        'GCD(5, 0)': 5,
        'GCD(123, 0)': 123,
        'GCD(128, 80, 44)': 4,
        'GCD(128, 80, 44,)': 4,
        'GCD(128, 80, 44, 2 ^ 53)': '#NUM!', // excel parse this as #NUM!
        'GCD("a")': '#VALUE!',
        'GCD(5, 2, (A1))': 1,
        'GCD(5, 2, A1:E1)': 1,
        'GCD(5, 2, (A1:E1))': 1,
        'GCD(5, 2, (A1, A2))': '#VALUE!', // does not support union
        'GCD(5, 2, {3, 7})': 1,
        'GCD(5, 2, {3, "7"})': 1,
        'GCD(5, 2, {3, "7a"})': '#VALUE!',
        'GCD(5, 2, {3, "7"}, TRUE)': '#VALUE!',
    },

    INT: {
        'INT(0)': 0,
        'INT(8.9)': 8,
        'INT(-8.9)': -9,
    },

    'ISO.CEILING': {
        'ISO.CEILING(4.3)': 5,
        'ISO.CEILING(-4.3)': -4,
        'ISO.CEILING(4.3, 2)': 6,
        'ISO.CEILING(4.3,-2)': 6,
        'ISO.CEILING(-4.3,2)': -4,
        'ISO.CEILING(-4.3,-2)': -4,
    },

    LCM: {
        'LCM("a")': '#VALUE!',
        'LCM(5, 2)': 10,
        'LCM(24, 36)': 72,
        'LCM(50,56,100)': 1400,
        'LCM(50,56,100,)': 1400,
        'LCM(128, 80, 44, 2 ^ 53)': '#NUM!', // excel parse this as #NUM!
        'LCM(5, 2, (A1))': 10,
        'LCM(5, 2, A1:E1)': 60,
        'LCM(5, 2, (A1:E1))': 60,
        'LCM(5, 2, (A1, A2))': '#VALUE!', // does not support union
        'LCM(5, 2, {3, 7})': 210,
        'LCM(5, 2, {3, "7"})': 210,
        'LCM(5, 2, {3, "7a"})': '#VALUE!',
        'LCM(5, 2, {3, "7"}, TRUE)': '#VALUE!',
    },

    LN: {
        'LN(86)': 4.454347296253507,
        'LN(EXP(1))': 1,
        'LN(EXP(3))': 3,
    },

    LOG: {
        'LOG(10)': 1,
        'LOG(8, 2)': 3,
        'LOG(86, EXP(1))': 4.454347296253507,
    },

    LOG10: {
        'LOG10(86)': 1.9344984512435677,
        'LOG10(10)': 1,
        'LOG10(100000)': 5,
        'LOG10(10^5)': 5,
    },

    MDETERM: {
        'MDETERM({3,6,1;1,1,0;3,10,2})': 1,
        'MDETERM({3,6;1,1})': -3,
        'MDETERM({6})': 6,
        'MDETERM({1,3,8,5;1,3,6,1})': '#VALUE!'
    },

    MMULT: {
        'MMULT({1,3;7,2}, {2,0;0,2})': 2,
        'MMULT({1,3;7,2;1,1}, {2,0;0,2})': '#VALUE!',
        'MMULT({1,3;"r",2}, {2,0;0,2})': '#VALUE!',
        'MMULT({1,3;7,2}, {2,0;"0",2})': '#VALUE!',
    },

    MOD: {
        'MOD(3, 2)': 1,
        'MOD(-3, 2)': 1,
        'MOD(3, -2)': -1,
        'MOD(-3, -2)': -1,
        'MOD(-3, 0)': '#DIV/0!'
    },

    MROUND: {
        'MROUND(10, 1)': 10,
        'MROUND(10, 3)': 9,
        'MROUND(10, 0)': 0,
        'MROUND(-10, -3)': -9,
        'MROUND(1.3, 0.2)': 1.4,
        'MROUND(5, -2)': '#NUM!',
        'MROUND(6.05,0.1)': 6.0, // same as excel, differ from google sheets
        'MROUND(7.05,0.1)': 7.1,
    },

    MULTINOMIAL: {
        'MULTINOMIAL({1,2}, E1, A1:D1)': 92626934400,
        'MULTINOMIAL(2, 3, 4)': 1260,
        'MULTINOMIAL(2, 3, -4)': '#NUM!',
    },

    MUNIT: {
        'MUNIT(1)': 1,
        'MUNIT(10)': 1,
    },

    ODD: {
        'ODD(0)': 1,
        'ODD(1.5)': 3,
        'ODD(3)': 3,
        'ODD(2)': 3,
        'ODD(-1)': -1,
        'ODD(-2)': -3,
    },

    PI: {
        'PI()': 3.14159265357989
    },

    POWER: {
        'POWER(5,2)': 25,
        'POWER(98.6,3.2)': 2401077.22206958000,
        'POWER(4,5/4)': 5.656854249,
    },

    PRODUCT: {
        'PRODUCT(1,2,3,4,5)': 120,
        'PRODUCT(1,2,3,4,5, "2")': 240,
        'PRODUCT(1,2,3,4,5, "2c")': 120,
        'PRODUCT(A1:E1)': 120,
        'PRODUCT((A1, B1:E1))': 120,
        'PRODUCT(1,2,3,4,5, A1, {1,2})': 240,
    },

    QUOTIENT: {
        'QUOTIENT(5, 2)': 2,
        'QUOTIENT(4.5, 3.1)': 1,
        'QUOTIENT(-10, 3)' : -3,
        'QUOTIENT(-10, -3)': 3,
    },

    RADIANS: {
        'RADIANS(270)': 4.71238898,
        'RADIANS(0)': 0,
    },

    RAND: {
        'RAND() > 0': 'TRUE',
    },

    RANDBETWEEN: {
        'RANDBETWEEN(-1,1) >= -1': 'TRUE',
    },

    ROMAN: {
        'ROMAN(499,0)': 'CDXCIX',
    },

    ROUND: {
        'ROUND(2.15, 0)': 2,
        'ROUND(2.15, 1)': 2.2,
        'ROUND(2.149, 1)': 2.1,
        'ROUND(-1.475, 2)': -1.48,
        'ROUND(21.5, -1)': 20,
        'ROUND(626.3,-3)': 1000,
        'ROUND(1.98, -1)': 0,
        'ROUND(-50.55,-2)': -100,
    },

    ROUNDDOWN: {
        'ROUNDDOWN(3.2, 0)': 3,
        'ROUNDDOWN(76.9,0)': 76,
        'ROUNDDOWN(3.14159, 3)': 3.141,
        'ROUNDDOWN(-3.14159, 1)': -3.1,
        'ROUNDDOWN(31415.92654, -2)': 31400
    },

    ROUNDUP: {
        'ROUNDUP(3.2,0)': 4,
        'ROUNDUP(76.9,0)': 77,
        'ROUNDUP(3.14159, 3)': 3.142,
        'ROUNDUP(-3.14159, 1)': -3.2,
        'ROUNDUP(31415.92654, -2)': 31500,
    },

    SERIESSUM: {
        'SERIESSUM(PI()/4,0,2,{1, -0.5, 0.041666667, -0.001388889})': 0.707103215,
        'SERIESSUM(PI()/4,0,2,{1, -0.5, 0.041666667, "12"})': '#VALUE!',
    },

    SIGN: {
        'SIGN(10)': 1,
        'SIGN(4-4)': 0,
        'SIGN(-0.00001)': -1,
    },

    SQRT: {
        'SQRT(16)': 4,
        'SQRT(-16)': '#NUM!',
        'SQRT(ABS(-16))': 4,
    },

    SQRTPI: {
        'SQRTPI(1)': 1.772453851,
        'SQRTPI(2)': 2.506628275,
        'SQRTPI(-1)': '#NUM!',
    },
    // TODO: Start from here.


    SUM: {
        'SUM(1,2,3)': 6,
        'SUM(A1:C1, C1:E1)': 18,
        'SUM((A1:C1, C1:E1))': 18,
        'SUM((A1:C1, C1:E1), A1)': 19,
        'SUM((A1:C1, C1:E1), A13)': 18,
        'SUM("1", {1})': 2,
        'SUM("1", {"1"})': 1,
        'SUM("1", {"1"},)': 1,
        'SUM("1", {"1"},TRUE)': 2,
    },

    SUMIF: {
        'SUMIF(A1:E1, ">1")': 14,
        'SUMIF(A2:A5,">160000",B2:B5)': 63000,
        'SUMIF(A2:A5,">160000")': 900000,
        'SUMIF(A2:A5,300000,B2:B5)': 21000,
        'SUMIF(A2:A5,">" & C2,B2:B5)': 49000,
        'SUMIF(A7:A12,"Fruits",C7:C12)': 2000,
        'SUMIF(A7:A12,"Vegetables",C7:C12)': 12000,
        'SUMIF(B7:B12,"*es",C7:C12)': 4300,
        'SUMIF(A7:A12,"",C7:C12)': 400,
        //The sum_range argument does not have to be the same size and shape as the range argument.
        // The actual cells that are added are determined by using the upper leftmost cell in the
        // sum_range argument as the beginning cell, and then including cells that correspond in size
        // and shape to the range argument. For example:
        'SUMIF(A7:A12,"",C7)': 400,
    },

    SUMPRODUCT: {
        'SUMPRODUCT({1,"12";7,2}, {2,1;5,2})': 41,
        'SUMPRODUCT({1,12;7,2}, {2,1;5,2})': 53,
    },

    SUMSQ: {
        'SUMSQ(3, 4)': 25,
        'SUMSQ(3, 4, A1)': 26,
        'SUMSQ(3, 4, A1, A13)': 26,
    },

    TRUNC: {
        'TRUNC(8.9)': 8,
        'TRUNC(-8.9)': -8,
        'TRUNC(0.45)': 0,
    }
};

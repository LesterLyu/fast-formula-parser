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
    // TODO: Start from here.


    SUM: {
        'SUM(1,2,3)': 6,
        'SUM(A1:C1, C1:E1)': 18,
        'SUM((A1:C1, C1:E1))': 18,
        'SUM((A1:C1, C1:E1), A1)': 19,
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
};

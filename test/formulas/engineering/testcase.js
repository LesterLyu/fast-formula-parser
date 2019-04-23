module.exports = {
    BESSELI: {
        'BESSELI("1.5", 1)': 0.981666428,
        'BESSELI(1.5, 1)': 0.981666428,
        'BESSELI(1.5, 1.9)': 0.981666428,
        'BESSELI(1.5, -1)': '#NUM!',
        'BESSELI(TRUE, 1)': '#VALUE!',
        'BESSELI("a", 1)': '#VALUE!',
        'BESSELI(1.5, {1,2})': 0.981666428,
    },

    BESSELJ: {
        'BESSELJ(1.9, 2)': 0.329925829,
        'BESSELJ(1.9, 2.9)': 0.329925829,
        'BESSELJ(1.9, -2.9)': '#NUM!',
        'BESSELJ(TRUE, 2)': '#VALUE!',
        'BESSELJ("a", 2)': '#VALUE!',
        'BESSELJ(1.9, {2,3})': 0.329925829,
    },

    BESSELK: {
        'BESSELK(1.5, 1)': 0.277387804,
        'BESSELK(1.5, 1.9)': 0.277387804,
        'BESSELK(1.5, -1)': '#NUM!',
        'BESSELK(TRUE, 1)': '#VALUE!',
        'BESSELK("a", 1)': '#VALUE!',
        'BESSELK(1.5, {1,2})': 0.277387804,
    },

    BESSELY: {
        'BESSELY("2.5", 1)': 0.145918138,
        'BESSELY(2.5, 1)': 0.145918138,
        'BESSELY(2.5, 1.9)': 0.145918138,
        'BESSELY(2.5, -1)': '#NUM!',
        'BESSELY(TRUE, 1)': '#VALUE!',
        'BESSELY("a", 1)': '#VALUE!',
        'BESSELY(2.5, {1,2})': 0.145918138,
    },

    BIN2DEC:{
        'BIN2DEC(1100100)' : 100,
        'BIN2DEC(1111111111)' : -1,
        'BIN2DEC(11001001001101)' : "#NUM!",  // contain more than 10 characters
        'BIN2DEC(110010023145)' : "#NUM!",     // not a valid binary number
        'BIN2DEC(TRUE)' : "#VALUE!",
        'BIN2DEC(FALSE)' : "#VALUE!",
        'BIN2DEC({1100100})' : 100,
    },

    BIN2HEX:{
        'BIN2HEX(11111011)' : "FB",
        'BIN2HEX(11111011,4)' : "00FB",
        'BIN2HEX("11111011",4)' : "00FB",
        'BIN2HEX("11111011",-4)' : "#NUM!",
        'BIN2HEX(11111011,"4")' : "00FB",
        'BIN2HEX(11111011,1)' : "#NUM!",
        'BIN2HEX(11111011,10)' : "00000000FB",
        'BIN2HEX(11111011,3)' : "0FB",
        'BIN2HEX(11111011,2)' : "FB",
        'BIN2HEX(1110)' : "E",
        'BIN2HEX(1111111111)' : "FFFFFFFFFF",
        'BIN2HEX(1111111111,7)' : "FFFFFFFFFF",
        'BIN2HEX(1111111111,{1})' : "FFFFFFFFFF",
        'BIN2HEX(TRUE,2)' : "#VALUE!",
        'BIN2HEX(TRUE,3)' : "#VALUE!",
    },

    BIN2OCT:{
        // 'BIN2OCT(1001,3)' : "011",
        // 'BIN2OCT("1001",3)' : "011",
        // 'BIN2OCT(1001,"3")' : "011",
        'BIN2OCT(1100100)' : "144",
        'BIN2OCT({1100100})' : "144",
        'BIN2OCT(TRUE)' : "#VALUE!",
        'BIN2OCT(FALSE)' : "#VALUE!",
        'BIN2OCT(1111111111)' : "7777777777",
    },

    BITAND:{
        'BITAND(1,5)' : 1,
        'BITAND(13,25)' : 9,
        'BITAND({13},25)' : 9,
        'BITAND(13,{25})' : 9,
        'BITAND("13","25")' : 9,
        'BITAND(-11,5)' : "#NUM!",
        'BITAND(1,-5)' : "#NUM!",
        'BITAND(-1,-5)' : "#NUM!",
        'BITAND(19,281474976710659)' : "#NUM!",
        'BITAND(281484976720655,5)' : "#NUM!",
        'BITAND(TRUE,5)' : 1,
        'BITAND(1,FALSE)' : 0,
        'BITAND(TRUE,FALSE)' : 0,
        'BITAND("TRUE",7)' : "#VALUE!",
    },

    BITLSHIFT:{
        'BITLSHIFT(4,2)' : 16,
        'BITLSHIFT(-4,2)' : "#NUM!",
        'BITLSHIFT(4,-2)' : 1,
        'BITLSHIFT(9,-3)' : 1,
        'BITLSHIFT(4.1,2)' : "#NUM!",
        'BITLSHIFT(4,2.4)' : "#NUM!",
        'BITLSHIFT(281494976710655,2)' : "#NUM!",
        'BITLSHIFT(7,-54)' : "#NUM!",
        'BITLSHIFT(3,58)' : "#NUM!",
    },

    BITOR:{
        'BITOR(23,10)' : 31,
        'BITOR(5,3)' : 7,
        'BITOR(-5,10)' : "#NUM!",
        'BITOR(3,-1)' : "#NUM!",
        'BITOR(2.2,3)' : "#NUM!",
        'BITOR(3, 5.1)' : "#NUM!",
        'BITOR(281674976710655,10)' : "#NUM!",
        'BITOR(17,281474976710656)' : "#NUM!",
        'BITOR(TRUE,4)' : 5,
        'BITOR(60,FALSE)' : 60,
    },

    BITRSHIFT:{
        // 'BITRSHIFT(13,2)' : 3,
        // 'BITRSHIFT(13.9,2)' : "#NUM!",
        // 'BITRSHIFT(13,2.7)' : "#NUM!",
        // 'BITRSHIFT(281474976720655,2)' : "#NUM!",
        // //'BITRSHIFT(13,-42)' : 5.71746E+13,
        // 'BITRSHIFT(13,-62)' : "#NUM!",
        // 'BITRSHIFT(24,3)' : 3,
        'BITRSHIFT(9999999999,31)' : 4,
        'BITRSHIFT(9999999999,22.5)' : 2384,
        'BITRSHIFT(999999999,31)' : 0,
        'BITRSHIFT(9999999999,-50)' : 0,
        'BITRSHIFT(13,-44)' : 52
    },

    BITXOR:{
        'BITXOR(5,3)' : 6,
        'BITXOR(24,3)' : 27,
        'BITXOR(5.5,3)' : "#NUM!",
        'BITXOR(5,3.2)' : "#NUM!",
        'BITXOR(-5,3)' : "#NUM!",
        'BITXOR(5,-3)' : "#NUM!",
        'BITXOR(281474976710658,3)' : "#NUM!",
        'BITXOR(5,281474976710656)' : "#NUM!",
    },

    COMPLEX:{
        'COMPLEX(3,4)' : "3+4i",
        'COMPLEX(3,-4)' : "3-4i",
        'COMPLEX(3,4,"j")' : "3+4j",
        'COMPLEX(0,1)' : "i",
        'COMPLEX(0,-1)' : "-i",
        'COMPLEX(52,-1)' : "52-i",
        'COMPLEX(1,0)' : "1",
        'COMPLEX(3,4,"z")' : "#VALUE!",
        'COMPLEX(0,4,"j")' : "4j",
        'COMPLEX(70,0,"j")' : "70",
        'COMPLEX(TRUE,4,"j")' : "#VALUE!",
        'COMPLEX(3,FALSE,"j")' : "#VALUE!",
    },

    CONVERT:{

    },

    DEC2BIN:{
        'DEC2BIN(9,4)' : "1001",
        'DEC2BIN(9,4)' : "1001",
        'DEC2BIN(9,4)' : "1001",
        'DEC2BIN(9,4)' : "1001",
        'DEC2BIN(-100)' : "1110011100",
    },

    DEC2HEX:{
        'DEC2HEX(100,4)' : "0064",
        'DEC2HEX(-54)' : "FFFFFFFFCA",
        'DEC2HEX(28)' : "1C",
        'DEC2HEX(64,1)' : "#NUM!",
    },
    DEC2OCT:{
        'DEC2OCT(58,3)' : "072",
        'DEC2OCT(-100)' : "7777777634",
    },

    DELTA:{
        'DELTA(5,4)' : 0,
        'DELTA(5,5)' : 1,
        'DELTA(0.5,0)' : 0,
        'DELTA(5)' : 0,
        'DELTA(0)' : 1,
        'DELTA(TRUE,5)' : "#VALUE!",
        'DELTA(TRUE,)' : "#VALUE!",
        'DELTA(5,FALSE)' : "#VALUE!",
        'DELTA(5,"5")' : 1,
        'DELTA("1",1)' : 1,
    },

    ERF:{
        'ERF(0.745)' : 0.70792892,
        'ERF(1)' : 0.84270079,
        'ERF(TRUE)' : "#VALUE!",
    },

    ERFC:{
        'ERFC(1)' : 0.15729921,
        'ERFC(FALSE)' : "#VALUE!"
    },

    GESTEP:{
        'GESTEP(5,4)' : 1,
        'GESTEP(5,5)' : 1,
        'GESTEP(-4,-5)' : 1,
        'GESTEP(-1)' : 0,
        'GESTEP(0)' : 1,
        'GESTEP(1,TRUE)' : "#VALUE!",
        'GESTEP(5,"3")' : 1,
    },

    HEX2BIN:{
        'HEX2BIN("F",8)' : "00001111",
        'HEX2BIN("B7")' : "10110111",
        'HEX2BIN("FFFFFFFFFF")' : "1111111111",
    },

    HEX2DEC:{
        'HEX2DEC("A5")' : 165,
        'HEX2DEC("FFFFFFFF5B")' : -165,
        'HEX2DEC("3DA408B9")' : 1.034E+09,
    },

    HEX2OCT:{
        'HEX2OCT("F",3)' : "017",
        'HEX2OCT("3B4E")' : "35516",
        'HEX2OCT("FFFFFFFF00")' : 7777777400,
    },

    IMABS:{
        'IMABS("5+12i")' : 13,
        'IMABS("52+60i")' : 79.397732965,
        'IMABS("-24-72i")' : 75.89466384,
        'IMABS("3+4z")' : "#NUM!",
        'IMABS("3+4j")' : 5,
    },

    IMAGINARY:{
        'IMAGINARY("3+4i")' :4,
        'IMAGINARY("3+4z")' :"#NUM!",
        'IMAGINARY("0-j")' :-1,
        'IMAGINARY("4")' :0,
        'IMAGINARY("3+i")' :1,
        'IMAGINARY("j")' :1,
        'IMAGINARY("-i")' :-1,
    },

    IMARGUMENT:{
        'IMARGUMENT("3+4i")' : 0.92729522,
        'IMARGUMENT("5i")' : 1.570796327,
        'IMARGUMENT("52")' : 0,
        'IMARGUMENT("13+14z")' : "#NUM!",
    },

    IMCONJUGATE:{
        'IMCONJUGATE("3+4i")' : "3-4i",
        'IMCONJUGATE("3-4i")' : "3+4i",
        'IMCONJUGATE("3+4z")' : "#NUM!",
        'IMCONJUGATE("i")' : "-i",
        'IMCONJUGATE("-j")' : "j",
        'IMCONJUGATE("3")' : "3",
    },

    IMCOS:{
        'IMCOS(1)' : "0.5403023058681398",
        'IMCOS("1+i")' : "0.8337300251311491-0.9888977057628651i",
    },

    IMCOSH:{

    },

    IMCOT:{

    },

    IMCSC:{

    },

    IMCSCH:{

    },

    IMDIV:{

    },

    IMEXP:{

    },

    IMLN:{

    },

    IMLOG10:{

    },

    IMLOG2:{

    },

    IMPOWER:{

    },

    IMPRODUCT:{

    },

    IMREAL:{
        'IMREAL("6-9i")' : 6,
        'IMREAL("+1i")' : 0,
        'IMREAL("-j")' : 0,
        'IMREAL("+i")' : 0,
        'IMREAL("6+9k")' : "#NUM!",
        'IMREAL("52")' : 52,
        'IMREAL("j")' : 0,
        'IMREAL("J")' : "#VALUE!",
        'IMREAL("5.2-9i")' : 5.2,
        'IMREAL("5.222-10i")' : 5.222,
        'IMREAL("{5-9j}")' : "#NUM!"
    },

    IMSEC:{

    },

    IMSECH:{

    },

    IMSIN:{

    },

    IMSINH:{

    },

    IMSQRT:{

    },

    IMSUB:{

    },

    IMSUM:{

    },

    IMTAN:{

    },

    OCT2BIN:{

    },

    OCT2DEC:{

    },

    OCT2HEX:{

    },
};

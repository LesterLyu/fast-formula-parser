const FormulaError = require('../../../formulas/error');
module.exports = {

    ASC: {
        'ASC("ＡＢＣ")': "ABC",
        'ASC("ヲァィゥ")': 'ｦｧｨｩ',
        'ASC("，。")': ',｡',
    },

    BAHTTEXT: {
        'BAHTTEXT(63147.89)': 'หกหมื่นสามพันหนึ่งร้อยสี่สิบเจ็ดบาทแปดสิบเก้าสตางค์',
        'BAHTTEXT(1234)': 'หนึ่งพันสองร้อยสามสิบสี่บาทถ้วน',
    },

    CHAR: {
        'CHAR(65)': 'A',
        'CHAR(33)': '!',
    },

    CLEAN: {
        'CLEAN("äÄçÇéÉêPHP-MySQLöÖÐþúÚ")': "äÄçÇéÉêPHP-MySQLöÖÐþúÚ",
        'CLEAN(CHAR(9)&"Monthly report"&CHAR(10))': 'Monthly report',
    },

    CODE: {
        'CODE("C")': 67,
        'CODE("")': FormulaError.VALUE,
    },

    CONCAT: {
        'CONCAT(0, {1,2,3;5,6,7})': '0123567',
        'CONCAT(TRUE, 0, {1,2,3;5,6,7})': 'TRUE0123567',
        'CONCAT(0, {1,2,3;5,6,7},)': '0123567',
        'CONCAT("The"," ","sun"," ","will"," ","come"," ","up"," ","tomorrow.")': 'The sun will come up tomorrow.',
        'CONCAT({1,2,3}, "aaa", TRUE, 0, FALSE)': '123aaaTRUE0FALSE',
        'CONCAT({1,2,3}, "aaa", TRUE, 0, FALSE)': '123aaaTRUE0FALSE',
        'CONCAT("[","]")': "[]"
    },

    CONCATENATE: {
        'CONCATENATE({9,8,7})': '9',
        'CONCATENATE({9,8,7},{8,7,6})': '98',
        'CONCATENATE({9,8,7},"hello")': '9hello',
        'CONCATENATE({0,2,3}, 1, "A", TRUE, -12)': '01ATRUE-12',
    },

    SUBSTITUTE: {
        'SUBSTITUTE("JOHN", "J", "H")': "HOHN",
        //'SUBSTITUTE("quotes","","\]")': "HI"
        'SUBSTITUTE("JOHN", "J", "H", 1)': "HOHN",
        'SUBSTITUTE("bbbbb", "b", "i", 3)': "bbibb",
        'SUBSTITUTE("]]]", "]", "l", 1)': "l]]",
        'SUBSTITUTE("]]]", "]", "l", 12)': "]]]",
        'SUBSTITUTE("Sales Data", "Sales", "Cost")': "Cost Data",
        'SUBSTITUTE("Quarter 1, 2008", "1", "2", 1)': 'Quarter 2, 2008',
        'SUBSTITUTE("Quarter 1, 2011", "1", "2", 3)': 'Quarter 1, 2012'
    },

    DBCS: {
        'DBCS("ABC")': "ＡＢＣ",
        'DBCS("ｦｧｨｩ")': 'ヲァィゥ',
        'DBCS(",｡")': '，。',
    },

    DOLLAR: {
        'DOLLAR(1234567)': "$1,234,567.00",
        'DOLLAR(12345.67)': "$12,345.67"
    },

    EXACT: {
        'EXACT("hello", "hElLo")': false,
        'EXACT("HELLO","HELLO")': true
    },

    FIND: {
        'FIND("h","Hello")': FormulaError.VALUE,
        'FIND("o", "hello")': 5
    },

    FIXED: {
        'FIXED(1234.567, 1)': '1,234.6',
        'FIXED(12345.64123213)': '12,345.64',
        'FIXED(12345.64123213, 5)': '12,345.64123',
        'FIXED(12345.64123213, 5, TRUE)': '12345.64123',
        'FIXED(123456789.64, 5, FALSE)': '123,456,789.64000'
    },

    LEFT: {
        'LEFT("Salesman")': "S",
        'LEFT("Salesman",4)': "Sale"
    },

    RIGHT: {
        'RIGHT("Salseman",3)': "man",
        'RIGHT("Salseman")': "n"
    },

    LEN: {
        'LEN("Phoenix, AZ")': 11,
    },

    LOWER: {
        'LOWER("E. E. Cummings")': "e. e. cummings"
    },

    MID: {
        'MID("Fluid Flow",1,5)': "Fluid",
        'MID("Foo",5,1)': "",
        'MID("Foo",1,5)': "Foo",
        'MID("Foo",-1,5)': FormulaError.VALUE,
        'MID("Foo",1,-5)': FormulaError.VALUE
    },

    NUMBERVALUE: {
        'NUMBERVALUE("2.500,27",",",".")': 2500.27,
        // group separator occurs before the decimal separator
        'NUMBERVALUE("2500.,27",",",".")': 2500.27,
        'NUMBERVALUE("3.5%")': 0.035,
        'NUMBERVALUE("3 50")': 350,
        'NUMBERVALUE("$3 50")': 350,
        'NUMBERVALUE("($3 50)")': -350,
        'NUMBERVALUE("-($3 50)")': FormulaError.VALUE,
        'NUMBERVALUE("($-3 50)")': FormulaError.VALUE,
        'NUMBERVALUE("2500,.27",",",".")': FormulaError.VALUE,
        // group separator occurs after the decimal separator
        'NUMBERVALUE("3.5%",".",".")': FormulaError.VALUE,
        'NUMBERVALUE("3.5%",,)': FormulaError.VALUE,
        // decimal separator is used more than once
        'NUMBERVALUE("3..5")': FormulaError.VALUE,

    },

    PROPER: {
        'PROPER("this is a tiTle")': "This Is A Title",
        'PROPER("2-way street")': "2-Way Street",
        'PROPER("76BudGet")': '76Budget',
    },

    REPLACE: {
        'REPLACE("abcdefghijk",6,5,"*")': "abcde*k",
        'REPLACE("abcdefghijk",6,0,"*")': "abcde*fghijk"
    },

    REPT: {
        'REPT("*_",4)': "*_*_*_*_"
    },

    SEARCH: {
        'SEARCH(",", "abcdef")': FormulaError.VALUE,
        'SEARCH("b", "abcdef")': 2,
        'SEARCH("c*f", "abcdef")': 3,
        'SEARCH("c?f", "abcdef")': FormulaError.VALUE,
        'SEARCH("c?e", "abcdef")': 3,
        'SEARCH("c\\b", "abcabcac\\bacb", 6)': 8,
    },
    SPLIT: {        
        //Basic tests
        'CONCAT(SPLIT("1,2,3", ","))': "123",        
        'CONCAT(SPLIT("2w2w3", "w"))' : "223",
        'CONCAT(SPLIT("3ww2ww3", "w"))' : "323",
        'CONCAT(SPLIT("4ww2ww3", "w"))' : "423",
        //Checks if special characters still work
        'CONCAT(SPLIT("5?2?3", "?"))' : "523",
        'CONCAT(SPLIT("6?l2?3", "?"))' : "6l23",
        'CONCAT(SPLIT("7?^?2?3", "?"))' : "7^23",
        'CONCAT(SPLIT("8?$?2?3", "?"))' : "8$23",
        'CONCAT(SPLIT("9?*?2?3", "?"))' : "9*23",
        'CONCAT(SPLIT("10?+?2?3", "?"))' : "10+23",
        'CONCAT(SPLIT("11?+?2?3", "?"))' : "11+23",
        'CONCAT(SPLIT("12ww.ww3", "w"))' : "12.3",
        'CONCAT(SPLIT("13ww(ww3", "w"))' : "13(3",
        'CONCAT(SPLIT("14ww)ww3", "w"))' : "14)3",
        'CONCAT(SPLIT("15ww|ww3", "w"))' : "15|3",
        'CONCAT(SPLIT("16ww{ww3", "w"))' : "16{3",
        'CONCAT(SPLIT("17ww}ww3", "w"))' : "17}3",
        'CONCAT(SPLIT("18ww[ww3", "w"))' : "18[3",
        //More complected tests        
        'CONCAT(SPLIT("19ww]ww3", "ww", FALSE))' : "19]3",
        'CONCAT(SPLIT("20hih bob hih3", "hih"))' : "20 bob 3",
        'CONCAT(SPLIT("21ww2ww3", "wd", TRUE, FALSE))' : "2123",
        'CONCAT(SPLIT("22wwww2wwww3", "ww", FALSE, FALSE))' : "2223",
        'CONCAT(SPLIT("2w6,t.l/3", "w,./"))': "26tl3",
        //Checks if remove empty works properly
        'CONCAT(SPLIT("qwqwqwqwqwqwqw", "w", TRUE, TRUE))' : "qqqqqqq",
        'CONCAT(SPLIT("qwqwqwqwqwqwqw", "w", FALSE, TRUE))' : "qqqqqqq",
        'CONCAT(SPLIT("qwqwqwqwqwqwqw", "w", TRUE, FALSE))' : "qqqqqqq",
        'CONCAT(SPLIT("qwqwqwqwqwqwqw", "w", FALSE, FALSE))' : "qqqqqqq",
        'CONCAT(SPLIT("qwwqwwqwwqwwqwwqwwqww", "w", TRUE, TRUE))': "qqqqqqq",
        'CONCAT(SPLIT("qwwqwwqwwqwwqwwqwwqww", "w", FALSE, TRUE))': "qqqqqqq",
        'CONCAT(SPLIT("qwwqwwqwwqwwqwwqwwqww", "w", TRUE, FALSE))': "qqqqqqq",
        'CONCAT(SPLIT("qwwqwwqwwqwwqwwqwwqww", "w", FALSE, FALSE))': "qqqqqqq",
        //Checks that the split function is case senstitive
        'CONCAT(SPLIT("RwwRwwR", "WW", TRUE, TRUE))' : "RwwRwwR",
        'CONCAT(SPLIT("RwwRwwR", "WW", FALSE, TRUE))' : "RwwRwwR",
        'CONCAT(SPLIT("RwwRwwR", "WW", TRUE, FALSE))' : "RwwRwwR",
        'CONCAT(SPLIT("RwwRwwR", "WW", FALSE, FALSE))' : "RwwRwwR",
        //Checks if split by each works correctly
        'CONCAT(SPLIT("RwwRwwR", "ww", TRUE, TRUE))' : "RRR",
        'CONCAT(SPLIT("RwwRwwR", "ww", FALSE, TRUE))' : "RRR",
        'CONCAT(SPLIT("RwwRwwR", "ww", TRUE, FALSE))' : "RRR",
        'CONCAT(SPLIT("RwwRwwR", "ww", FALSE, FALSE))' : "RRR",
        'CONCAT(SPLIT("RwqRwqR", "wq", TRUE, TRUE))': "RRR",
        'CONCAT(SPLIT("RwqRwqR", "wq", FALSE, TRUE))': "RRR",
        'CONCAT(SPLIT("RwqRwqR", "wq", TRUE, FALSE))': "RRR",
        'CONCAT(SPLIT("RwqRwqR", "wq", FALSE, FALSE))': "RRR"
    },


    T: {
        'T("*_")': "*_",
        'T(19)': "",
    },

    TEXT: {
        'TEXT(1234.567,"$#,##0.00")': "$1,234.57",
    },

    TRIM: {
        'TRIM("     First Quarter Earnings    ")': "First Quarter Earnings"
    },

    UNICHAR: {
        'UNICHAR(32)': " ",
        'UNICHAR(66)': "B",
        'UNICHAR(0)': FormulaError.VALUE,
        'UNICHAR(3333)': 'അ',
    },

    UNICODE: {
        'UNICODE(" ")': 32,
        'UNICODE("B")': 66,
        'UNICODE("")': FormulaError.VALUE,
    }

};

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
        'CODE("C")': 67
    },

    CONCAT: {
        'CONCAT(0, {1,2,3;5,6,7})': '0123567',
        'CONCAT(TRUE, 0, {1,2,3;5,6,7})': 'TRUE0123567',
        'CONCAT(0, {1,2,3;5,6,7},)': '0123567',
        'CONCAT("The"," ","sun"," ","will"," ","come"," ","up"," ","tomorrow.")': 'The sun will come up tomorrow.',
        'CONCAT({1,2,3}, "aaa", TRUE, 0, FALSE)': '123aaaTRUE0FALSE'
    },

    CONCATENATE: {
        'CONCATENATE({9,8,7})': '9',
        'CONCATENATE({9,8,7},{8,7,6})': '98',
        'CONCATENATE({9,8,7},"hello")': '9hello',
        'CONCATENATE({0,2,3}, 1, "A", TRUE, -12)': '01ATRUE-12',
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
        'EXACT("hello", "hElLo")': "FALSE",
        'EXACT("HELLO","HELLO")': "TRUE"
    },

    FIND: {
        'FIND("h","Hello")': "#VALUE!",
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
        'MID("Fluid Flow",1,5)': "Fluid"
    },

    PROPER: {
        'PROPER("this is a tiTle")': "This Is A TiTle"
    },

    REPLACE: {
        'REPLACE("abcdefghijk",6,5,"*")': "abcde*k",
        'REPLACE("abcdefghijk",6,0,"*")': "abcde*fghijk"
    },

    REPT: {
        'REPT("*_",4)': "*_*_*_*_"
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
        'UNICHAR(32)': "#",
    },
};

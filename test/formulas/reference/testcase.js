const FormulaError = require('../../../formulas/error');
module.exports = {
    ADDRESS: {
        'ADDRESS(2,3)': '$C$2',
        'ADDRESS(2,3, 1)': '$C$2',
        'ADDRESS(2,3,2)': 'C$2',
        'ADDRESS(2,3,3)': '$C2',
        'ADDRESS(2,3,4, TRUE)': 'C2',
        'ADDRESS(2,3,2,FALSE)': 'R2C[3]',
        'ADDRESS(2,3,1,FALSE,"[Book1]Sheet1")': "'[Book1]Sheet1'!R2C3",
        'ADDRESS(2,3,1,FALSE,"EXCEL SHEET")': "'EXCEL SHEET'!R2C3",
        'ADDRESS(2,3,4, 2, "abc")': 'abc!C2',
    },

    AREAS: {
        'AREAS(B2:D4)': 1,
        'AREAS((B2:D4,E5,F6:I9))': 3,
        'AREAS(B2:D4 B2)': 1,
    },

    COLUMN: {
        'COLUMN()': 1,
        'COLUMN(C3)': 3,
        'COLUMN(C3:V6)': 3,
        'COLUMN(123)': FormulaError.VALUE,
        'COLUMN({1,2,3})': FormulaError.VALUE,
        'COLUMN("A1")': FormulaError.VALUE
    },

    COLUMNS: {
        'COLUMNS(A1)': 1,
        'COLUMNS(A1:C5)': 3,
        'COLUMNS(123)': FormulaError.VALUE,
        'COLUMNS({1,2,3})': FormulaError.VALUE,
        'COLUMNS("A1")': FormulaError.VALUE
    },
    FILTER: {
        //Question @TYLER
        //Not sure how to test this, b/c its supposed to return an array, but the test cases are only returning the first 
        //values in the arrays my FILTER filters
        //e.g. line 48 simplifies the entire array to just 'Apples'

        'FILTER(A2,123,A1:A9, "hi")' : FormulaError.VALUE,
        'FILTER(A2,A1:E9,124, "hi")' : FormulaError.VALUE,
        'FILTER(A2,A1:E8,A1:A9, "hi")' : FormulaError.VALUE,
        'FILTER(A2,A1:E9,A1:A8, "hi")' : FormulaError.VALUE,
        'FILTER(A2,A1:E9,A1:A9, "hi")' : 'Apples',
        'FILTER(A2,A1:E12,A1:A12, "hi")' : [['Apples', 0.69, 40, 5, 6], ['Apples', 'Lemons',0, 0, 0]],
        'FILTER(0,A1:E12,E1:E12, "hi")' : [['Apples', 'Lemons',0, 0, 0],['Bananas', 'Pears', 0, 0, 0]],
        'FILTER(B2,A1:E9,A1:A9, "hi")' : "hi"
    },

    HLOOKUP: {
        'HLOOKUP(3, {1,2,3,4,5}, 1)': 3,
        'HLOOKUP(3, {3,2,1}, 1)': 1,
        'HLOOKUP(3, {1,2,3,4,5}, 2)': FormulaError.REF,
        'HLOOKUP("a", {1,2,3,4,5}, 1)': FormulaError.NA,
        'HLOOKUP(3, {1.1,2.2,3.3,4.4,5.5}, 1)': 2.2,
        // should handle like Excel.
        'HLOOKUP(63, {"c",FALSE,"abc",65,63,61,"b","a",FALSE,TRUE}, 1)': 63,
        'HLOOKUP(TRUE, {"c",FALSE,"abc",65,63,61,"b","a",FALSE,TRUE}, 1)': true,
        'HLOOKUP(FALSE, {"c",FALSE,"abc",65,63,61,"b","a",FALSE,TRUE}, 1)': false,
        'HLOOKUP(FALSE, {"c",TRUE,"abc",65,63,61,"b","a",TRUE,FALSE}, 1)': FormulaError.NA,
        'HLOOKUP("c", {"c",TRUE,"abc",65,63,61,"b","a",TRUE,FALSE}, 1)': 'a',
        'HLOOKUP("b", {"c",TRUE,"abc",65,63,61,"b","a",TRUE,FALSE}, 1)': 'b',
        'HLOOKUP("abc", {"c",TRUE,"abc",65,63,61,"b","a",TRUE,FALSE}, 1)': 'abc',
        'HLOOKUP("a", {"c",TRUE,"abc",65,63,61,"b","a",TRUE,FALSE}, 1)': FormulaError.NA,
        'HLOOKUP("a*", {"c",TRUE,"abc",65,63,61,"b","a",TRUE,FALSE}, 1)': FormulaError.NA,
        // with rangeLookup = FALSE
        'HLOOKUP(3, 3, 1,FALSE)': FormulaError.NA,
        'HLOOKUP(3, {1,2,3}, 1,FALSE)': 3,
        'HLOOKUP("a", {1,2,3,"a","b"}, 1,FALSE)': 'a',
        'HLOOKUP(3, {1,2,3;"a","b","c"}, 2,FALSE)': 'c',
        'HLOOKUP(6, {1,2,3;"a","b","c"}, 2,FALSE)': FormulaError.NA,
        // wildcard support
        'HLOOKUP("s?", {"abc", "sd", "qwe"}, 1,FALSE)': 'sd',
        'HLOOKUP("*e", {"abc", "sd", "qwe"}, 1,FALSE)': 'qwe',
        'HLOOKUP("*e?2?", {"abc", "sd", "qwe123"}, 1,FALSE)': 'qwe123',
        // case insensitive
        'HLOOKUP("a*", {"c",TRUE,"AbC",65,63,61,"b","a",TRUE,FALSE}, 1, FALSE)': 'AbC',
        // single row table
        'HLOOKUP(614, { 614;"Foobar"}, 2)': 'Foobar'
    },

    INDEX: {
        'INDEX(A11:B12,2,2)': 'Pears',
        'INDEX(A11:B12,2,1)': 'Bananas',
        'INDEX({1,2;3,4},1,2)': 2,
        'INDEX(A2:C6, 2, 3)': 38,
        'INDEX((A1:C6, A8:C11), 2, 2, 2)': 1.25,

        'SUM(INDEX(A1:C11, 0, 3, 1))': 216,
        'SUM(INDEX(A1:E11, 1, 0, 1))': 9,
        'SUM(INDEX(A1:E11, 1, 0, 2))': FormulaError.REF,
        'SUM(B2:INDEX(A2:C6, 5, 2))': 2.42,
        'SUM(B2:IF(TRUE, INDEX(A2:C6, 5, 2)))': 2.42,
        'SUM(INDEX(D1:E2, 0, 0, 1))': 20,
    },

    ROW: {
        'ROW()': 1,
        'ROW(C4)': 4,
        'ROW(C4:V6)': 4,
        'ROW(123)': FormulaError.VALUE,
        'ROW({1,2,3})': FormulaError.VALUE,
        'ROW("A1")': FormulaError.VALUE
    },

    ROWS: {
        'ROWS(A1)': 1,
        'ROWS(A1:C5)': 5,
        'ROWS(123)': FormulaError.VALUE,
        'ROWS({1,2,3})': FormulaError.VALUE,
        'ROWS("A1")': FormulaError.VALUE
    },

    TRANSPOSE: {
        // this should be good, lol
        'SUM(TRANSPOSE({1,2,3;4,5,6}))': 21,
    },

    VLOOKUP: {
        'VLOOKUP(3, {1;2;3;4;5}, 1)': 3,
        'VLOOKUP(3, {3;2;1}, 1)': 1,
        'VLOOKUP(3, {1;2;3;4;5}, 2)': FormulaError.REF,
        'VLOOKUP("a", {1;2;3;4;5}, 1)': FormulaError.NA,
        'VLOOKUP(3, {1.1;2.2;3.3;4.4;5.5}, 1)': 2.2,
        // should handle like Excel.
        'VLOOKUP(63, {"c";FALSE;"abc";65;63;61;"b";"a";FALSE;TRUE}, 1)': 63,
        'VLOOKUP(TRUE, {"c";FALSE;"abc";65;63;61;"b";"a";FALSE;TRUE}, 1)': true,
        'VLOOKUP(FALSE, {"c";FALSE;"abc";65;63;61;"b";"a";FALSE;TRUE}, 1)': false,
        'VLOOKUP(FALSE, {"c";TRUE;"abc";65;63;61;"b";"a";TRUE;FALSE}, 1)': FormulaError.NA,
        'VLOOKUP("c", {"c";TRUE;"abc";65;63;61;"b";"a";TRUE;FALSE}, 1)': 'a',
        'VLOOKUP("b", {"c";TRUE;"abc";65;63;61;"b";"a";TRUE;FALSE}, 1)': 'b',
        'VLOOKUP("abc", {"c";TRUE;"abc";65;63;61;"b";"a";TRUE;FALSE}, 1)': 'abc',
        'VLOOKUP("a", {"c";TRUE;"abc";65;63;61;"b";"a";TRUE;FALSE}, 1)': FormulaError.NA,
        'VLOOKUP("a*", {"c";TRUE;"abc";65;63;61;"b";"a";TRUE;FALSE}, 1)': FormulaError.NA,
        // with rangeLookup = FALSE
        'VLOOKUP(3, 3, 1,FALSE)': FormulaError.NA,
        'VLOOKUP(3, {1;2;3}, 1,FALSE)': 3,
        'VLOOKUP("a", {1;2;3;"a";"b"}, 1,FALSE)': 'a',
        'VLOOKUP(3, {1,"a";2, "b";3, "c"}, 2,FALSE)': 'c',
        'VLOOKUP(6, {1,"a";2, "b";3, "c"}, 2,FALSE)': FormulaError.NA,
        // wildcard support
        'VLOOKUP("s?", {"abc"; "sd"; "qwe"}, 1,FALSE)': 'sd',
        'VLOOKUP("*e", {"abc"; "sd"; "qwe"}, 1,FALSE)': 'qwe',
        'VLOOKUP("*e?2?", {"abc"; "sd"; "qwe123"}, 1,FALSE)': 'qwe123',
        // case insensitive
        'VLOOKUP("a*", {"c";TRUE;"AbC";65;63;61;"b";"a";TRUE;FALSE}, 1, FALSE)': 'AbC',
        // single row table
        'VLOOKUP(614, { 614,"Foobar"}, 2)': 'Foobar'
    },
    XLOOKUP: {
        //'XLOOKUP(A2, A1:A9, B1:B9)': .69,
        //When match mode is 0 and search mode is 1
        'XLOOKUP(A2, A1:A9, B1:B9)': .69,
        'XLOOKUP("Bananas", A1:A9, B1:B9)': 0.34,
        'XLOOKUP(0.55, B1:B9, C1:C9)': 15,
        'XLOOKUP(1, B1:B9, C1:C9)': FormulaError.NA,
        'XLOOKUP(1, B1:B9, C1:C9, 10)': 10,
        //Basic duplicate
        'XLOOKUP(A2, A1:A9, B1:B9,,0,1)': .69,
        'XLOOKUP("Bananas", A1:A9, B1:B9,,0,1)': 0.34,
        'XLOOKUP(0.55, B1:B9, C1:C9,,0,1)': 15,
        'XLOOKUP(1, B1:B9, C1:C9,,0,1)': FormulaError.NA,
        'XLOOKUP(1, B1:B9, C1:C9, 10,0,1)': 10,

        //when matchmode is 1 and search mode is 1
        //basic duplicate
        'XLOOKUP(A2, A1:A9, B1:B9,,1,1)': .69,
        'XLOOKUP("Bananas", A1:A9, B1:B9,,1,1)': 0.34,
        'XLOOKUP(0.55, B1:B9, C1:C9,,1,1)': 15,
        'XLOOKUP(1, B1:B9, C1:C9, 10,1,1)': 10,
        //match_mode 1 and search_mode 1 specific test
        'XLOOKUP(1, B1:B9, C1:C9,,0,1)': FormulaError.NA,
        'XLOOKUP(1, B1:B9, C1:C9, 10,0,1)': 10,


        'XLOOKUP(A2, A1:A9, B1:B9)': .69,
        
    }

};

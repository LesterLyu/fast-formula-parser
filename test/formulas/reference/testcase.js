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
        'SUM(FILTER(B2:B10,{TRUE,FALSE,FALSE,FALSE,FALSE,FALSE,FALSE,FALSE,FALSE}))' : .69,
        'SUM(FILTER(C2:C10,{TRUE,TRUE,TRUE,TRUE,TRUE,TRUE,TRUE,TRUE,TRUE}))' : 216,
        'SUM(FILTER(B1:B10,{TRUE}))' : FormulaError.VALUE,
        'SUM(FILTER(C2:C10,{TRUE,TRUE,TRUE,TRUE,TRUE,TRUE,TRUE,TRUE,TRUE}))' : 216,
        'SUM(FILTER(B2:B10,{TRUE,TRUE,TRUE,TRUE,TRUE,TRUE,TRUE,TRUE,TRUE}))' : 11.77,
        'SUM(FILTER(B2:B10,{TRUE,TRUE,TRUE,TRUE,TRUE,TRUE,TRUE,TRUE,TRUE}))' : 11.77,
        'SUM(FILTER(B2:B10,{FALSE,FALSE,FALSE,FALSE,FALSE,FALSE,FALSE,FALSE,FALSE},10))': 10,
        'SUM(FILTER(C2:C10,{TRUE,FALSE,FALSE,FALSE,FALSE,FALSE,FALSE,FALSE,FALSE}))': 40,
        'SUM(FILTER(C3:C10,{FALSE,FALSE,FALSE}))': FormulaError.VALUE
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
        //match_mode = 0 and search_mode is 1
        'XLOOKUP(A2, A1:A9, B1:B9)': .69,
        'XLOOKUP("Bananas", A1:A9, B1:B9)': 0.34,
        'XLOOKUP(0.55, B1:B9, C1:C9)': 15,
        'XLOOKUP(1, B1:B9, C1:C9)': FormulaError.NA,
        'XLOOKUP(1, B1:B9, C1:C9, 10)': 10,

        //when match_mode is 1 and search mode is 1
        //Basic duplicate
        'XLOOKUP(A2, A1:A9, B1:B9,,1,1)': .69,
        'XLOOKUP("Bananas", A1:A9, B1:B9,,1,1)': 0.34,
        'XLOOKUP(0.55, B1:B9, C1:C9,,1,1)': 15,
        'XLOOKUP(1, B1:B9, C1:C9, 10,1,1)': 20,
        
        //match_mode 1 and search_mode 1 specific test
        'XLOOKUP(0, B1:B9, C1:C9, 0,1,1)': 25,
        'XLOOKUP(10, B1:B9, C1:C9, 5,1,1)': 'count',
        'XLOOKUP(1.5, B1:B9, C1:C9, 0,1,1)': 10,
        'XLOOKUP("app", A1:A12, B1:B12, 0,1,1)': 0.69,
        'XLOOKUP("KOJO", A1:A12, B1:B12, 0,1,1)': .55,

        //when match_mode is -1 and search mode is 1
        //Basic duplicate
        'XLOOKUP(A2, A1:A9, B1:B9,,-1,1)': .69,
        'XLOOKUP("Bananas", A1:A9, B1:B9,,-1,1)': 0.34,
        'XLOOKUP(0.55, B1:B9, C1:C9,,-1,1)': 15,
        'XLOOKUP(1, B1:B9, C1:C9, 10,-1,1)': 40,

        //match_mode -1 and search_mode 1 specific test
        'XLOOKUP(0, B1:B9, C1:C9, 0,-1,1)': 0,
        'XLOOKUP(10, B1:B9, C1:C9, 5,-1,1)':16,
        'XLOOKUP(1.5, B1:B9, C1:C9, 0,-1,1)': 20,
        'XLOOKUP("app", A1:A12, B1:B12, 0,-1,1)': 2.8,
        'XLOOKUP("KOJO", A1:A12, B1:B12, 0,-1,1)': 'price',
        'XLOOKUP(5, A1:A12, B1:B12, 0,-1,1)': 0,
        'XLOOKUP(0, A1:A12, B1:B12, 0,-1,1)': 0,

        //match_mode = 2 search_mode = 1
        //Basic duplicate
        'XLOOKUP(A2, A1:A9, B1:B9,,2,1)': .69,
        'XLOOKUP("Bananas", A1:A9, B1:B9,,2,1)': 0.34,
        'XLOOKUP(0.55, B1:B9, C1:C9,,2,1)': 15,
        'XLOOKUP(1, B1:B9, C1:C9, 10,2,1)': 10,
        'XLOOKUP(1, B1:B9, C1:C9,,2,1)': FormulaError.NA,

        //match_mode = 2 search_mode = 1 specific
        'XLOOKUP("?nt", {"ant", "bee", "cat", "dog", "elephant"}, {2, 3, 10, 20, 30}, 10, 2, 1)': 2,
        'XLOOKUP("cat~?", {"ant", "bee", "cat?", "dog", "elephant"}, {2, 3, 10, 20, 30}, 50, 2, 1)': 10,
        'XLOOKUP("cat~~", {"ant", "bee", "cat~", "dog", "elephant"}, {2, 3, 10, 20, 30}, 50, 2, 1)': 10,
        'XLOOKUP("cat~*", {"ant", "bee", "cat*", "dog", "elephant"}, {2, 3, 10, 20, 30}, 50, 2, 1)': 10,
        'XLOOKUP("*e", {"ant", "bee", "cat", "dog", "elephant"}, {2, 3, 10, 20, 30}, 10, 2, 1)': 3,
        'XLOOKUP("*nt", {"ant", "bee", "cat", "dog", "elephant"}, {2, 3, 10, 20, 30}, 10, 2, 1)': 2,
        'XLOOKUP("*g", {"ant", "bee", "cat", "dog", "elephant"}, {2, 3, 10, 20, 30}, 10, 2, 1)': 20,
        'XLOOKUP("*eph?nt", {"ant", "bee", "cat", "dog", "elephant"}, {2, 3, 10, 20, 30}, 10, 2, 1)': 30,

        //match_mode = 0 and search_mode is -1 specific
        'XLOOKUP(A2, A1:A9, B1:B9,,0,-1)': .69,
        'XLOOKUP("Bananas", A1:A9, B1:B9,,0,-1)': 0.34,
        'XLOOKUP(0.55, B1:B9, C1:C9,,0,-1)': 15,
        'XLOOKUP(1, B1:B9, C1:C9,,0,-1)': FormulaError.NA,
        'XLOOKUP(1, B1:B9, C1:C9,10,0,-1)': 10,

        //when match_mode is -1 and search mode is -1
        //Basic duplicate
        'XLOOKUP(A2, A1:A9, B1:B9,,-1,-1)': .69,
        'XLOOKUP("Bananas", A1:A9, B1:B9,,-1,-1)': 0.34,
        'XLOOKUP(0.55, B1:B9, C1:C9,,-1,-1)': 15,
        'XLOOKUP(1, B1:B9, C1:C9, 10,-1,-1)': 40,

        //match_mode -1 and search_mode -1 specific test
        'XLOOKUP(0, B1:B9, C1:C9, 0,-1,-1)': 0,
        'XLOOKUP(10, B1:B9, C1:C9, 5,-1,-1)':16,
        'XLOOKUP(1.5, B1:B9, C1:C9, 0,-1,-1)': 20,
        'XLOOKUP("app", A1:A12, B1:B12, 0,-1,-1)': 2.8,
        'XLOOKUP("KOJO", A1:A12, B1:B12, 0,-1,-1)': 'price',
        'XLOOKUP(5, A1:A12, B1:B12, 0,-1,-1)': 0,
        'XLOOKUP(0, A1:A12, B1:B12, 0,-1,-1)': 0,

        //match_mode = 1 and search_mode is -1 specific
        //Basic duplicate
        'XLOOKUP(A2, A1:A9, B1:B9,,1,-1)': .69,
        'XLOOKUP("Bananas", A1:A9, B1:B9,,1,-1)': 0.34,
        'XLOOKUP(0.55, B1:B9, C1:C9,,1,-1)': 15,
        'XLOOKUP(1, B1:B9, C1:C9, 10,1,-1)': 20,
        
        //match_mode 1 and search_mode -1 specific test
        'XLOOKUP(0, B1:B9, C1:C9, 0,1,-1)': 25,
        'XLOOKUP(10, B1:B9, C1:C9, 5,1,-1)': 'count',
        'XLOOKUP(1.5, B1:B9, C1:C9, 0,1,-1)': 10,
        'XLOOKUP("app", A1:A12, B1:B12, 0,1,-1)': 'Lemons',
        'XLOOKUP("KOJO", A1:A12, B1:B12, 0,1,-1)': .55,

        //match_mode = 2 search_mode = -1
        //Basic duplicate
        'XLOOKUP(A2, A1:A9, B1:B9,,2,-1)': .69,
        'XLOOKUP("Bananas", A1:A9, B1:B9,,2,-1)': 0.34,
        'XLOOKUP(0.55, B1:B9, C1:C9,,2,-1)': 15,
        'XLOOKUP(1, B1:B9, C1:C9, 10,2,-1)': 10,
        'XLOOKUP(1, B1:B9, C1:C9,,2,-1)': FormulaError.NA,

        //match_mode = 2 search_mode = -1 specific
        'XLOOKUP(A2, A1:A9, B1:B9,,2,-1)': .69,
        'XLOOKUP("Bananas", A1:A9, B1:B9,,2,-1)': 0.34,
        'XLOOKUP(0.55, B1:B9, C1:C9,,2,-1)': 15,
        'XLOOKUP(1, B1:B9, C1:C9, 10,2,-1)': 10,
        'XLOOKUP(1, B1:B9, C1:C9,,2,-1)': FormulaError.NA,

        //match_mode = 0 search_mode = 2 specific
        'XLOOKUP(7, {1,2,3,4,5,6,7,8}, {"a","b","c","d","e","f","g","h"}, 10, 0, 2)': 'g',
        'XLOOKUP(1, {1,2,3,4,5,6,7,8}, {"a","b","c","d","e","f","g","h"}, 10, 0, 2)': 'a',
        'XLOOKUP(4, {1,2,3,4,5,6,7,8}, {"a","b","c","d","e","f","g","h"}, 10, 0, 2)': 'd',
        'XLOOKUP(6, {1,2,3,4,5,6,7,8}, {"a","b","c","d","e","f","g","h"}, 10, 0, 2)': 'f',
        'XLOOKUP(8, {1,2,3,4,5,6,7,8}, {"a","b","c","d","e","f","g","h"}, 10, 0, 2)': 'h',
        'XLOOKUP(9, {1,2,3,4,5,6,7,8}, {"a","b","c","d","e","f","g","h"}, 10, 0, 2)': 10,
        'XLOOKUP(9, {1,2,3,4,5,6,7,8}, {"a","b","c","d","e","f","g","h"}, , 0, 2)': FormulaError.NA,
        'XLOOKUP(-1, {1,2,3,4,5,6,7,8}, {"a","b","c","d","e","f","g","h"}, 10, 0, 2)': 10,
        'XLOOKUP(-1, {1,2,3,4,5,6,7,8}, {"a","b","c","d","e","f","g","h"}, , 0, 2)': FormulaError.NA,
        'XLOOKUP(10, {2, 3, 10, 20, 30}, {"ant", "bee", "cat", "dog", "elephant"}, 10, 0, 2)': 'cat',
        'XLOOKUP(3, {2, 3, 10, 20, 30}, {"ant", "bee", "cat", "dog", "elephant"}, 10, 0, 2)': 'bee',
        'XLOOKUP(20, {2, 3, 10, 20, 30}, {"ant", "bee", "cat", "dog", "elephant"}, 10, 0, 2)': 'dog',
        'XLOOKUP("c", {"a","b","c","d","e","f","g","h"}, {1,2,3,4,5,6,7,8},  10, 0, 2)': 3,
        'XLOOKUP("a", {"a","b","c","d","e","f","g","h"}, {1,2,3,4,5,6,7,8},  10, 0, 2)': 1,
        'XLOOKUP("h", {"a","b","c","d","e","f","g","h"}, {1,2,3,4,5,6,7,8},  10, 0, 2)': 8,
        'XLOOKUP("b", {"a","b","c","d","e","f","g","h"}, {1,2,3,4,5,6,7,8},  10, 0, 2)': 2,
        'XLOOKUP("g", {"a","b","c","d","e","f","g","h"}, {1,2,3,4,5,6,7,8},  10, 0, 2)': 7,
    
        //match_mode = 1 search_mode = 2 specific
        'XLOOKUP(7.5, {1,2,3,4,5,6,7,8}, {"a","b","c","d","e","f","g","h"}, 10, 1, 2)': 'h',
        'XLOOKUP(1.5, {1,2,3,4,5,6,7,8}, {"a","b","c","d","e","f","g","h"}, 10, 1, 2)': 'b',
        'XLOOKUP(4.5, {1,2,3,4,5,6,7,8}, {"a","b","c","d","e","f","g","h"}, 10, 1, 2)': 'e',
        'XLOOKUP(5.5, {1,2,3,4,5,6,7,8}, {"a","b","c","d","e","f","g","h"}, 10, 1, 2)': 'f',
        'XLOOKUP(6.5, {1,2,3,4,5,6,7,8}, {"a","b","c","d","e","f","g","h"}, 10, 1, 2)': 'g',
        'XLOOKUP(8.5, {1,2,3,4,5,6,7,8}, {"a","b","c","d","e","f","g","h"}, 10, 1, 2)': 10,
        'XLOOKUP(9.5, {1,2,3,4,5,6,7,8}, {"a","b","c","d","e","f","g","h"}, , 1, 2)': FormulaError.NA,
        'XLOOKUP(10.5, {2, 3, 10, 20, 30}, {"ant", "bee", "cat", "dog", "elephant"}, 10, 1, 2)': 'dog',
        'XLOOKUP(3.5, {2, 3, 10, 20, 30}, {"ant", "bee", "cat", "dog", "elephant"}, 10, 1, 2)': 'cat',
        'XLOOKUP(20.5, {2, 3, 10, 20, 30}, {"ant", "bee", "cat", "dog", "elephant"}, 10, 1, 2)': 'elephant',
        'XLOOKUP("d", {"a","c","e","g","i","k","m","p"}, {1,2,3,4,5,6,7,8},  10, 1, 2)': 3,
        'XLOOKUP("b", {"a","c","e","g","i","k","m","p"}, {1,2,3,4,5,6,7,8},  10, 1, 2)': 2,
        'XLOOKUP("n", {"a","c","e","g","i","k","m","p"}, {1,2,3,4,5,6,7,8},  10, 1, 2)': 8,
        'XLOOKUP("f", {"a","c","e","g","i","k","m","p"}, {1,2,3,4,5,6,7,8},  10, 1, 2)': 4,
        'XLOOKUP("j", {"a","c","e","g","i","k","m","p"}, {1,2,3,4,5,6,7,8},  10, 1, 2)': 6,
        'XLOOKUP(-1.5, {1,2,3,4,5,6,7,8}, {"a","b","c","d","e","f","g","h"}, 10, 1, 2)': 'a',
        'XLOOKUP(1.5, {1,2,3,4,5,6,7,8}, {"a","b","c","d","e","f","g","h"}, 10, 1, 2)': 'b',
        'XLOOKUP(7.5, {1,2,3,4,5,6,7,8}, {"a","b","c","d","e","f","g","h"}, 10, 1, 2)': 'h',
        'XLOOKUP(8.5, {1,2,3,4,5,6,7,8}, {"a","b","c","d","e","f","g","h"}, 10, 1, 2)': 10,

        //match_mode = -1 search_mode = 2 specific
        'XLOOKUP(-1.5, {1,2,3,4,5,6,7,8}, {"a","b","c","d","e","f","g","h"}, 10, -1, 2)': 10,
        'XLOOKUP(7.5, {1,2,3,4,5,6,7,8}, {"a","b","c","d","e","f","g","h"}, 10, -1, 2)': 'g',
        'XLOOKUP(1.5, {1,2,3,4,5,6,7,8}, {"a","b","c","d","e","f","g","h"}, 10, -1, 2)': 'a',
        'XLOOKUP(4.5, {1,2,3,4,5,6,7,8}, {"a","b","c","d","e","f","g","h"}, 10, -1, 2)': 'd',
        'XLOOKUP(5.5, {1,2,3,4,5,6,7,8}, {"a","b","c","d","e","f","g","h"}, 10, -1, 2)': 'e',
        'XLOOKUP(6.5, {1,2,3,4,5,6,7,8}, {"a","b","c","d","e","f","g","h"}, 10, -1, 2)': 'f',
        'XLOOKUP(8.5, {1,2,3,4,5,6,7,8}, {"a","b","c","d","e","f","g","h"}, 10, -1, 2)': 'h',
        'XLOOKUP(9.5, {1,2,3,4,5,6,7,8}, {"a","b","c","d","e","f","g","h"}, , -1, 2)': 'h',
        'XLOOKUP(10.5, {2, 3, 10, 20, 30}, {"ant", "bee", "cat", "dog", "elephant"}, 10, -1, 2)': 'cat',
        'XLOOKUP(3.5, {2, 3, 10, 20, 30}, {"ant", "bee", "cat", "dog", "elephant"}, 10, -1, 2)': 'bee',
        'XLOOKUP(20.5, {2, 3, 10, 20, 30}, {"ant", "bee", "cat", "dog", "elephant"}, 10, -1, 2)': 'dog',
        'XLOOKUP("d", {"a","c","e","g","i","k","m","p"}, {1,2,3,4,5,6,7,8},  10, -1, 2)': 2,
        'XLOOKUP("b", {"a","c","e","g","i","k","m","p"}, {1,2,3,4,5,6,7,8},  10, -1, 2)': 1,
        'XLOOKUP("n", {"a","c","e","g","i","k","m","p"}, {1,2,3,4,5,6,7,8},  10, -1, 2)': 7,
        'XLOOKUP("f", {"a","c","e","g","i","k","m","p"}, {1,2,3,4,5,6,7,8},  10, -1, 2)': 3,
        'XLOOKUP("j", {"a","c","e","g","i","k","m","p"}, {1,2,3,4,5,6,7,8},  10, -1, 2)': 5,
        'XLOOKUP(-1.5, {1,2,3,4,5,6,7,8}, {"a","b","c","d","e","f","g","h"}, 10, -1, 2)': 10,
        'XLOOKUP(1.5, {1,2,3,4,5,6,7,8}, {"a","b","c","d","e","f","g","h"}, 10, -1, 2)': 'a',
        'XLOOKUP(7.5, {1,2,3,4,5,6,7,8}, {"a","b","c","d","e","f","g","h"}, 10, -1, 2)': 'g',
        'XLOOKUP(8.5, {1,2,3,4,5,6,7,8}, {"a","b","c","d","e","f","g","h"}, 10, -1, 2)': 'h',

        //match_mode = 2 search_mode = 2 specific
        'XLOOKUP(A2, A1:A9, B1:B9,,2,2)': FormulaError.VALUE,
        'XLOOKUP("Bananas", A1:A9, B1:B9,,2,2)': FormulaError.VALUE,
        'XLOOKUP(0.55, B1:B9, C1:C9,,2,2)': FormulaError.VALUE,
        'XLOOKUP(1, B1:B9, C1:C9, 10,2,2)': FormulaError.VALUE,
        'XLOOKUP(1, B1:B9, C1:C9,,2,2)': FormulaError.VALUE,

        //match_mode = 0 search_mode = -2 specific
        'XLOOKUP(7, {8,7,6,5,4,3,2,1}, {"h", "g", "f", "e", "d", "c", "b", "a"}, 10, 0, -2)': 'g',
        'XLOOKUP(1, {8,7,6,5,4,3,2,1}, {"h", "g", "f", "e", "d", "c", "b", "a"}, 10, 0, -2)': 'a',
        'XLOOKUP(4, {8,7,6,5,4,3,2,1}, {"h", "g", "f", "e", "d", "c", "b", "a"}, 10, 0, -2)': 'd',
        'XLOOKUP(6, {8,7,6,5,4,3,2,1}, {"h", "g", "f", "e", "d", "c", "b", "a"}, 10, 0, -2)': 'f',
        'XLOOKUP(8, {8,7,6,5,4,3,2,1}, {"h", "g", "f", "e", "d", "c", "b", "a"}, 10, 0, -2)': 'h',
        'XLOOKUP(9, {8,7,6,5,4,3,2,1}, {"h", "g", "f", "e", "d", "c", "b", "a"}, 10, 0, -2)': 10,
        'XLOOKUP(9, {8,7,6,5,4,3,2,1}, {"h", "g", "f", "e", "d", "c", "b", "a"}, , 0, -2)': FormulaError.NA,
        'XLOOKUP(-1, {8,7,6,5,4,3,2,1}, {"h", "g", "f", "e", "d", "c", "b", "a"}, 10, 0, -2)': 10,
        'XLOOKUP(-1, {8,7,6,5,4,3,2,1}, {"h", "g", "f", "e", "d", "c", "b", "a"}, , 0, -2)': FormulaError.NA,
        'XLOOKUP(10, {30, 20, 10, 3,1},{"elephant", "dog", "cat", "bee", "ant"}, 10, 0, -2)': 'cat',
        'XLOOKUP(3, {30, 20, 10, 3,1}, {"elephant", "dog", "cat", "bee", "ant"}, 10, 0, -2)': 'bee',
        'XLOOKUP(20, {30, 20, 10, 3,1}, {"elephant", "dog", "cat", "bee", "ant"}, 10, 0, -2)': 'dog',
        'XLOOKUP("c", {"h", "g", "f", "e", "d", "c", "b", "a"}, {8,7,6,5,4,3,2,1},  10, 0, -2)': 3,
        'XLOOKUP("a", {"h", "g", "f", "e", "d", "c", "b", "a"}, {8,7,6,5,4,3,2,1},  10, 0, -2)': 1,
        'XLOOKUP("h", {"h", "g", "f", "e", "d", "c", "b", "a"}, {8,7,6,5,4,3,2,1},  10, 0, -2)': 8,
        'XLOOKUP("b", {"h", "g", "f", "e", "d", "c", "b", "a"}, {8,7,6,5,4,3,2,1},  10, 0, -2)': 2,
        'XLOOKUP("g", {"h", "g", "f", "e", "d", "c", "b", "a"}, {8,7,6,5,4,3,2,1},  10, 0, -2)': 7,

        //match_mode = 1 search_mode = -2 specific
        'XLOOKUP(-1.5,{8,7,6,5,4,3,2,1},{"h", "g", "f", "e", "d", "c", "b", "a"}, 10, 1, -2)': 'a',
        'XLOOKUP(7.5, {8,7,6,5,4,3,2,1},{"h", "g", "f", "e", "d", "c", "b", "a"}, 10, 1, -2)': 'h',
        'XLOOKUP(1.5, {8,7,6,5,4,3,2,1},{"h", "g", "f", "e", "d", "c", "b", "a"}, 10, 1, -2)': 'b',
        'XLOOKUP(4.5, {8,7,6,5,4,3,2,1},{"h", "g", "f", "e", "d", "c", "b", "a"}, 10, 1, -2)': 'e',
        'XLOOKUP(5.5, {8,7,6,5,4,3,2,1},{"h", "g", "f", "e", "d", "c", "b", "a"}, 10, 1, -2)': 'f',
        'XLOOKUP(6.5, {8,7,6,5,4,3,2,1},{"h", "g", "f", "e", "d", "c", "b", "a"}, 10, 1, -2)': 'g',
        'XLOOKUP(8.5, {8,7,6,5,4,3,2,1},{"h", "g", "f", "e", "d", "c", "b", "a"}, 10, 1, -2)': 10,
        'XLOOKUP(9.5, {8,7,6,5,4,3,2,1},{"h", "g", "f", "e", "d", "c", "b", "a"}, , 1, -2)': FormulaError.NA,
        'XLOOKUP(10.5, {30, 20, 10, 3,1}, {"elephant", "dog", "cat", "bee", "ant"}, 10, 1, -2)': 'dog',
        'XLOOKUP(3.5, {30, 20, 10, 3,1}, {"elephant", "dog", "cat", "bee", "ant"}, 10, 1, -2)': 'cat',
        'XLOOKUP(20.5, {30, 20, 10, 3,1}, {"elephant", "dog", "cat", "bee", "ant"}, 10, 1, -2)': 'elephant',
        'XLOOKUP("d", {"h", "g", "f", "e", "d", "c", "b", "a"}, {8,7,6,5,4,3,2,1},  10, 1, -2)': 4,
        'XLOOKUP("b", {"h", "g", "f", "e", "d", "c", "b", "a"}, {8,7,6,5,4,3,2,1},  10, 1, -2)': 2,
        'XLOOKUP("n", {"h", "g", "f", "e", "d", "c", "b", "a"}, {8,7,6,5,4,3,2,1},  10, 1, -2)': 10,
        'XLOOKUP("f", {"h", "g", "f", "e", "d", "c", "b", "a"}, {8,7,6,5,4,3,2,1},  10, 1, -2)': 6,
        'XLOOKUP("j", {"h", "g", "f", "e", "d", "c", "b", "a"}, {8,7,6,5,4,3,2,1},  10, 1, -2)': 10,
        'XLOOKUP(-1.5, {8,7,6,5,4,3,2,1},{"h", "g", "f", "e", "d", "c", "b", "a"}, 10, 1, -2)': 'a',
        'XLOOKUP(1.5, {8,7,6,5,4,3,2,1},{"h", "g", "f", "e", "d", "c", "b", "a"}, 10, 1, -2)': 'b',
        'XLOOKUP(7.5, {8,7,6,5,4,3,2,1},{"h", "g", "f", "e", "d", "c", "b", "a"}, 10, 1, -2)': 'h',
        'XLOOKUP(8.5, {8,7,6,5,4,3,2,1},{"h", "g", "f", "e", "d", "c", "b", "a"}, 10, 1, -2)': 10,

        //match_mode = -1 search_mode = -2 specific
        'XLOOKUP(-1.5,{8,7,6,5,4,3,2,1},{"h", "g", "f", "e", "d", "c", "b", "a"}, 10, -1, -2)': 10,
        'XLOOKUP(7.5, {8,7,6,5,4,3,2,1},{"h", "g", "f", "e", "d", "c", "b", "a"}, 10, -1, -2)': 'g',
        'XLOOKUP(1.5, {8,7,6,5,4,3,2,1},{"h", "g", "f", "e", "d", "c", "b", "a"}, 10, -1, -2)': 'a',
        'XLOOKUP(4.5, {8,7,6,5,4,3,2,1},{"h", "g", "f", "e", "d", "c", "b", "a"}, 10, -1, -2)': 'd',
        'XLOOKUP(5.5, {8,7,6,5,4,3,2,1},{"h", "g", "f", "e", "d", "c", "b", "a"}, 10, -1, -2)': 'e',
        'XLOOKUP(6.5, {8,7,6,5,4,3,2,1},{"h", "g", "f", "e", "d", "c", "b", "a"}, 10, -1, -2)': 'f',
        'XLOOKUP(9.5, {8,7,6,5,4,3,2,1},{"h", "g", "f", "e", "d", "c", "b", "a"}, , -1, -2)': 'h',
        'XLOOKUP(10.5, {30, 20, 10, 3,1}, {"elephant", "dog", "cat", "bee", "ant"}, 10, -1, -2)': 'cat',
        'XLOOKUP(3.5, {30, 20, 10, 3,1}, {"elephant", "dog", "cat", "bee", "ant"}, 10, -1, -2)': 'bee',
        'XLOOKUP(20.5, {30, 20, 10, 3,1}, {"elephant", "dog", "cat", "bee", "ant"}, 10, -1, -2)': 'dog',
        'XLOOKUP("d", {"h", "g", "f", "e", "d", "c", "b", "a"}, {8,7,6,5,4,3,2,1},  10, -1, -2)': 4,
        'XLOOKUP("b", {"h", "g", "f", "e", "d", "c", "b", "a"}, {8,7,6,5,4,3,2,1},  10, -1, -2)': 2,
        'XLOOKUP("n", {"h", "g", "f", "e", "d", "c", "b", "a"}, {8,7,6,5,4,3,2,1},  10, -1, -2)': 8,
        'XLOOKUP("f", {"h", "g", "f", "e", "d", "c", "b", "a"}, {8,7,6,5,4,3,2,1},  10, -1, -2)': 6,
        'XLOOKUP("j", {"h", "g", "f", "e", "d", "c", "b", "a"}, {8,7,6,5,4,3,2,1},  10, -1, -2)': 8,
        'XLOOKUP(-1.5, {8,7,6,5,4,3,2,1},{"h", "g", "f", "e", "d", "c", "b", "a"}, 10, -1, -2)': 10,
        'XLOOKUP(1.5, {8,7,6,5,4,3,2,1},{"h", "g", "f", "e", "d", "c", "b", "a"}, 10, -1, -2)': 'a',
        'XLOOKUP(7.5, {8,7,6,5,4,3,2,1},{"h", "g", "f", "e", "d", "c", "b", "a"}, 10, -1, -2)': 'g',
        'XLOOKUP(8.5, {8,7,6,5,4,3,2,1},{"h", "g", "f", "e", "d", "c", "b", "a"}, 10, -1, -2)': 'h',

        //match_mode = 2 search_mode = -2
        'XLOOKUP(A2, A1:A9, B1:B9,,2,-2)': FormulaError.VALUE,
        'XLOOKUP("Bananas", A1:A9, B1:B9,,2,-2)': FormulaError.VALUE,
        'XLOOKUP(0.55, B1:B9, C1:C9,,2,-2)': FormulaError.VALUE,
        'XLOOKUP(1, B1:B9, C1:C9, 10,2,-2)': FormulaError.VALUE,
        'XLOOKUP(1, B1:B9, C1:C9,,2,-2)': FormulaError.VALUE,
    }
    
};

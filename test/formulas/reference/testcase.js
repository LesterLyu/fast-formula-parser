module.exports = {
    VLOOKUP: {
        'VLOOKUP(3, {1;2;3;4;5}, 1)': 3,
        'VLOOKUP(3, {3;2;1}, 1)': 1,
        'VLOOKUP(3, {1;2;3;4;5}, 2)': '#REF!',
        'VLOOKUP("a", {1;2;3;4;5}, 1)': '#N/A',
        'VLOOKUP(3, {1.1;2.2;3.3;4.4;5.5}, 1)': 2.2,
        // should handle like Excel.
        'VLOOKUP(63, {"c";FALSE;"abc";65;63;61;"b";"a";FALSE;TRUE}, 1)': 63,
        'VLOOKUP(TRUE, {"c";FALSE;"abc";65;63;61;"b";"a";FALSE;TRUE}, 1)': 'TRUE',
        'VLOOKUP(FALSE, {"c";FALSE;"abc";65;63;61;"b";"a";FALSE;TRUE}, 1)': 'FALSE',
        'VLOOKUP(FALSE, {"c";TRUE;"abc";65;63;61;"b";"a";TRUE;FALSE}, 1)': '#N/A',
        'VLOOKUP("c", {"c";TRUE;"abc";65;63;61;"b";"a";TRUE;FALSE}, 1)': 'a',
        'VLOOKUP("b", {"c";TRUE;"abc";65;63;61;"b";"a";TRUE;FALSE}, 1)': 'b',
        'VLOOKUP("abc", {"c";TRUE;"abc";65;63;61;"b";"a";TRUE;FALSE}, 1)': 'abc',
        'VLOOKUP("a", {"c";TRUE;"abc";65;63;61;"b";"a";TRUE;FALSE}, 1)': '#N/A',
        'VLOOKUP("a*", {"c";TRUE;"abc";65;63;61;"b";"a";TRUE;FALSE}, 1)': '#N/A',
        // with rangeLookup = FALSE
        'VLOOKUP(3, 3, 1,FALSE)': '#N/A',
        'VLOOKUP(3, {1;2;3}, 1,FALSE)': 3,
        'VLOOKUP("a", {1;2;3;"a";"b"}, 1,FALSE)': 'a',
        'VLOOKUP(3, {1,"a";2, "b";3, "c"}, 2,FALSE)': 'c',
        'VLOOKUP(6, {1,"a";2, "b";3, "c"}, 2,FALSE)': '#N/A',
        // wildcard support
        'VLOOKUP("s?", {"abc"; "sd"; "qwe"}, 1,FALSE)': 'sd',
        'VLOOKUP("*e", {"abc"; "sd"; "qwe"}, 1,FALSE)': 'qwe',
        'VLOOKUP("*e?2?", {"abc"; "sd"; "qwe123"}, 1,FALSE)': 'qwe123',
    }

};

module.exports = {

    AVEDEV: {
        'AVEDEV({4,1,6,7,5,4,3})': 1.469387755,
        'AVEDEV({4,1,6,7,5,4,3},(A7,B7),"1")': 1.8,
        'AVEDEV({4,1,6,7,5,4,3,TRUE},(A7,B7),"1")': 1.8,
        'AVEDEV({4,1,6,7,5,4,3,TRUE},(A7,B7),"1",1)': 1.83471074380165,
    },

    AVERAGE: {
        'AVERAGE({TRUE,1,2,"12"}, 3)': 2,
        'AVERAGE((A7, B7), 3)': 2,
        'AVERAGE(TRUE, "3")': 2,
        'AVERAGE(TRUE, "3a")': '#VALUE!',
    },

    AVERAGEA: {
        'AVERAGEA({TRUE,1,2,"12"}, 3)': 1.5,
        'AVERAGEA((A7, B7), 3)': 2,
        'AVERAGEA(TRUE, "3")': 2,
        'AVERAGEA(TRUE, "3a")': '#VALUE!',
        'AVERAGEA({TRUE,1,2,"3",""}, 3, TRUE, "1", 0)': 1,
        'AVERAGEA("", 1)': '#VALUE!'
    },

    COUNT: {
        'COUNT(A2:A5, 123)': 1,
        'COUNT(A2:A5)': 0,
        'COUNT(A1:E1)': 1,
        'COUNT(A2:E2)': 3,
        'COUNT(A2:E2, A1:E1)': 4,
        'COUNT((A2:E2, A1:E1))': 4,
    },

    COUNTIF: {
        'COUNTIF(A2:A5, "apples")': 2,
        'COUNTIF(A2:A5,A4)': 1,
        'COUNTIF(A2:A5,A2)+COUNTIF(A2:A5,A3)': 3,
        'COUNTIF(B2:B5,">55")': 2,
        'COUNTIF(B2:B5,"<>"&B4)': 3,
        'COUNTIF(B2:B5,">=32")-COUNTIF(B2:B5,">85")': 3,
        'COUNTIF(A2:A5,"*")': 4,
        'COUNTIF(A2:A5,"?????es")': 2,
        'COUNTIF(B1:E1,TRUE)': 2,
        'COUNTIF(B1:E1,"=TRUE")': 2,
        'COUNTIF(B1:E1,"TRUE")': 2,
        'COUNTIF(B1:E1,"TRUE1")': 1,
        'COUNTIF(B1:E1,"=TRUE1")': 1,
        'COUNTIF(B1:E1, {1,3,4})': 1,
        'COUNTIF(C2:E2, "{1,2}")': 1,
        'COUNTIF(C2:E2, "={1,2}")': 1,
        'COUNTIF(C2:E2, {1,2})': 0,
    },

};

const {FormulaParser} = require('../../../grammar/hooks');
const TestCase = require('./testcase');
const {generateTests} = require('../../utils');
const data = [
    ['', true, 1, 'TRUE1', true],
    ['apples', 32, '{1,2}', 5, 6],
    ['oranges', 54, 4, 5, 6],
    ['peaches', 75, 4, 5, 6],
    ['apples', 86, 4, 5, 6],
    ['string', 3, 4, 5, 6],
    [1,2,3,4,5,6,7], // row 7
    [100000, 7000], //row 8
    [200000, 14000], //row 9
    [300000, 21000], //row 10
    [400000, 28000], //row 11

    ['East', 45678], //row 12
    ['West', 23789], //row 13
    ['North', -4789], //row 14
    ['South (New Office)', 0], //row 15
    ['MidWest', 9678], //row 16

    [undefined, true, 1, 2]

];
const parser = new FormulaParser({
    onCell: ref => {
        return data[ref.row - 1][ref.col - 1];
    },
    onRange: ref => {
        const arr = [];
        for (let row = ref.from.row - 1; row < ref.to.row; row++) {
            const innerArr = [];
            for (let col = ref.from.col - 1; col < ref.to.col; col++) {
                innerArr.push(data[row][col])
            }
            arr.push(innerArr);
        }
        return arr;
    }
});

describe('Statistical Functions', function () {
    generateTests(parser, TestCase);
});

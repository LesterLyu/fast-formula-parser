const {FormulaParser} = require('../../../grammar/hooks');
const TestCase = require('./testcase');
const {generateTests} = require('../../utils');

const data = [
    [1, 2, 3, 4, 5],
    [100000, 7000, 250000, 5, 6],
    [200000, 14000, 4, 5, 6],
    [300000, 21000, 4, 5, 6],
    [400000, 28000, 4, 5, 6],
    ['string', 3, 4, 5, 6],
    // for SUMIF ex2
    ['Vegetables', 'Tomatoes', 2300, 5, 6], // row 7
    ['Vegetables', 'Celery', 5500, 5, 6], // row 8
    ['Fruits', 'Oranges', 800, 5, 6], // row 9
    ['', 'Butter', 400, 5, 6], // row 10
    ['Vegetables', 'Carrots', 4200, 5, 6], // row 11
    ['Fruits', 'Apples', 1200, 5, 6], // row 12
    ['1'],
    [2, 3, 9, 1, 8, 7, 5],
    [6, 5, 11, 7, 5, 4, 4],
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

describe('Math Functions', function () {
    generateTests(parser, TestCase);
});

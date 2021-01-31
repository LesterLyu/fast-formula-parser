const {FormulaParser, generateTests} = require('../../utils');
const TestCase = require('./testcase');

const data = [
    ['fruit', 'price', 'count', 4, 5],
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

describe('Web Functions', function () {
    generateTests(parser, TestCase);
});

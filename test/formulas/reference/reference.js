const chai = require('chai');
const expect = require('chai').expect;
const {FormulaParser} = require('../../../grammar/hooks');
const TestCase = require('./testcase');

const data = [
    ['fruit', 'price', 'count', 4, 5],
    ['Apples', 0.69, 40, 5, 6],
    ['Bananas', 0.34, 38, 5, 6],
    ['Lemons', 0.55, 15, 5, 6],
    ['Oranges', 0.25, 25, 5, 6],
    ['Pears', 0.59, 40, 5, 6],
    ['Almonds', 2.80, 10, 5, 6], // row 7
    ['Cashews', 3.55, 16, 5, 6], // row 8
    ['Peanuts', 1.25, 20, 5, 6], // row 9
    ['Walnuts', 1.75, 12, 5, 6], // row 10

    ['Apples', 'Lemons',0, 0, 0], // row 11
    ['Bananas', 'Pears', 0, 0, 0], // row 12
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

describe('Lookup and Reference Functions', function () {
    const funs = Object.keys(TestCase);

    funs.forEach(fun => {
        it(fun, () => {
            const formulas = Object.keys(TestCase[fun]);
            formulas.forEach(formula => {
                const expected = TestCase[fun][formula];
                let result = parser.parse(formula, {row: 1, col: 1});
                if (result.result) result = result.result;
                // console.log(`Testing ${formula}`);
                expect(result, `${formula} should equal ${expected}\n`).to.equal(expected);
            })
        });
    });
});

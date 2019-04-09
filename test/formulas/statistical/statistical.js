const chai = require('chai');
const expect = require('chai').expect;
const {FormulaParser} = require('../../../grammar/hooks');
const TestCase = require('./testcase');
const data = [
    ['', true, 1, 'TRUE1', true],
    ['apples', 32, '{1,2}', 5, 6],
    ['oranges', 54, 4, 5, 6],
    ['peaches', 75, 4, 5, 6],
    ['apples', 86, 4, 5, 6],
    ['string', 3, 4, 5, 6],

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

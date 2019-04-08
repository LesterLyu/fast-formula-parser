const chai = require('chai');
const expect = require('chai').expect;
const {FormulaParser} = require('../../../grammar/hooks');
const TestCase = require('./testcase');
const data = [
    ['', 1,2,3,4],
    ['string', 3,4,5,6],

];
const parser = new FormulaParser({
    onCell: ref => {
        return data[ref.row - 1][ref.col - 1];
    }
});

describe('Information Functions', function () {
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

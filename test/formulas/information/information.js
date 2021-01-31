const {FormulaParser, generateTests} = require('../../utils');
const TestCase = require('./testcase');
const data = [
    ['', 1,2,3,4],
    ['string', 3,4,5,6],
    [null, undefined]

];
const parser = new FormulaParser({
    onCell: ref => {
        return data[ref.row - 1][ref.col - 1];
    }
});

describe('Information Functions', function () {
    generateTests(parser, TestCase);
});

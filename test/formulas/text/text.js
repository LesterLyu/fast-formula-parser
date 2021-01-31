const {FormulaParser, generateTests} = require('../../utils');
const TestCase = require('./testcase');

const parser = new FormulaParser();

describe('Text Functions', function () {
    generateTests(parser, TestCase);
});

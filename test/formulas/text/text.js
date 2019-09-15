const {FormulaParser} = require('../../../grammar/hooks');
const TestCase = require('./testcase');
const {generateTests} = require('../../utils');

const parser = new FormulaParser();

describe('Text Functions', function () {
    generateTests(parser, TestCase);
});

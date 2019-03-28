const assert = require('assert');
const FormulaParser = require('../index');
const parser = new FormulaParser();

const lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('./test/formulas.txt')
});

describe('All formulas', function () {
    let success = 0;
    const formulas = [];
    const failures = [];
    before((done) => {
        lineReader.on('line', (line) => {
            line = line.slice(1, -1)
                .replace(/""/g, '"');
            if (line.indexOf('[') === -1)
                formulas.push(line);
            // console.log(line)
        });
        lineReader.on('close', () => {
            done();
        });

    });

    it('success rate should > 99.99% ', function () {
        this.timeout(20000);
        console.log(formulas.length);
        formulas.forEach((formula, index) => {
            // console.log('testing #', index, formula);
            try {
                parser.parse(formula);
                success++;
            } catch (e) {
                failures.push(formula);
            }
        });
        console.log(failures);
        console.log(`Success rate: ${success / formulas.length * 100}%`);
        assert.strictEqual(success / formulas.length > 0.9999, true);
    });

});

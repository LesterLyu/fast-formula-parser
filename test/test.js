const assert = require('assert');
const parser = require('../parsing2');

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

    it('success rate should > 98% ', function () {
        this.timeout(50000);
        console.log(formulas.length);
        formulas.forEach((formula, index) => {
            console.log('testing #', index, formula);
            try {
                parser.parse(formula);
                success++;
            } catch (e) {
                failures.push(formula);
            }
        });
        console.log(failures);
        console.log(`Success rate: ${success / formulas.length} %`);
        assert.strictEqual(success / formulas.length > 0.98, true);
    });

});

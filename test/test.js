const assert = require('assert');
const {FormulaParser} = require('../grammar/hooks');
const parser = new FormulaParser();

const fs = require('fs');

const lineReader = require('readline').createInterface({
    input: fs.createReadStream('./test/formulas.txt')
});


describe('Parsing Formulas 1', function () {
    let success = 0;
    const formulas = [];
    const failures = [];
    before((done) => {
        lineReader.on('line', (line) => {
            line = line.slice(1, -1)
                .replace(/""/g, '"');
            if (line.indexOf('[') === -1)
                formulas.push(line);
            // else
            //     console.log(`not supported: ${line}`)
            // console.log(line)
        });
        lineReader.on('close', () => {
            done();
        });

    });

    it('formulas parse rate should be 100%', function () {
        this.timeout(20000);
        // console.log(formulas.length);
        formulas.forEach((formula, index) => {
            // console.log('testing #', index, formula);
            try {
                parser.parse(formula, {row: 2, col: 2});
                success++;
            } catch (e) {
                failures.push(formula);
            }
        });
        if (failures.length > 0) {
            console.log(failures);
            console.log(`Success rate: ${success / formulas.length * 100}%`);
        }

        const logs = parser.logs.sort();
        console.log(`The following functions is not implemented: (${logs.length} in total)\n ${logs.join(', ')}`);
        parser.logs = [];
        assert.strictEqual(success / formulas.length === 1, true);
    });
});

describe('Parsing Formulas 2', () => {
    let success = 0;
    let formulas;
    const failures = [];
    before(done => {
        fs.readFile('./test/formulas2.json', (err, data) => {
            if (err) throw err;
            formulas = JSON.parse(data.toString());
            done();
        });
    });

    it ('skip', () => '');

    it('custom formulas parse rate should be 100%',  function(done) {
        this.timeout(20000);
        formulas.forEach((formula, index)  => {
            // console.log('testing #', index, formula);
            try {
                parser.parse(formula);
                success++;
            } catch (e) {
                failures.push(formula);
            }
        });
        if (failures.length > 0) {
            console.log(failures);
            console.log(`Success rate: ${success / formulas.length * 100}%`);
        }
        assert.strictEqual(success / formulas.length === 1, true);
        const logs = parser.logs.sort();
        console.log(`The following functions is not implemented: (${logs.length} in total)\n ${logs.join(', ')}`);
        parser.logs = [];
        done();
    });

});

require('./operators/operators');
require('./formulas/math/math');
require('./formulas/text/text');
require('./formulas/reference/reference');
require('./formulas/information/information');
require('./formulas/statistical/statistical');
require('./formulas/date/date');

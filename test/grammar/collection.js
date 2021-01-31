const expect = require('chai').expect;
const {FormulaParser, FormulaError, generateTests, Collection} = require('../utils');

describe('Collection', () => {
    it('should throw error', function () {
        expect((() => new Collection([], [{row: 1, col: 1, sheet: 'Sheet1'}])))
            .to.throw('Collection: data length should match references length.')
    });

    it('should not throw error', function () {
        expect((() => new Collection([1], [{row: 1, col: 1, sheet: 'Sheet1'}])))
            .to.not.throw()
    });
});

const expect = require('chai').expect;
const FormulaError = require('../../formulas/error');
const {FormulaParser} = require('../../grammar/hooks');
const {MAX_ROW, MAX_COLUMN} = require('../../index');

const parser = new FormulaParser({
        onCell: ref => {
            if (ref.row === 5 && ref.col === 5)
                return null
            return 1;
        },
        onRange: ref => {
            if (ref.to.row === MAX_ROW) {
                return [[1, 2, 3]];
            } else if (ref.to.col === MAX_COLUMN) {
                return [[1], [0]]
            }
            return [[1, 2, 3], [0, 0, 0]]
        },
        functions: {
            BAD_FN: () => {
                throw new SyntaxError();
            }
        }
    }
);

const position = {row: 1, col: 1, sheet: 'Sheet1'};

describe('#ERROR! Error handling', () => {
    it('should handle NotAllInputParsedException', function () {
        try {
            parser.parse('SUM(1))', position);
        } catch (e) {
            expect(e).to.be.instanceof(FormulaError);
            expect(e.details.errorLocation.line).to.eq(1);
            expect(e.details.errorLocation.column).to.eq(7);
            expect(e.name).to.eq('#ERROR!');
            expect(e.details.name).to.eq('NotAllInputParsedException');
        }
    });

    it('should handle lexing error', function () {
        try {
            parser.parse('SUM(1)$', position);
        } catch (e) {
            expect(e).to.be.instanceof(FormulaError);
            expect(e.details.errorLocation.line).to.eq(1);
            expect(e.details.errorLocation.column).to.eq(7);
            expect(e.name).to.eq('#ERROR!');
        }
    });

    it('should handle Parser error []', function () {
        try {
            parser.parse('SUM([Sales.xlsx]Jan!B2:B5)', position);
        } catch (e) {
            expect(e).to.be.instanceof(FormulaError);
            expect(e.name).to.eq('#ERROR!');
        }
    });

    it('should handle Parser error', function () {
        try {
            parser.parse('SUM(B2:B5, "123"+)', position);
        } catch (e) {
            expect(e).to.be.instanceof(FormulaError);
            expect(e.name).to.eq('#ERROR!');
        }
    });

    it('should handle error from functions', function () {
        try {
            parser.parse('BAD_FN()', position);
        } catch (e) {
            expect(e).to.be.instanceof(FormulaError);
            expect(e.name).to.eq('#ERROR!');
            expect(e.details.name).to.eq('SyntaxError');
        }
    });
});


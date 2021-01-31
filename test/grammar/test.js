const expect = require('chai').expect;
const {FormulaParser, FormulaError, MAX_ROW, MAX_COLUMN} = require('../utils');

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
    }
);
const position = {row: 1, col: 1, sheet: 'Sheet1'};

describe('Basic parse', () => {
    it('should parse null', function () {
        let actual = parser.parse('E5', position);
        expect(actual).to.deep.eq(null);
    });

    it('should parse whole column', function () {
        let actual = parser.parse('SUM(A:A)', position);
        expect(actual).to.deep.eq(6);
    });

    it('should parse whole row', function () {
        let actual = parser.parse('SUM(1:1)', position);
        expect(actual).to.deep.eq(1);
    });

})

describe('Parser allows returning array or range', () => {
    it('should parse array', function () {
        let actual = parser.parse('{1,2,3}', position, true);
        expect(actual).to.deep.eq([[1, 2, 3]]);
        actual = parser.parse('{1,2,3;4,5,6}', position, true);
        expect(actual).to.deep.eq([[1, 2, 3], [4, 5, 6]]);
    });

    it('should parse range', function () {
        let actual = parser.parse('A1:C1', position, true);
        expect(actual).to.deep.eq([[1, 2, 3], [0, 0, 0]]);
    });

    it('should not parse unions', function () {
        let actual = parser.parse('(A1:C1, A2:E9)', position, true);
        expect(actual).to.eq(FormulaError.VALUE);
    });

    it('should return single value', function () {
        let actual = parser.parse('A1', position, true);
        expect(actual).to.eq(1);
    });

    it('should return single value', function () {
        let actual = parser.parse('E5', position, true);
        expect(actual).to.eq(null);
    });
});

describe('async parse', () => {
    it('should return single value', async function () {
        let actual = await parser.parseAsync('A1', position, true);
        expect(actual).to.eq(1);
        actual = await parser.parseAsync('E5', position, true);
        expect(actual).to.eq(null);
    });
});

describe('Custom async function', () => {
    it('should parse and evaluate', async () => {
        const parser = new FormulaParser({
                onCell: ref => {
                    return 1;
                },
                functions: {
                    IMPORT_CSV: async () => {
                        return [[1, 2, 3], [4, 5, 6]];
                    }
                },
            }
        );

        let actual = await parser.parseAsync('A1 + IMPORT_CSV()', position);
        expect(actual).to.eq(2);
        actual = await parser.parseAsync('-IMPORT_CSV()', position);
        expect(actual).to.eq(-1);
        actual = await parser.parseAsync('IMPORT_CSV()%', position);
        expect(actual).to.eq(0.01);
        actual = await parser.parseAsync('SUM(IMPORT_CSV(), 1)', position);
        expect(actual).to.eq(22);

    });
    it('should support custom function with context', async function () {
        const parser = new FormulaParser({
                onCell: ref => {
                    return 1;
                },
                functionsNeedContext: {
                    ROW_PLUS_COL: (context) => {
                        return context.position.row + context.position.col;
                    }
                }
            }
        );
        const actual = await parser.parseAsync('SUM(ROW_PLUS_COL(), 1)', position);
        expect(actual).to.eq(3);
    });

    it('should pass cell position in the argument', async () => {
        const parser = new FormulaParser({
            onCell: ref => {
                return 1;
            },
            functions: {
                UPDATE_CELL: (arg) => {
                    return JSON.stringify(arg.ref);
                }
            }
        });
        let actual = await parser.parseAsync('UPDATE_CELL(A1, "hello world")', position)
        expect(actual).to.eq('{"address":"A1","col":1,"row":1,"sheet":"Sheet1"}');

        actual = await parser.parseAsync('UPDATE_CELL(A1:A10, "hello world")', position)
        expect(actual).to.eq('{"from":{"row":1,"col":1},"to":{"row":10,"col":1},"sheet":"Sheet1"}');
    });
})

describe("Github Issues", function () {
    it('issue-19： Inconsistent results with parse and parseAsync', async function () {
        let res = parser.parse('IF(20 < 0, "yep", "nope")');
        expect(res).to.eq('nope');
        res = await parser.parseAsync('IF(20 < 0, "yep", "nope")');
        expect(res).to.eq('nope');
    });
})

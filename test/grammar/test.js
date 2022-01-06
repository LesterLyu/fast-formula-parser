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
    it('should not parse ACTION', function () {
      let actual = parser.parse('ACTION(INVALID_FORMULA)', position);
      expect(actual).to.deep.eq("ACTION(INVALID_FORMULA)");
    });
  describe('When parser is running action', () => {
    beforeEach(() => {
      parser.isRunningAction = true;
    });
    it('should parse ACTION', function () {
      let actual = parser.parse('ACTION(SUM(1:1))', position);
      expect(actual).to.deep.eq(1);
    });
    it('should parse a boolean array when = is after array', function () {
        let actual = parser.parse('{1,0,1,1,0,0}=1', position, true);
        expect(actual).to.deep.eq([[true, false, true, true, false, false]])
    })
    it('should parse a boolean array when = is before array', function () {
        let actual = parser.parse('1={1,0,1,1,0,0}', position, true);
        expect(actual).to.deep.eq([[true, false, true, true, false, false]])
    })
    it('should parse a boolean for comparing any 2 values', function () {
        let actual = parser.parse('A2=A2', position, true);
        expect(actual).to.deep.eq(true)
    })
    it('should parse a boolean array when comparing 2 arrays', function () {
        let actual = parser.parse('{1,2,3}={1,2,3}', position, true);
        expect(actual).to.deep.eq([[true, true, true]])
    })
    it('should parse a boolean array when comparing a value to an arrays with >', function () {
        let actual = parser.parse('1>{0,2,3}', position, true);
        expect(actual).to.deep.eq([[true, false, false]])
    })
    it('should parse a boolean array when comparing a value to an arrays with >=', function () {
        let actual = parser.parse('1>={0,1,3}', position, true);
        expect(actual).to.deep.eq([[true, true, false]])
    })
    it('should parse a boolean array when comparing a value to an arrays with <', function () {
        let actual = parser.parse('1<{0,2,3}', position, true);
        expect(actual).to.deep.eq([[false, true, true]])
    })
    it('should parse a boolean array when comparing a value to an arrays with <=', function () {
        let actual = parser.parse('1<={0,1,3}', position, true);
        expect(actual).to.deep.eq([[false, true, true]])
    })
    it('should parse a boolean array when comparing a value to an arrays with <>', function () {
        let actual = parser.parse('1<>{0,1,3}', position, true);
        expect(actual).to.deep.eq([[true, false, true]])
    })
    it('should pass this example', function () {
        let actual = parser.parse('{1;2;3} > 5', position, true);
        expect(actual).to.deep.eq([[false], [false], [false]])
    })
    it('should work when flipping arguments', function () {
        let actual = parser.parse('{0,2,3} < 1', position, true);
        expect(actual).to.deep.eq([[true, false, false]])
    })
    it('should parse a boolean array when comparing a value to an arrays with >=', function () {
        let actual = parser.parse('{0,1,3} <= 1', position, true);
        expect(actual).to.deep.eq([[true, true, false]])
    })
    it('should parse a boolean array when comparing a value to an arrays with <', function () {
        let actual = parser.parse('{0,2,3} > 1', position, true);
        expect(actual).to.deep.eq([[false, true, true]])
    })
    it('should parse a boolean array when comparing a value to an arrays with <=', function () {
        let actual = parser.parse('{0,1,3}>=1', position, true);
        expect(actual).to.deep.eq([[false, true, true]])
    })
    it('should parse boolean arrays from cell ranges', function () {
        let actual = parser.parse('A1:C1=1', position, true)
        expect(actual).to.deep.eq([[true, false, false], [false, false, false]])
    })
    it('should parse boolean arrays from cell ranges with the equation flipped', function () {
        let actual = parser.parse('1=A1:C1', position, true)
        expect(actual).to.deep.eq([[true, false, false], [false, false, false]])
    })
    it('should parse boolean arrays from cell ranges with <', function () {
        let actual = parser.parse('1<A1:C1', position, true)
        expect(actual).to.deep.eq([[false, true, true], [false, false, false]])
    })
    it('should parse boolean arrays from cell ranges with <=', function () {
        let actual = parser.parse('1<=A1:C1', position, true)
        expect(actual).to.deep.eq([[true, true, true], [false, false, false]])
    })
    it('should parse boolean arrays from cell ranges with >', function () {
        let actual = parser.parse('1>A1:C1', position, true)
        expect(actual).to.deep.eq([[false, false, false], [true, true, true]])
    })
    it('should parse boolean arrays from cell ranges with >=', function () {
        let actual = parser.parse('1>=A1:C1', position, true)
        expect(actual).to.deep.eq([[true, false, false], [true, true, true]])
    })
    
    it('should parse boolean arrays from cell ranges with > and the equation flipped', function () {
        let actual = parser.parse('A1:C1>1', position, true)
        expect(actual).to.deep.eq([[false, true, true], [false, false, false]])
    })
    it('should parse boolean arrays from cell ranges with >= and the equation flipped', function () {
        let actual = parser.parse('A1:C1>=1', position, true)
        expect(actual).to.deep.eq([[true, true, true], [false, false, false]])
    })
    it('should parse boolean arrays from cell ranges with < and the equation flipped', function () {
        let actual = parser.parse('A1:C1<1', position, true)
        expect(actual).to.deep.eq([[false, false, false], [true, true, true]])
    })
    it('should parse boolean arrays from cell ranges with <= and the equation flipped', function () {
        let actual = parser.parse('A1:C1<=1', position, true)
        expect(actual).to.deep.eq([[true, false, false], [true, true, true]])
    })
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
    it('should work with multiArrays', function() {
        let actual = parser.parse('{{1,2,FALSE},{4,5,"HI"},{7,8,9.7}}', position, true);
        expect(actual).to.deep.eq([[1, 2, false, 4, 5, "HI", 7, 8, 9.7]]);
    });
    it('should allow for functions in arrays', function() {
        let actual = parser.parse('{TRANSPOSE({1,2,3})}', position, true);
        expect(actual).to.deep.eq([[1],[2],[3]]);
    });
    it('should allow for multiple functions in arrays', function() {
        let actual = parser.parse('{TRANSPOSE({1,2}),TRANSPOSE({3,4})}', position, true)
        expect(actual).to.deep.eq([[1,3],[2,4]])
    })
    it('should allow for other functions in arrays', function() {
        let actual = parser.parse('{TRANSPOSE({1,2}),TRANSPOSE({3,4}), TRANSPOSE({5,6})}', position, true);
        expect(actual).to.deep.eq([[1,3,5], [2,4,6]])
    })
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
})

describe("Github Issues", function () {
    it('issue-19： Inconsistent results with parse and parseAsync', async function () {
        let res = parser.parse('IF(20 < 0, "yep", "nope")');
        expect(res).to.eq('nope');
        res = await parser.parseAsync('IF(20 < 0, "yep", "nope")');
        expect(res).to.eq('nope');
    });
})

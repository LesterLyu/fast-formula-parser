// const {FormulaParser} = require('fast-formula-parser');
const {FormulaParser} = require('../lib');
const {FormulaHelpers, Types, FormulaError, MAX_ROW, MAX_COLUMN} = FormulaParser;

const data = [
    // A  B  C
    [1, 2, 3], // row 1
    [4, 5, 6]  // row 2
];

const parser = new FormulaParser({

    // External functions, this will override internal functions with same name
    functions: {
        CHAR: (number) => {
            number = FormulaHelpers.accept(number, Types.NUMBER);
            if (number > 255 || number < 1)
                throw FormulaError.VALUE;
            return String.fromCharCode(number);
        },
    },

    // Variable used in formulas (defined name)
    onVariable: (name, sheetName) => {
        // range reference (A1:B2)
        return {
            sheet: 'sheet name',
            from: {
                row: 1,
                col: 1,
            },
            to: {
                row: 2,
                col: 2,
            }
        };
        // cell reference (A1)
        return {
            sheet: 'sheet name',
            row: 1,
            col: 1
        }
    },

    // retrieve cell value
    onCell: ({sheet, row, col}) => {
        // using 1-based index
        // return the cell value, see possible types in next section.
        return data[row - 1][col - 1];
    },

    // retrieve range values
    onRange: (ref) => {
        // using 1-based index
        // Be careful when ref.to.col is MAX_COLUMN or ref.to.row is MAX_ROW, this will result in
        // unnecessary loops in this approach.
        const arr = [];
        for (let row = ref.from.row; row <= ref.to.row; row++) {
            const innerArr = [];
            if (data[row - 1]) {
                for (let col = ref.from.col; col <= ref.to.col; col++) {
                    innerArr.push(data[row - 1][col - 1]);
                }
            }
            arr.push(innerArr);
        }
        return arr;
    }
});

// parse the formula, the position of where the formula is located is required
// for some functions.
console.log(parser.parse('SUM(A:C)', {sheet: 'Sheet 1', row: 1, col: 1}));
// print 21

// you can specify if the return value can be an array, this is helpful when dealing
// with an array formula
console.log(parser.parse('MMULT({1,5;2,3},{1,2;2,3})', {sheet: 'Sheet 1', row: 1, col: 1}, true));
// print [ [ 11, 17 ], [ 8, 13 ] ]

console.log(parser.parse('SUM(1, "3q")', {sheet: 'Sheet 1', row: 1, col: 1}));

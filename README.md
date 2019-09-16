![GitHub](https://img.shields.io/github/license/lesterlyu/fast-formula-parser)
[![Coverage Status](https://coveralls.io/repos/github/LesterLyu/fast-formula-parser/badge.svg?branch=master)](https://coveralls.io/github/LesterLyu/fast-formula-parser?branch=master)
[![Build Status](https://travis-ci.com/LesterLyu/fast-formula-parser.svg?branch=master)](https://travis-ci.com/LesterLyu/fast-formula-parser)
## [A Fast Excel Formula Parser](https://github.com/LesterLyu/fast-formula-parser)
> **This project is under development.**

Aim to be the fastest and the most reliable excel formula parser in javascript. Using **LL(1)** parser.
### [Documentation](https://lesterlyu.github.io/fast-formula-parser/)
### [Grammar Diagram](https://lesterlyu.github.io/fast-formula-parser/generated_diagrams.html)
### Background

Inspired by [XLParser](https://github.com/spreadsheetlab/XLParser/blob/master/src/XLParser/ExcelFormulaGrammar.cs)
and the paper ["A Grammar for Spreadsheet Formulas Evaluated on Two Large Datasets" by Efthimia Aivaloglou, David Hoepelman and Felienne Hermans](https://fenia266781730.files.wordpress.com/2019/01/07335408.pdf).

Note: The grammar in my implementation is different from theirs. My implementation gets rid of ambiguities to boost the performance.

### What is not supported:
 - [External reference](https://support.office.com/en-ie/article/create-an-external-reference-link-to-a-cell-range-in-another-workbook-c98d1803-dd75-4668-ac6a-d7cca2a9b95f)
    - Anything with `[` and `]`
 - Ambiguous old styles
    - Sheet name contains `:`, e.g. `SUM('1003:1856'!D6)`
    - Sheet name with space that is not quoted, e.g. `I am a sheet!A1`
 - `SUM(Sheet2:Sheet3!A1:C3)`
 - You tell me
    
### Performance
  - The expected performance is at least 3x faster than my optimized [formula-parser](https://github.com/LesterLyu/formula-parser)
  with *more syntax support*.
  
### Dependency
  - [Chevrotain](https://github.com/SAP/chevrotain) , thanks to this great parser building toolkit.
  
### [Examples](https://github.com/LesterLyu/fast-formula-parser/blob/master/examples/example.js)
 - Install
    ```sh
    npm i fast-formula-parser
    # or using yarn
    yarn add fast-formula-parser
    ```
 - Import
    ```js
    const FormulaParser = require('fast-formula-parser');
    const {FormulaHelpers, Types, FormulaError, MAX_ROW, MAX_COLUMN} = FormulaParser;
    // or
    import FormulaParser, {FormulaHelpers, Types, FormulaError, MAX_ROW, MAX_COLUMN} from 'fast-formula-parser';
    ```
  - Usage
    ```js
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
    ```
  - Formula data types in JavaScript
    - Number (date uses number): `1234`
    - String: `'some string'`
    - Boolean: `true`, `false`
    - Array: `[1, 2, true, 'str']`
    - Range Reference: (1-based index)
        ```js
        const ref = {
            sheet: String,
            from: {
                row: Number,
                col: Number,
            },
            to: {
                row: Number,
                col: Number,
            },
        }
        ```
    - Cell Reference: (1-based index)
        ```js
        const ref = {
            sheet: String,
            row: Number,
            col: Number,
        }
        ```
    - [Union](https://github.com/LesterLyu/fast-formula-parser/blob/master/grammar/type/collection.js)
    - [FormulaError](https://lesterlyu.github.io/fast-formula-parser/FormulaError.html)
      - `FormulaError.DIV0`: `#DIV/0!`
      - `FormulaError.NA`: `#N/A`
      - `FormulaError.NAME`: `#NAME?`
      - `FormulaError.NULL`: `#NULL!`
      - `FormulaError.NUM`: `#NUM!`
      - `FormulaError.REF`: `#REF!`
      - `FormulaError.VALUE`: `#VALUE!`

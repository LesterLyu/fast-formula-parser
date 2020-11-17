![GitHub](https://img.shields.io/github/license/lesterlyu/fast-formula-parser)
[![npm (tag)](https://img.shields.io/npm/v/fast-formula-parser/latest)](https://www.npmjs.com/package/fast-formula-parser)
[![npm](https://img.shields.io/npm/dt/fast-formula-parser)](https://www.npmjs.com/package/fast-formula-parser)
[![Coverage Status](https://coveralls.io/repos/github/LesterLyu/fast-formula-parser/badge.svg?branch=master)](https://coveralls.io/github/LesterLyu/fast-formula-parser?branch=master)
[![Build Status](https://travis-ci.com/LesterLyu/fast-formula-parser.svg?branch=master)](https://travis-ci.com/LesterLyu/fast-formula-parser)
## [A Fast Excel Formula Parser & Evaluator](https://github.com/LesterLyu/fast-formula-parser)

A fast and reliable excel formula parser in javascript. Using **LL(1)** parser.

### [Demo](https://lesterlyu.github.io/#/demo/fast-formula-parser)
### [Documentation](https://lesterlyu.github.io/fast-formula-parser/index.html)
### [Grammar Diagram](https://lesterlyu.github.io/fast-formula-parser/generated_diagrams.html)
### Supports 280 Formulas
```
ABS, ACOS, ACOSH, ACOT, ACOTH, ADDRESS, AND, ARABIC, AREAS, ASC, ASIN, ASINH, ATAN, ATAN2, ATANH, AVEDEV, AVERAGE, AVERAGEA, AVERAGEIF, BAHTTEXT, BASE, BESSELI, BESSELJ, BESSELK, BESSELY, BETA.DIST, BETA.INV, BIN2DEC, BIN2HEX, BIN2OCT, BINOM.DIST, BINOM.DIST.RANGE, BINOM.INV, BITAND, BITLSHIFT, BITOR,
BITRSHIFT, BITXOR, CEILING, CEILING.MATH, CEILING.PRECISE, CHAR, CHISQ.DIST, CHISQ.DIST.RT, CHISQ.INV, CHISQ.INV.RT, CHISQ.TEST, CLEAN, CODE, COLUMN, COLUMNS, COMBIN, COMBINA, COMPLEX, CONCAT, CONCATENATE, CONFIDENCE.NORM, CONFIDENCE.T, CORREL, COS, COSH, COT, COTH, COUNT, COUNTIF, COVARIANCE.P,
COVARIANCE.S, CSC, CSCH, DATE, DATEDIF, DATEVALUE, DAY, DAYS, DAYS360, DBCS, DEC2BIN, DEC2HEX, DEC2OCT, DECIMAL, DEGREES, DELTA, DEVSQ, DOLLAR, EDATE, ENCODEURL, EOMONTH, ERF, ERFC, ERROR.TYPE, EVEN, EXACT, EXP, EXPON.DIST, F.DIST, F.DIST.RT, F.INV, F.INV.RT, F.TEST, FACT, FACTDOUBLE, FALSE, FIND, FINDB,
FISHER, FISHERINV, FIXED, FLOOR, FLOOR.MATH, FLOOR.PRECISE, FORECAST, FORECAST.LINEAR, FREQUENCY, GAMMA, GAMMA.DIST, GAMMA.INV, GAMMALN, GAMMALN.PRECISE, GAUSS, GCD, GEOMEAN, GESTEP, GROWTH, HARMEAN, HEX2BIN, HEX2DEC, HEX2OCT, HLOOKUP, HOUR, HYPGEOM.DIST, IF, IFERROR, IFNA, IFS, IMABS, IMAGINARY, IMARGUMENT,
IMCONJUGATE, IMCOS, IMCOSH, IMCOT, IMCSC, IMCSCH, IMDIV, IMEXP, IMLN, IMLOG10, IMLOG2, IMPOWER, IMPRODUCT, IMREAL, IMSEC, IMSECH, IMSIN, IMSINH, IMSQRT, IMSUB, IMSUM, IMTAN, INDEX, INT, INTERCEPT, ISBLANK, ISERR, ISERROR, ISEVEN, ISLOGICAL, ISNA, ISNONTEXT, ISNUMBER, ISO.CEILING, ISOWEEKNUM, ISREF, ISTEXT,
KURT, LCM, LEFT, LEFTB, LN, LOG, LOG10, LOGNORM.DIST, LOGNORM.INV, LOWER, MDETERM, MID, MIDB, MINUTE, MMULT, MOD, MONTH, MROUND, MULTINOMIAL, MUNIT, N, NA, NEGBINOM.DIST, NETWORKDAYS, NETWORKDAYS.INTL, NORM.DIST, NORM.INV, NORM.S.DIST, NORM.S.INV, NOT, NOW, NUMBERVALUE, OCT2BIN, OCT2DEC, OCT2HEX, ODD, OR,
PHI, PI, POISSON.DIST, POWER, PRODUCT, PROPER, QUOTIENT, RADIANS, RAND, RANDBETWEEN, REPLACE, REPLACEB, REPT, RIGHT, RIGHTB, ROMAN, ROUND, ROUNDDOWN, ROUNDUP, ROW, ROWS, SEARCH, SEARCHB, SEC, SECH, SECOND, SERIESSUM, SIGN, SIN, SINH, SQRT, SQRTPI, STANDARDIZE, SUM, SUMIF, SUMPRODUCT, SUMSQ, SUMX2MY2, 
SUMX2PY2, SUMXMY2, T, T.DIST, T.DIST.2T, T.DIST.RT, T.INV, T.INV.2T, TAN, TANH, TEXT, TIME, TIMEVALUE, TODAY, TRANSPOSE, TRIM, TRUE, TRUNC, TYPE, UNICHAR, UNICODE, VLOOKUP, WEBSERVICE, WEEKDAY, WEEKNUM, WEIBULL.DIST, WORKDAY, WORKDAY.INTL, XOR, YEAR, YEARFRAC
```
### Size: 291KB Minified, 81KB Gzipped+Minified

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
  - The expected performance is at least 3x faster than the optimized [formula-parser](https://github.com/LesterLyu/formula-parser).
  
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
    UMD minified build is also provides:
    ```html
    <script src="/node_modules/fast-formula-parser/build/parser.min.js"> </script> 
    ```
  - Basic Usage
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
            }
        },
    
        // Variable used in formulas (defined name)
        // Should only return range reference or cell reference
        onVariable: (name, sheetName) => {
            // If it is a range reference (A1:B2)
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
            // If it is a cell reference (A1)
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
    
    // position is required for evaluating certain formulas, e.g. ROW()
    const position = {row: 1, col: 1, sheet: 'Sheet1'};
    
    // parse the formula, the position of where the formula is located is required
    // for some functions.
    console.log(parser.parse('SUM(A:C)', position));
    // print 21
    
    // you can specify if the return value can be an array, this is helpful when dealing
    // with an array formula
    console.log(parser.parse('MMULT({1,5;2,3},{1,2;2,3})', position, true));
    // print [ [ 11, 17 ], [ 8, 13 ] ]
    ```
    
  - Custom Async functions
    > Remember to use `await parser.parseAsync(...)` instead of `parser.parse(...)`
    ```js
    const position = {row: 1, col: 1, sheet: 'Sheet1'};
    const parser = new FormulaParser({
        onCell: ref => {
            return 1;
        },
        functions: {
            DEMO_FUNC: async () => {
                return [[1,2,3],[4,5,6]];
            }
        },
    });
    console.log(await parser.parseAsync('A1 + IMPORT_CSV())', position));
    // print 2
    console.log(await parser.parseAsync('SUM(DEMO_FUNC(), 1))', position));
    // print 22
    ```
  - Custom function requires parser context (e.g. location of the formula)
    ```js
    const position = {row: 1, col: 1, sheet: 'Sheet1'};
    const parser = new FormulaParser({
        functionsNeedContext: {
            // the first argument is the context
            // the followings are the arguments passed to the function
            ROW_PLUS_COL: (context, ...args) => {
                 return context.position.row + context.position.col;
            }
        },
    });
    console.log(await parser.parseAsync('SUM(ROW_PLUS_COL(), 1)', position));
    // print 3
    ```
    
  - Parse Formula Dependency
    > This is helpful for building `dependency graph/tree`.
    ```js
    import {DepParser} from 'fast-formula-parser';
    const depParser = new DepParser({
        // onVariable is the only thing you need provide if the formula contains variables
        onVariable: variable => {
            return 'VAR1' === variable ? {from: {row: 1, col: 1}, to: {row: 2, col: 2}} : {row: 1, col: 1};
        }
    });
    
    // position of the formula should be provided
    const position = {row: 1, col: 1, sheet: 'Sheet1'};
    
    // Return an array of references (range reference or cell reference)
    // This gives [{row: 1, col: 1, sheet: 'Sheet1'}]
    depParser.parse('A1+1', position);
    
    // This gives [{sheet: 'Sheet1', from: {row: 1, col: 1}, to: {row: 3, col: 3}}]
    depParser.parse('A1:C3', position);
    
    // This gives [{from: {row: 1, col: 1}, to: {row: 2, col: 2}}]
    depParser.parse('VAR1 + 1', position);
    
    // Complex formula
    depParser.parse('IF(MONTH($K$1)<>MONTH($K$1-(WEEKDAY($K$1,1)-(start_day-1))-IF((WEEKDAY($K$1,1)-(start_day-1))<=0,7,0)+(ROW(O5)-ROW($K$3))*7+(COLUMN(O5)-COLUMN($K$3)+1)),"",$K$1-(WEEKDAY($K$1,1)-(start_day-1))-IF((WEEKDAY($K$1,1)-(start_day-1))<=0,7,0)+(ROW(O5)-ROW($K$3))*7+(COLUMN(O5)-COLUMN($K$3)+1))', position);
    // This gives the following result
    const result = [
        {
            "col": 11,
            "row": 1,
            "sheet": "Sheet1",
        },
        {
            "col": 1,
            "row": 1,
            "sheet": "Sheet1",
        },
        {
            "col": 15,
            "row": 5,
            "sheet": "Sheet1",
        },
        {
            "col": 11,
            "row": 3,
            "sheet": "Sheet1",
        },
    ];
    ```
    
### Formula data types in JavaScript
> The following data types are used in excel formulas and these are the only valid data types a formula or a function can return.
   - Number (date uses number): `1234`
   - String: `'some string'`
   - Boolean: `true`, `false`
   - Array: `[[1, 2, true, 'str']]`
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
   - [Union (e.g. (A1:C3, E1:G6))](https://github.com/LesterLyu/fast-formula-parser/blob/master/grammar/type/collection.js)
   - [FormulaError](https://lesterlyu.github.io/fast-formula-parser/FormulaError.html)
     - `FormulaError.DIV0`: `#DIV/0!`
     - `FormulaError.NA`: `#N/A`
     - `FormulaError.NAME`: `#NAME?`
     - `FormulaError.NULL`: `#NULL!`
     - `FormulaError.NUM`: `#NUM!`
     - `FormulaError.REF`: `#REF!`
     - `FormulaError.VALUE`: `#VALUE!`
      
### Types Definition
> Comming soon

### Error handling

 - Lexing/Parsing Error
    > Error location is available at `error.details.errorLocation`
    ```js
    try {
        parser.parse('SUM(1))', position);
    } catch (e) {
        console.log(e);
        // #ERROR!:
        // SUM(1))
        //       ^
        // Error at position 1:7
        // Redundant input, expecting EOF but found: )
   
        expect(e).to.be.instanceof(FormulaError);
        expect(e.details.errorLocation.line).to.eq(1);
        expect(e.details.errorLocation.column).to.eq(7);
        expect(e.name).to.eq('#ERROR!');
        expect(e.details.name).to.eq('NotAllInputParsedException');
    }
    ```
 - Error from internal/external functions or unexpected error from the parser
    > The error will be wrapped into `FormulaError`. The exact error is in `error.details`.
    ```js
    const parser = new FormulaParser({
        functions: {
            BAD_FN: () => {
                throw new SyntaxError();
            }
        }
    });
   
    try {
        parser.parse('SUM(1))', position);
    } catch (e) {
        expect(e).to.be.instanceof(FormulaError);
        expect(e.name).to.eq('#ERROR!');
        expect(e.details.name).to.eq('SyntaxError');
    }
    ```

### Thanks
- [![JetBrains](https://raw.githubusercontent.com/LesterLyu/fast-formula-parser/master/logos/jetbrains-variant-4.svg)](https://www.jetbrains.com/?from=fast-formula-parser)

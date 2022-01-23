const FormulaError = require('../formulas/error');
const {Address} = require('../formulas/helpers');
const {Prefix, Postfix, Infix, Operators} = require('../formulas/operators');
const Collection = require('./type/collection');
const MAX_ROW = 1048576, MAX_COLUMN = 16384;
const {NotAllInputParsedException} = require('chevrotain');
const lexer = require('./lexing');

const DatetimeValueFunctions = new Set([
  "NOW"
]);
const DateValueFunctions = new Set([
  "DATE",
  "TODAY",
  "DATEDIF",
]);

const NumberValueFunctions = new Set([
  "YEAR",
  "MONTH",
  "DAY",
  "HOUR",
  "MINUTE",
  "SECOND",
  "DATEVALUE",
]);
class Utils {

    constructor(context) {
        this.context = context;
    }

    columnNameToNumber(columnName) {
        return Address.columnNameToNumber(columnName);
    }

    /**
     * Parse the cell address only.
     * @param {string} cellAddress
     * @return {{ref: {col: number, address: string, row: number}}}
     */
    parseCellAddress(cellAddress) {
        const res = cellAddress.match(/([$]?)([A-Za-z]{1,3})([$]?)([1-9][0-9]*)/);
        // console.log('parseCellAddress', cellAddress);
        return {
            ref: {
                address: res[0],
                col: this.columnNameToNumber(res[2]),
                row: +res[4]
            },
        };
    }

    parseRow(row) {
        const rowNum = +row;
        if (!Number.isInteger(rowNum))
            throw Error('Row number must be integer.');
        return {
            ref: {
                col: undefined,
                row: +row
            },
        };
    }

    parseCol(col) {
        return {
            ref: {
                col: this.columnNameToNumber(col),
                row: undefined,
            },
        };
    }

    parseColRange(col1, col2) {
        // const res = colRange.match(/([$]?)([A-Za-z]{1,3}):([$]?)([A-Za-z]{1,4})/);
        col1 = this.columnNameToNumber(col1);
        col2 = this.columnNameToNumber(col2);
        return {
            ref: {
                from: {
                    col: Math.min(col1, col2),
                    row: null
                },
                to: {
                    col: Math.max(col1, col2),
                    row: null
                }
            }
        }
    }

    parseRowRange(row1, row2) {
        // const res = rowRange.match(/([$]?)([1-9][0-9]*):([$]?)([1-9][0-9]*)/);
        return {
            ref: {
                from: {
                    col: null,
                    row: Math.min(row1, row2),
                },
                to: {
                    col: null,
                    row: Math.max(row1, row2),
                }
            }

        }
    }


    _applyPrefix(prefixes, val, isArray) {
        if (this.isFormulaError(val))
            return val;
        return Prefix.unaryOp(prefixes, val, isArray);
    }

    async applyPrefixAsync(prefixes, value) {
        const {val, isArray} = this.extractRefValue(await value);
        return this._applyPrefix(prefixes, val, isArray);
    }

    /**
     * Apply + or - unary prefix.
     * @param {Array.<string>} prefixes
     * @param {*} value
     * @return {*}
     */
    applyPrefix(prefixes, value) {
        // console.log('applyPrefix', prefixes, value);
        if (this.context.async) {
            return this.applyPrefixAsync(prefixes, value);
        } else {
            const {val, isArray} = this.extractRefValue(value);
            return this._applyPrefix(prefixes, val, isArray);
        }
    }

    _applyPostfix(val, isArray, postfix) {
        if (this.isFormulaError(val))
            return val;
        return Postfix.percentOp(val, postfix, isArray);
    }

    async applyPostfixAsync(value, postfix) {
        const {val, isArray} = this.extractRefValue(await value);
        return this._applyPostfix(val, isArray, postfix);
    }

    applyPostfix(value, postfix) {
        // console.log('applyPostfix', value, postfix);
        if (this.context.async) {
            return this.applyPostfixAsync(value, postfix);
        } else {
            const {val, isArray} = this.extractRefValue(value);
            return this._applyPostfix(val, isArray, postfix)
        }
    }

    _applyInfix(res1, infix, res2) {
        const val1 = res1.val, isArray1 = res1.isArray;
        const val2 = res2.val, isArray2 = res2.isArray;
        if (this.isFormulaError(val1))
            return val1;
        if (this.isFormulaError(val2))
            return val2;
        if (Operators.compareOp.includes(infix))
            return Infix.compareOp(val1, infix, val2, isArray1, isArray2);
        else if (Operators.concatOp.includes(infix))
            return Infix.concatOp(val1, infix, val2, isArray1, isArray2);
        else if (Operators.mathOp.includes(infix))
            return Infix.mathOp(val1, infix, val2, isArray1, isArray2);
        else
            throw new Error(`Unrecognized infix: ${infix}`);
    }

    async applyInfixAsync(value1, infix, value2) {
        const res1 = this.extractRefValue(await value1);
        const res2 = this.extractRefValue(await value2);
        return this._applyInfix(res1, infix, res2)
    }

    applyInfix(value1, infix, value2) {
        if (this.context.async) {
            return this.applyInfixAsync(value1, infix, value2)
        } else {
            const res1 = this.extractRefValue(value1);
            const res2 = this.extractRefValue(value2);
            return this._applyInfix(res1, infix, res2)
        }
    }

    applyIntersect(refs) {
        // console.log('applyIntersect', refs);
        if (this.isFormulaError(refs[0]))
            return refs[0];
        if (!refs[0].ref)
            throw Error(`Expecting a reference, but got ${refs[0]}.`);
        // a intersection will keep track of references, value won't be retrieved here.
        let maxRow, maxCol, minRow, minCol, sheet, res; // index start from 1
        // first time setup
        const ref = refs.shift().ref;
        sheet = ref.sheet;
        if (!ref.from) {
            // check whole row/col reference
            if (ref.row === undefined || ref.col === undefined) {
                throw Error('Cannot intersect the whole row or column.')
            }

            // cell ref
            maxRow = minRow = ref.row;
            maxCol = minCol = ref.col;
        } else {
            // range ref
            // update
            maxRow = Math.max(ref.from.row, ref.to.row);
            minRow = Math.min(ref.from.row, ref.to.row);
            maxCol = Math.max(ref.from.col, ref.to.col);
            minCol = Math.min(ref.from.col, ref.to.col);
        }

        let err;
        refs.forEach(ref => {
            if (this.isFormulaError(ref))
                return ref;
            ref = ref.ref;
            if (!ref) throw Error(`Expecting a reference, but got ${ref}.`);
            if (!ref.from) {
                if (ref.row === undefined || ref.col === undefined) {
                    throw Error('Cannot intersect the whole row or column.')
                }
                // cell ref
                if (ref.row > maxRow || ref.row < minRow || ref.col > maxCol || ref.col < minCol
                    || sheet !== ref.sheet) {
                    err = FormulaError.NULL;
                }
                maxRow = minRow = ref.row;
                maxCol = minCol = ref.col;
            } else {
                // range ref
                const refMaxRow = Math.max(ref.from.row, ref.to.row);
                const refMinRow = Math.min(ref.from.row, ref.to.row);
                const refMaxCol = Math.max(ref.from.col, ref.to.col);
                const refMinCol = Math.min(ref.from.col, ref.to.col);
                if (refMinRow > maxRow || refMaxRow < minRow || refMinCol > maxCol || refMaxCol < minCol
                    || sheet !== ref.sheet) {
                    err = FormulaError.NULL;
                }
                // update
                maxRow = Math.min(maxRow, refMaxRow);
                minRow = Math.max(minRow, refMinRow);
                maxCol = Math.min(maxCol, refMaxCol);
                minCol = Math.max(minCol, refMinCol);
            }
        });
        if (err) return err;
        // check if the ref can be reduced to cell reference
        if (maxRow === minRow && maxCol === minCol) {
            res = {
                ref: {
                    sheet,
                    row: maxRow,
                    col: maxCol
                }
            }
        } else {
            res = {
                ref: {
                    sheet,
                    from: {row: minRow, col: minCol},
                    to: {row: maxRow, col: maxCol}
                }
            };
        }

        if (!res.ref.sheet)
            delete res.ref.sheet;
        return res;
    }

    applyUnion(refs) {
        const collection = new Collection();
        for (let i = 0; i < refs.length; i++) {
            if (this.isFormulaError(refs[i]))
                return refs[i];
            collection.add(this.extractRefValue(refs[i]).val, refs[i]);
        }

        // console.log('applyUnion', unions);
        return collection;
    }

    /**
     * Apply multiple references, e.g. A1:B3:C8:A:1:.....
     * @param refs
     // * @return {{ref: {from: {col: number, row: number}, to: {col: number, row: number}}}}
     */
    applyRange(refs) {
        let res, maxRow = -1, maxCol = -1, minRow = MAX_ROW + 1, minCol = MAX_COLUMN + 1;
        refs.forEach(ref => {
            if (this.isFormulaError(ref))
                return ref;
            // row ref is saved as number, parse the number to row ref here
            if (typeof ref === 'number') {
                ref = this.parseRow(ref);
            }
            ref = ref.ref;
            // check whole row/col reference
            if (ref.row === undefined) {
                minRow = 1;
                maxRow = MAX_ROW
            }
            if (ref.col === undefined) {
                minCol = 1;
                maxCol = MAX_COLUMN;
            }

            if (ref.row > maxRow)
                maxRow = ref.row;
            if (ref.row < minRow)
                minRow = ref.row;
            if (ref.col > maxCol)
                maxCol = ref.col;
            if (ref.col < minCol)
                minCol = ref.col;
        });
        if (maxRow === minRow && maxCol === minCol) {
            res = {
                ref: {
                    row: maxRow,
                    col: maxCol
                }
            }
        } else {
            res = {
                ref: {
                    from: {row: minRow, col: minCol},
                    to: {row: maxRow, col: maxCol}
                }
            };
        }
        return res;
    }

    /**
     * Throw away the refs, and retrieve the value.
     * @return {{val: *, isArray: boolean}}
     */
    extractRefValue(obj) {
        let res = obj, isArray = false;
        if (Array.isArray(res) || res.ref != null && res.ref.from != null && res.ref.to != null)
            isArray = true;
        if (obj.ref) {
            // can be number or array
            return {val: this.context.retrieveRef(obj), isArray};

        }
        return {val: res, isArray};
    }

    /**
     *
     * @param array
     * @return {Array}
     */
    toArray(array) {
        // TODO: check if array is valid
        // console.log('toArray', array);
        return array;
    }

    /**
     * @param {string} number
     * @return {number}
     */
    toNumber(number) {
        return Number(number);
    }

    /**
     * @param {string} string
     * @return {string}
     */
    toString(string) {
        return string.substring(1, string.length - 1) .replace(/""/g, '"');
    }

    /**
     * @param {string} bool
     * @return {boolean}
     */
    toBoolean(bool) {
        return bool === 'TRUE';
    }

    /**
     * Parse an error.
     * @param {string} error
     * @return {string}
     */
    toError(error) {
        return new FormulaError(error.toUpperCase());
    }

    isFormulaError(obj) {
        return obj instanceof FormulaError;
    }

    static formatChevrotainError(error, inputText) {
        let line, column, msg = '';
        // e.g. SUM(1))
        if (error instanceof NotAllInputParsedException) {
            line = error.token.startLine;
            column = error.token.startColumn;
        } else {
            line = error.previousToken.startLine;
            column = error.previousToken.startColumn + 1;
        }

        msg += '\n' + inputText.split('\n')[line - 1] + '\n';
        msg += Array(column - 1).fill(' ').join('') + '^\n';
        msg += `Error at position ${line}:${column}\n` + error.message;
        error.errorLocation = {line, column};
        return FormulaError.ERROR(msg, error);
    }
  static cleanFunctionToken(text) {
      return text.replace(new RegExp(/\(|\)/, 'gi'), '');
  };

  static isTokenInList(tokens, set) {
    return tokens.length > 0 && tokens.some(token => set.has(token));
  };

  static isDatetime(result, text, dependencies) {
    if (text === null || typeof result === 'string') {
      return false;
    }
    const { tokens } = lexer.lex(text);
    const normalizedTokens = tokens
        .filter(token => token.tokenType.name === 'Function')
        .map(token => Utils.cleanFunctionToken(token.image).toUpperCase());

    const areAllDependenciesADatetime = dependencies.length > 0 && dependencies.every(d => d.resultType === 'datetime' || d.datatype === 'datetime');

    const numberFunction = Utils.isTokenInList(normalizedTokens, NumberValueFunctions);
    const dtFunction = Utils.isTokenInList(normalizedTokens, DatetimeValueFunctions);
    return !numberFunction && (dtFunction || areAllDependenciesADatetime);
  };

  static isDate(result, text, dependencies) {
    if (text === null || typeof result === 'string') {
      return false;
    }
    const { tokens } = lexer.lex(text);
    const normalizedTokens = tokens
        .filter(token => token.tokenType.name === 'Function')
        .map(token => Utils.cleanFunctionToken(token.image).toUpperCase());

    const areAllDependenciesADate = dependencies.length > 0 && dependencies.every(d => d.resultType === 'date' || d.datatype === 'date');
    return !Utils.isTokenInList(normalizedTokens, NumberValueFunctions) && (Utils.isTokenInList(normalizedTokens, DateValueFunctions) || areAllDependenciesADate);
  };

  static resultType(result, inputText, dependencies) {
    if (Array.isArray(result)) {
      return 'array';
    }
    if (typeof result === 'string') {
      return 'string';
    }
    if (result === null || result === undefined) {
      return undefined;
    }
    if (typeof result === 'boolean') {
      return 'boolean';
    }
    if (result instanceof Date || (!isNaN(Number(result)) && Utils.isDatetime(result, inputText, dependencies))) {
      return 'datetime';
    }
    if (result instanceof Date || (!isNaN(Number(result)) && Utils.isDate(result, inputText, dependencies))) {
      return 'date';
    }
    if (!isNaN(Number(result))) {
      return 'number';
    }
    return 'string';
  }

  static addType(rawResult, inputText, dependencies) {
    let result;
    if (typeof rawResult === "string") {
      try {
        result = JSON.parse(rawResult);
      // if not json, it's fine, just treat like normal string
      } catch (e) {
        result = rawResult;
      }
    } else {
      result = rawResult;
    }

    if(Array.isArray(result)) {
      if(result.length === 0) {
        result.push([]);
      }
      // {1, 2, 3} is a horizontal array, so too are all plain arrays
      if(!Array.isArray(result[0])) {
        result = [result];
      }
      let baseData = dependencies.find(d => {
        return Array.isArray(d) && Array.isArray(d[0]) && d[0].length === result[0].length;
      });
      for(let i = 0; i < result.length; i++){
        for(let j = 0; j < result[i].length; j++) {
          if(typeof result[i][j] !== "object") {
            let resultType;
            // Hack to get dates to work when making filter tables
            if(baseData && typeof result[i][j] === "number" && baseData[0][j].resultType === "date") {
              resultType = "date";
            } else {
              resultType = Utils.resultType(result[i][j], inputText, dependencies)
            }

            result[i][j] = {
              result: result[i][j],
              resultType,
            }
          }
        }
      }
    }
    // result already is typed
    if (!Array.isArray(result) && typeof result === "object" && result !== null && "result" in result && "resultType" in result) {
      return result;
    }
    if (!Array.isArray(result) && typeof result === "object") {
      return {
        result: rawResult,
        resultType: 'string',
      }
    }
    return {
      result,
      resultType: Utils.resultType(result, inputText, dependencies),
    }
  }

  static expandActionMacro(tokens) {
    return `SUM(${tokens.slice(1,tokens.length-1).map(t => t.image).join("")})`;
  }

  static findAllIndicies(a, f) {
    const b = [];
    b.push(a.findIndex(f));
    while(b[b.length - 1] !== -1 ) {
      b.push(a.findIndex((e, i) => i > b[b.length - 1] && f(e)));
    }
    return b.slice(0, b.length - 1);
  }

  static expandComputedColumnMacro(tokens) {
    const commaLocations = Utils.findAllIndicies(tokens, t => t.tokenType.name === "Comma")
    const tableComma = commaLocations[commaLocations.length - 2];
    const columnComma = commaLocations[commaLocations.length - 1];

    const tableName = tokens.slice(tableComma+1, columnComma).map(t => t.image).join(" ")
    const columnName = tokens.slice(columnComma+1, tokens.length-1).map(t => t.image).join(" ")
    const rArgs = [
      `"=${tokens.slice(1, tableComma).map(t => t.image).join("")}"`,
      `ROWS(${tableName}[])`
    ];

    return `extendTable(repeat(${rArgs[0]},${rArgs[1]},1), "${tableName}", {"${columnName}"})`;
  }

  static isMacro(tokens, macroName) {
    return tokens.length > 0 && tokens[0].image.toUpperCase() === `${macroName}(` && tokens[tokens.length-1].tokenType.name === "CloseParen";
  }
}

module.exports = Utils;

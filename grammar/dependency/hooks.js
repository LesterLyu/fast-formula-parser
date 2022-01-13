const FormulaError = require('../../formulas/error');
const {FormulaHelpers} = require('../../formulas/helpers');
const {Parser} = require('../parsing');
const lexer = require('../lexing');
const Utils = require('./utils');
const GrammarUtils = require('../utils');
const {formatChevrotainError} = require('../utils');

class DepParser {

    /**
     *
     * @param {{onVariable: Function}} [config]
     */
    constructor(config) {
        this.data = [];
        this.utils = new Utils(this);
        config = Object.assign({
            onVariable: () => null,
            onStructuredReference: () => ({ref: null}),
        }, config);
        this.utils = new Utils(this);

        this.onVariable = config.onVariable;
        this.onStructuredReference = config.onStructuredReference
        this.functions = {}

        this.parser = new Parser(this, this.utils);
    }

    /**
     * Get value from the cell reference
     * @param ref
     * @return {*}
     */
    getCell(ref) {
        // console.log('get cell', JSON.stringify(ref));
        if (ref.row != null) {
            if (ref.sheet == null)
                ref.sheet = this.position ? this.position.sheet : undefined;
            const idx = this.data.findIndex(element => {
                return (element.from && element.from.row <= ref.row && element.to.row >= ref.row
                    && element.from.col <= ref.col && element.to.col >= ref.col)
                    || (element.row === ref.row && element.col === ref.col && element.sheet === ref.sheet)
            });
            if (idx === -1)
                this.data.push(ref);
        }
        return 0;
    }

    /**
     * Get values from the range reference.
     * @param ref
     * @return {*}
     */
    getRange(ref) {
        // console.log('get range', JSON.stringify(ref));
        if (ref.from.row != null) {
            if (ref.sheet == null)
                ref.sheet = this.position ? this.position.sheet : undefined;

            const idx = this.data.findIndex(element => {
                return element.from && element.from.row === ref.from.row && element.from.col === ref.from.col
                    && element.to.row === ref.to.row && element.to.col === ref.to.col;
            });
            if (idx === -1)
                this.data.push(ref);
        }
        return [[0]]
    }

    /**
     * TODO:
     * Get references or values from a user defined variable.
     * @param name
     * @return {*}
     */
    getVariable(name) {
        // console.log('get variable', name);
        const res = {ref: this.onVariable(name, this.position.sheet)};
        if (res.ref == null)
            return FormulaError.NAME;
        if (FormulaHelpers.isCellRef(res))
            this.getCell(res.ref);
        else {
            this.getRange(res.ref);
        }
        return 0;
    }

    /**
     * Get references or values for a structured referte
     * @param {string} tableName 
     * @param {string} columnName 
     * @param {boolean} thisRow 
     */
    getStructuredReference (tableName, columnName, thisRow, specialItem) {
        const res = {ref: this.onStructuredReference(tableName, columnName, thisRow, specialItem, this.position.sheet, this.position)};
        if (res.ref == null)
            return FormulaError.NAME;
        if (FormulaHelpers.isCellRef(res))
            this.getCell(res.ref);
        else {
            this.getRange(res.ref);
        }
        return 0;
    }

    /**
     * Retrieve values from the given reference.
     * @param valueOrRef
     * @return {*}
     */
    retrieveRef(valueOrRef) {
        if (FormulaHelpers.isRangeRef(valueOrRef)) {
            return this.getRange(valueOrRef.ref);
        }
        if (FormulaHelpers.isCellRef(valueOrRef)) {
            return this.getCell(valueOrRef.ref)
        }
        return valueOrRef;
    }

    /**
     * Call an excel function.
     * @param name - Function name.
     * @param args - Arguments that pass to the function.
     * @return {*}
     */
    callFunction(name, args) {
        args.filter((arg, i) =>
            !(arg == null || (name === "UPDATECELL" && i === 0))
        ).forEach(arg => {
            this.retrieveRef(arg);
        });
        if (name === "extendTable") {
          const title = args[1];
          const lTable = window.lTablesRef.current.find(t => t.title === title);
          if(lTable) {
            this.data.push(lTable.masterCell);
            const leftExtensions = lTable.extensions.filter(e => e.col < this.position.col).sort(e => {
              return this.position.col - e.col;
            })
            if (leftExtensions.length > 0) {
              this.data.push(leftExtensions[0]);
            }
          }
        }
        return 0;
    }

    /**
     * Check and return the appropriate formula result.
     * @param result
     * @return {*}
     */
    checkFormulaResult(result) {
        this.retrieveRef(result);
    }

    /**
     * Parse an excel formula and return the dependencies
     * @param {string} inputText
     * @param {{row: number, col: number, sheet: string}} position
     * @param {boolean} [ignoreError=false] if true, throw FormulaError when error occurred.
     *                                      if false, the parser will return partial dependencies.
     * @returns {Array.<{}>}
     */
    parse(inputText, position, ignoreError = false) {
        if (inputText.length === 0) throw Error('Input must not be empty.');


        this.data = [];
        this.position = position;
        const { tokens } = lexer.lex(inputText);

        if (GrammarUtils.isComputedColumnMacro(tokens)) {
          return this.parse(GrammarUtils.expandComputedColumnMacro(tokens), position, ignoreError);
        }

        this.parser.input = tokens;
        try {
            const res = this.parser.formulaWithBinaryOp();
            this.checkFormulaResult(res);
        } catch (e) {
            console.error(e);
            if (!ignoreError) {
                throw FormulaError.ERROR(e.message, e);
            }
        }

        // FFP bugs out when we call parse from within formulaWithBinaryOp, so
        // instead we have to hack it up here.
        // In theory this will also break if people do multiple repeats but that's unlikely.
        if (tokens.some(t => t.image === "repeat(")) {
          // this.parse wipes this.data, so we need to store and reuse.
          const d = this.data.slice();
          const token = tokens[tokens.findIndex(t => t.image === "repeat(") + 1];
          if (token.image[1] === "=") {
            const subData = this.parse(token.image.slice(2, token.image.length-1), position, ignoreError)
            this.data.push(...subData);
          }
          this.data.push(...d);
        }
        if (this.parser.errors.length > 0 && !ignoreError) {
            const error = this.parser.errors[0];
            throw formatChevrotainError(error, inputText);
        }

        return this.data;
    }
}

module.exports = {
    DepParser,
};

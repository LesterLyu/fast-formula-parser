const FormulaError = require('../../formulas/error');
const {FormulaHelpers} = require('../../formulas/helpers');
const {Parser} = require('../parsing');
const lexer = require('../lexing');
const Utils = require('./utils');

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
        }, config);
        this.utils = new Utils(this);

        this.onVariable = config.onVariable;
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
     * The functions that can return a reference instead of a value as normal functions.
     * Note: Not all functions from "Lookup and reference" category can return a reference.
     * {@link https://support.office.com/en-ie/article/lookup-and-reference-functions-reference-8aa21a3a-b56a-4055-8257-3ec89df2b23e}
     * @param name - Reference function name.
     * @param args - Arguments that pass to the function.
     */
    callRefFunction(name, args) {
       return this.callFunction(name, args);
    }

    /**
     * Call an excel function.
     * @param name - Function name.
     * @param args - Arguments that pass to the function.
     * @return {*}
     */
    callFunction(name, args) {
        args.forEach(arg => {
            if (arg == null)
                return;
            this.retrieveRef(arg);
        });
        return {value: 0, ref: {}};
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
     * @param {boolean} [printOnError=true] print errors if true.
     * @returns {Array.<{}>}
     */
    parse(inputText, position, printOnError = true) {
        if (inputText.length === 0) throw Error('Input must not be empty.');
        this.data = [];
        this.position = position;
        const lexResult = lexer.lex(inputText);
        this.parser.input = lexResult.tokens;
        try {
            let res = this.parser.formulaWithBinaryOp();
            this.checkFormulaResult(res);
            if (this.parser.errors.length > 0 && printOnError) {
                const error = this.parser.errors[0];
                console.warn(`Error in ${inputText}:`);
                console.warn(error)
            }
        } catch (e) {
            if (printOnError) {
                console.warn(`Error in ${inputText}:`);
                console.warn(e);
            }
        }

        return this.data;
    }
}

module.exports = {
    DepParser,
};

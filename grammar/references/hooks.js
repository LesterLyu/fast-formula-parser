const FormulaError = require('../../formulas/error');
const {FormulaHelpers} = require('../../formulas/helpers');
const {Parser} = require('../parsing');
const lexer = require('../lexing');
const Utils = require('./utils');
const {formatChevrotainError} = require('../utils');

class RefParser {

    /**
     *
     * @param {}
     */
    constructor() {
        this.data = [];
        this.utils = new Utils(this);

        this.parser = new Parser(this, this.utils);
    }

    /**
     * Get value from the cell reference
     * @param ref
     * @return {*}
     */
    getCell(ref) {
        // console.log('get cell', JSON.stringify(ref));
        return 0;
    }

    /**
     * Get values from the range reference.
     * @param ref
     * @return {*}
     */
    getRange(ref) {
        // console.log('get range', JSON.stringify(ref));
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
     * Parse an excel formula and return the column/row/cell/variable references
     * @param {string} inputText
     * @param {{row: number, col: number, sheet: string}} position
     * @param {boolean} [ignoreError=false] if true, throw FormulaError when error occurred.
     *                                      if false, the parser will return partial references.
     * @returns {Array.<{}>}
     */
    parse(inputText, position, ignoreError = false) {
        if (inputText.length === 0) throw Error('Input must not be empty.');
        this.data = [];
        this.position = position;
        const lexResult = lexer.lex(inputText);
        this.parser.input = lexResult.tokens;
        try {
            const res = this.parser.formulaWithBinaryOp();
            this.checkFormulaResult(res);
        } catch (e) {
            if (!ignoreError) {
                throw FormulaError.ERROR(e.message, e);
            }
        }
        if (this.parser.errors.length > 0 && !ignoreError) {
            const error = this.parser.errors[0];
            throw formatChevrotainError(error, inputText);
        }

        return this.data;
    }

    /**
     * Replace column/row/cell/variable references in formula
     * @param {string} inputText
     * @param {{row: number, col: number, sheet: string}} position
     * @param {({type: 'row' | 'column', from: number, to?: number} | {type: 'variable', from: string, to?: string} | {type: 'cell', from: {row: number, col: number}, to?: {row: number, col: number}})[] script
     * @param {boolean} [ignoreError=false] if true, throw FormulaError when error occurred.
     *                                      if false, the parser will return partial references.
     * @returns {Array.<{}>}
     */
    replace(inputText, position, script, ignoreError = false) {
        if (inputText.length === 0) throw Error('Input must not be empty.');

        const references = this.parse(inputText, position, ignoreError);

        const changes = [];
        for(let index = 0; index < script.length; index++) {
            const command = script[index];

            const processOneCommand = (flattenWith, to, order) => {
                changes.push(...references
                    .map(flattenWith)
                    .filter((reference) => reference !== undefined)
                    .map((reference) => ({ ...reference, to, order })));
            };

            switch( command.type ) {
                case 'row':
                    processOneCommand(
                        (reference) =>
                            reference.type === 'row' ? reference.ref.row === command.from ? reference : undefined :
                            reference.type === 'cell' ? reference.ref.row === command.from ? reference.row : undefined :
                            undefined,
                        command.to == null ? undefined : command.to.toString(),
                        index
                    );
                    if( command.to == null ) {
                        processOneCommand(
                            (reference) =>
                                reference.type === 'cell' ? reference.ref.row === command.from ? reference.col : undefined :
                                undefined,
                            '',
                            index
                        );
                    }
                    break;
                case 'col':
                    processOneCommand(
                        (reference) =>
                            reference.type === 'col' ? reference.ref.col === command.from ? reference : undefined :
                            reference.type === 'cell' ? reference.ref.col === command.from ? reference.col : undefined :
                            undefined,
                        command.to == null ? undefined : this.utils.columnNumberToName(command.to),
                        index
                    );
                    if( command.to == null ) {
                        processOneCommand(
                            (reference) =>
                                reference.type === 'cell' ? reference.ref.col === command.from ? reference.row : undefined :
                                undefined,
                            '',
                            index
                        );
                    }
                    break;
                case 'cell':
                    processOneCommand(
                        (reference) =>
                            reference.type === 'cell' ?
                                reference.ref.row === command.from.row && reference.ref.col === command.from.col ? reference : undefined :
                                undefined,
                        command.to == null ? undefined : `${this.utils.columnNumberToName(command.to.col)}${command.to.row}`,
                        index
                    );
                    break;
                case 'variable':
                    processOneCommand(
                        (reference) =>
                            reference.type === 'variable' ? reference.name === command.from ? reference : undefined :
                            undefined,
                        command.to,
                        index
                    );
                    break;
                default:
                    throw new Error(`Invalid script command type "${command.type}"`);
            }
        }

        changes.sort((a, b) =>
            a.startOffset < b.startOffset ? 1 :
            a.startOffset > b.startOffset ? -1 :
            a.endOffset < b.endOffset ? 1 :
            a.endOffset > b.endOffset ? -1 :
            a.index < b.index ? -1 :
            a.index > b.index ? 1 :
            0
        );

        for(const item of changes) {
            inputText = inputText.substring(0, item.startOffset) + (item.to == null ? '#REF!' : item.to) + inputText.substring(item.endOffset + 1);
        }

        return inputText;
    }
}

module.exports = {
    RefParser,
};

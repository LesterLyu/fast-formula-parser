const TextFormulas = require('./formulas/text');
const MathFormulas = require('./formulas/math');
const FormulaError = require('./formulas/error');
const {Parser} = require('./parsing2');
const lexer = require('./lexing');

class FormulaParser {

    /**
     *
     * @param {{functions: {}, variables: {}, onCell: function, onRange: function}} [config]
     */
    constructor(config) {
        config = Object.assign({
            functions: {},
            variables: {},
            onCell: () => 0,
            onRange: () => [],
        }, config);

        this.variables = config.variables;
        this.functions = Object.assign({}, TextFormulas, MathFormulas, config.functions);
        this.onRange = config.onRange;
        this.onCell = config.onCell;

        // uses ES5 syntax here... I don't want to compile the code...
        this.getCell = (cell) => {
            // console.log('get cell', JSON.stringify(cell));
            return {ref: cell, value: this.onCell(cell)};
        };

        this.getColumnRange = (range) => {
            // console.log('get col range', range);
            return {ref: range, value: this.onRange(range)}
        };

        this.getRowRange = (range) => {
            // console.log('get row range', range);
            return {ref: range, value: this.onRange(range)}
        };

        this.getRange = (refs) => {
            // TODO: Parse range into 1 to 1.
            // console.log('get range', refs);
            // const ref = {from: refs[0], to: refs[1]};
            // return {ref, value: this.onRange(ref)}
            return {value: []}
        };

        this.getVariable = (name) => {
            // console.log('get variable', name);
            const val = this.variables[name];
            if (val === undefined || val === null)
                throw FormulaError.NAME;
            return val;
        };

        this.callFunction = (name, args) => {
            name = name.toUpperCase();
            // console.log('callFunction', name, args)
            // TODO: handle ref functions
            if (this.functions[name])
                return {value: this.functions[name](...args), ref: {}};
            else {
                // console.log(`Function ${name} is not implemented`)
                return {value: 0, ref: {}};
            }
            // throw Error()
            // return
        };

        this.parser = new Parser(this);
    }

    supportedFunctions() {
        const supported = [];
        const functions = Object.keys(this.functions);
        functions.forEach(fun => {
            let res;
            try {
                res = this.functions[fun](0,0,0,0,0,0,0,0,0,0,0);
                if (res === undefined) return;
                supported.push(fun);
            } catch (e) {
                if (e instanceof FormulaError)
                    supported.push(fun);
                // else
                //     console.log(e)
            }
        });
        return supported.sort();
    }

    /**
     *
     * @param inputText
     * @returns {*}
     */
    parse(inputText) {
        const lexResult = lexer.lex(inputText);
        this.parser.input = lexResult.tokens;
        let res;
        try {
            res = this.parser.formulaWithCompareOp();
        } catch (e) {
            // console.log(e);
            if (e instanceof FormulaError)
                return {result: e.toString(), detail: ''};
            throw e;
        }
        if (this.parser.errors.length > 0) {
            const error = this.parser.errors[0];
            const line = error.token.startLine, column = error.token.startColumn;
            let msg = '\n' + inputText.split('\n')[line - 1] + '\n';
            msg += Array(column - 1).fill(' ').join('') + '^\n';
            error.message = msg + `Error at position ${line}:${column}\n` + error.message;
            throw error
        }
        return res;
    }
}

module.exports = {
    FormulaParser,
};

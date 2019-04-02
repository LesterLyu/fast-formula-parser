const TextFormulas = require('./formulas/text');
const MathFormulas = require('./formulas/math');
const FormulaError = require('./formulas/error');
const {FormulaHelpers} = require('./formulas/helpers');
const {Parser} = require('./parsing2');
const lexer = require('./lexing');
const Utils = require('./utils/utils');

class FormulaParser {

    /**
     *
     * @param {{functions: {}, variables: {}, onCell: function, onRange: function}} [config]
     */
    constructor(config) {
        this.utils = new Utils(this);
        config = Object.assign({
            functions: {},
            variables: {},
            onCell: () => 0,
            onRange: () => [[0]],
        }, config);

        this.variables = config.variables;
        this.functions = Object.assign({}, TextFormulas, MathFormulas, config.functions);
        this.onRange = config.onRange;
        this.onCell = config.onCell;

        // uses ES5 syntax here... I don't want to transpile the code...
        this.getCell = (ref) => {
            // console.log('get cell', JSON.stringify(ref));
            return this.onCell(ref);
        };

        // this.getColumnRange = (range) => {
        //     // console.log('get col range', range);
        //     return {ref: range, value: this.onRange(range)}
        // };
        //
        // this.getRowRange = (range) => {
        //     // console.log('get row range', range);
        //     return {ref: range, value: this.onRange(range)}
        // };

        this.getRange = (ref) => {
            return this.onRange(ref)
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
            // retrieve reference
            args = args.map(arg => {
                const res = this.utils.extractRefValue(arg);
                return {value: res.val, isArray: res.isArray};
            });

            // console.log('callFunction', name, args)

            if (this.functions[name]) {
                const res = (this.functions[name](...args));
                return {value: res, ref: {}};
            }

            else {
                // console.log(`Function ${name} is not implemented`)
                return {value: 0, ref: {}};
            }
            // throw Error()
            // return
        };

        this.retrieveRef = value => {
            if (FormulaHelpers.isRangeRef(value)) {
                return this.getRange(value.ref);
            }
            if (FormulaHelpers.isCellRef(value)) {
                return this.getCell(value.ref)
            }
            return value;
        };

        this.parser = new Parser(this, this.utils);
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

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

        this.getRange = (cell1, cell2) => {
            // console.log('get range', cell1, cell2);
            const ref = {from: cell1, to: cell2};
            return {ref, value: this.onRange(ref)}
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
                console.log(`Function ${name} is not implemented`)
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

    parse(inputText) {
        const lexResult = lexer.lex(inputText);
        this.parser.input = lexResult.tokens;
        let res;
        try {
            res = this.parser.formulaWithCompareOp();
        } catch (e) {
            if (e instanceof FormulaError)
                return {result: e.toString(), detail: ''};
            throw e;
            // if (this.parser.errors.length > 0) {
            //     throw Error(this.parser.errors.join(', '))
            // }
        }
        return res;
    }
}

module.exports = {
    FormulaParser,
};

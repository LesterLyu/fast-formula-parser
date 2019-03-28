const TextFormulas = require('./formulas/text');
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
            onCell: null,
            onRange: null,
        }, config);

        this.variables = config.variables;
        this.functions = Object.assign({}, TextFormulas, config.functions);
        this.onRange = config.onRange;
        this.onCell = config.onCell;

        // uses ES5 syntax here... I don't want to compile the code...
        this.getCell = (cell) => {
            console.log('get cell', JSON.stringify(cell));

            return {ref: {type: 'cell', ...cell}, value: 0};
        };

        this.getColumnRange = (range) => {
            // console.log('get col range', range);
        };

        this.getRowRange = (range) => {
            // console.log('get row range', range);
        };

        this.getRange = (cell1, cell2) => {
            // console.log('get range', cell1, cell2);
            return {from: cell1, to: cell2, value: []}
        };

        this.getVariable = (name) => {
            // console.log('get variable', name);
            return 0;
        };

        this.callFunction = (name, args) => {
            // console.log('callFunction', name, args)
            if (this.functions[name])
                return  {value: this.functions[name](...args), ref: {}};
            else {
                console.log(`Function ${name} is not implemented`)
                return {value: 0, ref: {}};
            }
                // throw Error()
            // return
        };

        this.parser = new Parser(this);
    }

    parse(inputText) {
        const lexResult = lexer.lex(inputText);
        this.parser.input = lexResult.tokens;
        const res = this.parser.formulaWithCompareOp();
        if (this.parser.errors.length > 0) {
            throw Error(this.parser.errors.join(', '))
        }
        return res;
    }
}

module.exports = {
    FormulaParser,
};

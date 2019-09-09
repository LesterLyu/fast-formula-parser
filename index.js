const {FormulaParser} = require('./grammar/hooks');
const {DepParser} = require('./grammar/dependency/hooks');
const SSF = require('./ssf/ssf');
const FormulaError = require('./formulas/error');

// const funs = new FormulaParser().supportedFunctions();
// console.log('Supported:', funs.join(', '),
//     `\nTotal: ${funs.length}/477, ${funs.length/477*100}% implemented.`);


Object.assign(FormulaParser, {
    MAX_ROW: 1048576,
    MAX_COLUMN: 16384,
    SSF,
    DepParser,
    FormulaError, ...require('./formulas/helpers')
});
module.exports = FormulaParser;

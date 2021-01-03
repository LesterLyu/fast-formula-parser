import {FormulaParser} from './grammar/hooks';
import {DepParser} from './grammar/dependency/hooks';
import SSF from './ssf/ssf';
import FormulaError from './formulas/error';
import * as helpers from './formulas/helpers';

// const funs = new FormulaParser().supportedFunctions();
// console.log('Supported:', funs.join(', '),
//     `\nTotal: ${funs.length}/477, ${funs.length/477*100}% implemented.`);

const MAX_ROW = 1048576, MAX_COLUMN = 16384;

export {
    MAX_ROW,
    MAX_COLUMN,
    SSF,
    DepParser,
    FormulaError,
}
export * from './formulas/helpers';


Object.assign(FormulaParser, {
    MAX_ROW,
    MAX_COLUMN,
    SSF,
    DepParser,
    FormulaError,
    ...helpers
});

export {FormulaParser};
export default FormulaParser;

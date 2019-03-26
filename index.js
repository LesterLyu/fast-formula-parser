const lexing = require('./lexing');
const parser = require('./parsing2');
let input = '-1 + 2 * (5 + 10) ^ 3 / 2% + (A1 - (A1:A2) +A2)';
// input = 'INDEX(((A1, A2)))';
// input = '_xlnm.ewrew';
// input = '';
// console.log(lexing.lex(input));
// console.log(parser.parse(input));

// for (let i = 0; i < 3000; i++) {
//     parser.parse(input)
// }
// console.log('done');
module.exports = parser;

const lexing = require('./lexing');
const parser = require('./parsing2');
let input = '((A1:A2 A3:A4, A1, A3:A5))';
// input = 'INDEX()';
// input = '_xlnm.ewrew';
// input = '';
// console.log(lexing.lex(input));
console.log(parser.parse(input));

// for (let i = 0; i < 1000; i++) {
//     parser.parse(input)
// }
console.log('done');

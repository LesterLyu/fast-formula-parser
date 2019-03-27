const lexing = require('./lexing');
const parser = require('./parsing2');
let input = '-1 + 2 * (5 + 10) ^ 3 / 2% + (A1 - (A1:A2) +A2)';
// input = 'SUM((\'Exercises 4, 5 and 6\'!$H$2:$H$11-B2:B11)/B2:B11)'
// input = "'sheet 45'!A1:A2";
// input = '_xlnm.ewrew';
input = "SUM((Total_Cost Jan):(Total_Cost Apr.))";
// input = 'SUM((K6:O6 M1:M13):(P14:T14 R8:R22))';
// input = '((A1 A2),(A3 A4))';
// input = '((FL3/FI3)-1)*100';
// input = '(FL3/2)'
// input = '((A1), A2, A3)';

// console.log(lexing.lex(input));
console.log(parser.parse(input));

// for (let i = 0; i < 3000; i++) {
//     parser.parse(input)
// }
// console.log('done');
module.exports = parser;

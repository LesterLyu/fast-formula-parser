const lexing = require('./lexing');
const {FormulaParser} = require('./hooks');
const parser = new FormulaParser();
console.log('supported:', parser.supportedFunctions());

let input = '-1 + 2 * (5 + 10) ^ 3 / 2% + (A1 - (A1:A2) +A2)';
// input = 'SUM((\'Exercises 4, 5 and 6\'!$H$2:$H$11-B2:B11)/B2:B11)'
// input = "'sheet 45'!A1:A2";
// input = '_xlnm.ewrew';
// input = "SUM((Total_Cost Jan):(Total_Cost Apr.))";
// input = 'SUM((K6:O6 M1:M13):(P14:T14 R8:R22))';
// input = '((A1 A2),(A3 A4))';
// input = '((FL3/FI3)-1)*100';
// input = '(FL3/2)'
// input = '((A1), A2, A3)';
// input = 'A1:B3'
// input = 'SUM(Jan:Dec!AD12)';
// input = '1E+23'
// input = '{1,2,3;1,2,3}'
// input = 'XIRR({-10000;2750;4250;3250;2742},{"1998/1/1";"1998/1/3";"1998/10/30";"1999/2/15";"1999/1/4"},0.1)'
// input = "A1/A22";
// input = 'B5*IF(AX5="H",3,IF(AX5="M",2,IF(AX5="L",1," ")))';
input = 'base(12,2)'
// input = 'SUM((Exercises 4, 5 and 6!$H$2:$H$11-Exercise 7!B2:B11)/Exercise 7!B2:B11)'

// console.log(JSON.stringify(lexing.lex(input), null, 1));
console.log(parser.parse(input));
//
// for (let i = 0; i < 3000; i++) {
//     parser.parse(input)
// }
// console.log('done');
module.exports = FormulaParser;

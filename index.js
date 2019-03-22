const lexing = require('./lexing');
const parser = require('./parsing');
console.log(lexing.lex('1+2'))
console.log(parser.parse('1+2'))

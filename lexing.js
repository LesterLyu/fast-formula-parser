const chevrotain = require("chevrotain");
const Lexer = chevrotain.Lexer;
const createToken = chevrotain.createToken;

// the vocabulary will be exported and used in the Parser definition.
const tokenVocabulary = {};

const WhiteSpace = createToken({
    name: 'WhiteSpace',
    pattern: /\s+/,
    group: Lexer.SKIPPED
});

const String = createToken({
    name: 'String',
    pattern: /"(""|[^"])*"/
});

const RefSheetQuoted = createToken({
    name: 'RefSheetQuoted',
    pattern: /'((?![\\\/\[\]*?:]).)+?'(?=!)/
});

const Function = createToken({
    name: 'Function',
    pattern: /[A-Za-z]+[A-Za-z_0-9.]+(?=[(])/
});

const Error = createToken({
    name: 'Error',
    pattern: /#[A-Z0-9\/]+[!?]?/
});

const Cell = createToken({
    name: 'Cell',
    pattern: /[$]?[A-Z]{1,4}[$]?[1-9][0-9]*/
});

const RangeColumn = createToken({
    name: 'RangeColumn',
    pattern: /[$]?[A-Z]{1,4}:[$]?[A-Z]{1,4}/
});

const RangeRow = createToken({
    name: 'RangeColumn',
    pattern: /[$]?[A-Z]{1,4}:[$]?[A-Z]{1,4}/
});

const RefSheet = createToken({
    name: 'RefSheet',
    pattern: /[A-Za-z_.\d]+(?=[!])/
});

const Variable = createToken({
    name: 'Variable',
    pattern: /[a-zA-Z_][a-zA-Z0-9_.?]+/
});

const Number = createToken({
    name: 'Number',
    pattern: /[0-9]+[.]?[0-9]*/
});

const Array = createToken({
    name: 'Array',
    pattern: /{([\w,;\s]*)?}/
});

const Concat = createToken({
    name: 'Concat',
    pattern: /&/
});

const Concat = createToken({
    name: 'Concat',
    pattern: /&/
});

const Concat = createToken({
    name: 'Concat',
    pattern: /&/
});

const Concat = createToken({
    name: 'Concat',
    pattern: /&/
});

const Concat = createToken({
    name: 'Concat',
    pattern: /&/
});

// createToken is used to create a TokenType
// The Lexer's output will contain an array of token Objects created by metadata
const Identifier = createToken({ name: "Identifier", pattern: /[a-zA-Z]\w*/ });

// We specify the "longer_alt" property to resolve keywords vs identifiers ambiguity.
// See: https://github.com/SAP/chevrotain/blob/master/examples/lexer/keywords_vs_identifiers/keywords_vs_identifiers.js
const Select = createToken({
    name: "Select",
    pattern: /SELECT/,
    longer_alt: Identifier
});

const From = createToken({
    name: "From",
    pattern: /FROM/,
    longer_alt: Identifier
});
const Where = createToken({
    name: "Where",
    pattern: /WHERE/,
    longer_alt: Identifier
});

const Comma = createToken({ name: "Comma", pattern: /,/ })
const Integer = createToken({ name: "Integer", pattern: /0|[1-9]\d*/ })
const GreaterThan = createToken({ name: "GreaterThan", pattern: />/ })
const LessThan = createToken({ name: "LessThan", pattern: /</ })


// The order of tokens is important
const allTokens = [
    WhiteSpace,
    // "keywords" appear before the Identifier
    Select,
    From,
    Where,
    Comma,
    // The Identifier must appear after the keywords because all keywords are valid identifiers.
    Identifier,
    Integer,
    GreaterThan,
    LessThan
];

const SelectLexer = new Lexer(allTokens);

allTokens.forEach(tokenType => {
    tokenVocabulary[tokenType.name] = tokenType
});

module.exports = {
    tokenVocabulary: tokenVocabulary,

    lex: function(inputText) {
        const lexingResult = SelectLexer.tokenize(inputText)

        if (lexingResult.errors.length > 0) {
            throw Error("Sad Sad Panda, lexing errors detected")
        }

        return lexingResult
    }
};

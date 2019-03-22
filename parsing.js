const lexer = require('./lexing');
const chevrotain = require("chevrotain");
const tokenVocabulary = lexer.tokenVocabulary;
const hooks = require('./hooks');
let {
    getCell, getColumnRange, getRowRange, getRange, getVariable, callFunction,
    toNumber, toString, toBoolean, toError,
    applyPrefix, applyPostfix, applyInfix, applyIntersect, applyUnion
} = hooks.FormulaParser;
const {
    WhiteSpace,
    String,
    SingleQuotedString,
    SheetQuoted,
    ExcelRefFunction,
    ExcelConditionalRefFunction,
    Function,
    FormulaError,
    RefError,
    Cell,
    RangeColumn,
    RangeRow,
    Sheet,
    ReservedName,
    Name,
    Number,
    Boolean,
    Array,

    At,
    Comma,
    Colon,
    Semicolon,
    OpenParen,
    CloseParen,
    OpenSquareParen,
    CloseSquareParen,
    ExclamationMark,
    OpenCurlyParen,
    CloseCurlyParen,
    QuoteS,
    MulOp,
    PlusOp,
    DivOp,
    MinOp,
    ConcateOp,
    ExOp,
    // IntersectOp,
    PercentOp,
    NeqOp,
    GteOp,
    LteOp,
    GtOp,
    EqOp,
    LtOp
} = tokenVocabulary;

class Parser extends chevrotain.Parser {
    constructor(config) {
        super(tokenVocabulary, config);
        const $ = this;

        // Adopted from https://github.com/spreadsheetlab/XLParser/blob/master/src/XLParser/ExcelFormulaGrammar.cs
        $.RULE('formula', () => $.OR([
            {ALT: () => $.SUBRULE($.reference)},
            {ALT: () => $.SUBRULE($.constant)},
            {ALT: () => $.SUBRULE($.functionCall)},
            // {ALT: () => $.SUBRULE($.constantArray)},
            {ALT: () => $.SUBRULE($.paren)},
            {ALT: () => $.SUBRULE($.reservedName)},
        ]));

        $.RULE('paren', () => {
            $.CONSUME(OpenParen);
            const value = $.SUBRULE($.formula);
            $.CONSUME(CloseParen);
            return value;
        });

        $.RULE('reservedName', () => {
            const name = $.CONSUME(ReservedName).image;
            return getVariable(name);
        });

        $.RULE('constant', () => $.OR([
            {
                ALT: () => {
                    return toNumber($.CONSUME(Number).image);
                }
            }, {
                ALT: () => {
                    return toString($.CONSUME(String).image);
                }
            }, {
                ALT: () => {
                    return toBoolean($.CONSUME(Boolean).image);
                }
            }, {
                ALT: () => {
                    return toError($.CONSUME(FormulaError).image);
                }
            },
        ]));

        $.RULE('functionCall', () => $.OR([
            {
                ALT: () => {
                    const functionName = $.CONSUME(Function).image;
                    const args = $.SUBRULE($.arguments);
                    $.CONSUME(CloseParen);
                    callFunction(functionName, args);
                }
            }, {
                ALT: () => {
                    const prefix = $.SUBRULE($.prefixOp);
                    const formula = $.SUBRULE($.formula);
                    return applyPrefix(prefix, formula);
                }
            }, {
                ALT: () => {
                    const formula = $.SUBRULE2($.formula);
                    const postfix = $.SUBRULE($.postfixOp);
                    return applyPostfix(formula, postfix);
                }
            }, {
                ALT: () => {
                    const formula1 = $.SUBRULE3($.formula);
                    const infix = $.SUBRULE($.infixOp);
                    const formula2 = $.SUBRULE4($.formula);
                    return applyInfix(formula1, infix, formula2);
                }
            }
        ]));

        $.RULE('arguments', () => $.OR([
            {ALT: () => $.SUBRULE('argumentsEndWithoutComma')},
            {
                ALT: () => {
                    const args = $.SUBRULE('argumentsEndWithoutComma');
                    $.CONSUME(Comma);
                    return args;
                }
            }
        ]));

        $.RULE('argumentsEndWithoutComma', () => {
            const args = [];
            $.MANY_SEP({
                SEP: Comma,
                DEF: () => {
                    args.push($.SUBRULE($.formula));
                }
            });
            return args;
        });

        $.RULE('prefixOp', () => $.OR([
            {ALT: () => $.CONSUME(PlusOp).image},
            {ALT: () => $.CONSUME(MinOp).image}
        ]));

        $.RULE('infixOp', () => $.OR([
            {ALT: () => $.CONSUME(ExOp).image},
            {ALT: () => $.CONSUME(MulOp).image},
            {ALT: () => $.CONSUME(DivOp).image},
            {ALT: () => $.CONSUME(PlusOp).image},
            {ALT: () => $.CONSUME(MinOp).image},
            {ALT: () => $.CONSUME(ConcateOp).image},
            {ALT: () => $.CONSUME(GtOp).image},
            {ALT: () => $.CONSUME(EqOp).image},
            {ALT: () => $.CONSUME(LtOp).image},
            {ALT: () => $.CONSUME(NeqOp).image},
            {ALT: () => $.CONSUME(GteOp).image},
            {ALT: () => $.CONSUME(LteOp).image},
        ]));

        $.RULE('postfixOp', () => $.CONSUME(PercentOp).image);

        $.RULE('reference', () => $.OR([
            {ALT: () => $.SUBRULE('referenceItem')},
            {ALT: () => $.SUBRULE('referenceFunctionCall')},
            {
                ALT: () => {
                    $.CONSUME(OpenParen);
                    const value = $.SUBRULE('reference');
                    $.CONSUME(CloseParen);
                    return value;
                }
            },
            {
                ALT: () => {
                    const prefix = $.SUBRULE($.prefixName);
                    const referenceItem = $.SUBRULE($.referenceItem);
                    applyPrefix(prefix, referenceItem);
                }
            },
            // {ALT: () => $.SUBRULE('dynamicDataExchange')},
        ]));

        $.RULE('referenceFunctionCall', () => $.OR([
            {
                ALT: () => {
                    const ref1 = $.SUBRULE($.reference);
                    $.CONSUME(Colon);
                    const ref2 = $.SUBRULE2($.reference);
                    return getRange(ref1, ref2);
                }
            }, {
                ALT: () => {
                    const ref1 = $.SUBRULE3($.reference);
                    $.CONSUME(WhiteSpace);
                    const ref2 = $.SUBRULE4($.reference);
                    return applyIntersect(ref1, ref2);
                }
            }, {
                ALT: () => {
                    $.CONSUME(OpenParen);
                    const result = $.SUBRULE($.union);
                    $.CONSUME(CloseParen);
                    return result;
                }
            }, {
                ALT: () => {
                    const refFunctionName = $.SUBRULE($.refFunctionName);
                    const args = $.SUBRULE($.arguments);
                    $.CONSUME2(CloseParen);
                    return callFunction(refFunctionName, args);
                }
            }
        ]));

        $.RULE('refFunctionName', () => $.OR([
            {ALT: () => $.CONSUME(ExcelRefFunction).image},
            {ALT: () => $.CONSUME(ExcelConditionalRefFunction).image}
        ]));

        $.RULE('union', () => {
            const result1 = $.SUBRULE($.union);
            $.CONSUME(Comma);
            const result2 = $.SUBRULE($.reference);
            return applyUnion(result1, result2);
        });

        $.RULE('referenceItem', () => $.OR([
            {ALT: () => $.SUBRULE($.cell)},
            {ALT: () => $.SUBRULE($.namedRange)},
            {ALT: () => $.SUBRULE($.vRange)},
            {ALT: () => $.SUBRULE($.hRange)},
            {ALT: () => $.SUBRULE($.refError)},
            // {ALT: () => $.SUBRULE($.udfFunctionCall)},
            // {ALT: () => $.SUBRULE($.structuredReference)},
        ]));

        $.RULE('vRange', () => {
            return getColumnRange($.CONSUME(RangeColumn).image);
        });

        $.RULE('hRange', () => {
            return getRowRange($.CONSUME(RangeRow).image);
        });

        $.RULE('cell', () => {
            return getCell($.CONSUME(Cell).image);
        });

        $.RULE('namedRange', () => {
            return getVariable($.CONSUME(Name).image);
        });

        $.RULE('prefixName', () => $.OR([
            {ALT: () => $.CONSUME(Sheet).image},
            {ALT: () => toString($.CONSUME(SheetQuoted).image)},
        ]));

        $.RULE('refError', () => $.CONSUME(RefError).image);

        this.performSelfAnalysis();
    }
}


const parserInstance = new Parser();

module.exports = {
    init: config => {

    },

    parserInstance: parserInstance,

    Parser: Parser,

    parse: function (inputText) {
        const lexResult = lexer.lex(inputText);

        // ".input" is a setter which will reset the parser's internal's state.
        parserInstance.input = lexResult.tokens;

        // No semantic actions so this won't return anything yet.
        parserInstance.formula();

        if (parserInstance.errors.length > 0) {
            throw Error(
                "Sad sad panda, parsing errors detected!\n" +
                parserInstance.errors[0].message
            )
        }
    }
}

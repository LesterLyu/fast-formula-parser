const lexer = require('./lexing');
const chevrotain = require("chevrotain");
const tokenVocabulary = lexer.tokenVocabulary;
const hooks = require('./hooks');
const {
    getCell, getColumnRange, getRowRange, getRange, getVariable, callFunction,
    toNumber, toString, toBoolean, toError,
    applyPrefix, applyPostfix, applyInfix, applyIntersect, applyUnion
} = hooks.FormulaParser;
const {parseCellAddress} = require('./utils/utils');
const {
    // IntersectOp,
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
        super(tokenVocabulary, {
            outputCst: false,
            maxLookahead: 3,
            ignoredIssues: {
                referenceWithIntersect: {OR9: true},
                formula: {OR9: true}
            }
        });
        const $ = this;

        // Adopted from https://github.com/spreadsheetlab/XLParser/blob/master/src/XLParser/ExcelFormulaGrammar.cs

        $.RULE('formulaWithCompareOp', () => {
            let value = $.SUBRULE($.formulaWithConcatOp);
            $.MANY(() => {
                const infix = $.SUBRULE($.compareOp);
                const formula2 = $.SUBRULE2($.formulaWithConcatOp);
                value = applyInfix(value, infix, formula2);
            });
            return value;
        });

        $.RULE('compareOp', () => $.OR([
            {ALT: () => $.CONSUME(GtOp).image},
            {ALT: () => $.CONSUME(EqOp).image},
            {ALT: () => $.CONSUME(LtOp).image},
            {ALT: () => $.CONSUME(NeqOp).image},
            {ALT: () => $.CONSUME(GteOp).image},
            {ALT: () => $.CONSUME(LteOp).image},
        ]));


        $.RULE('formulaWithConcatOp', () => {
            let value = $.SUBRULE($.formulaWithBinaryOp);
            $.MANY(() => {
                const infix = $.CONSUME(ConcateOp).image;
                const formula2 = $.SUBRULE2($.formulaWithBinaryOp);
                value = applyInfix(value, infix, formula2);
            });
            return value;
        });


        $.RULE('formulaWithBinaryOp', () => {
            let value = $.SUBRULE($.formulaWithMulDivOp);
            $.MANY(() => {
                const infix = $.SUBRULE($.plusMinusOp);
                const formula2 = $.SUBRULE2($.formulaWithMulDivOp);
                value = applyInfix(value, infix, formula2);
            });
            return value;
        });

        $.RULE('plusMinusOp', () => $.OR([
            {ALT: () => $.CONSUME(PlusOp).image},
            {ALT: () => $.CONSUME(MinOp).image}
        ]));

        $.RULE('formulaWithMulDivOp', () => {
            let value = $.SUBRULE($.formulaWithExOp);
            $.MANY(() => {
                const infix = $.SUBRULE($.mulDivOp);
                const formula2 = $.SUBRULE2($.formulaWithExOp);
                value = applyInfix(value, infix, formula2);
            });
            return value;
        });

        $.RULE('mulDivOp', () => $.OR([
            {ALT: () => $.CONSUME(MulOp).image},
            {ALT: () => $.CONSUME(DivOp).image}
        ]));

        $.RULE('formulaWithExOp', () => {
            let value = $.SUBRULE($.formulaWithPercentOp);
            $.MANY(() => {
                const infix = $.CONSUME(ExOp).image;
                const formula2 = $.SUBRULE2($.formulaWithPercentOp);
                value = applyInfix(value, infix, formula2);
            });
            return value;
        });

        $.RULE('formulaWithPercentOp', () => {
            let value = $.SUBRULE($.formulaWithUnaryOp);
            $.OPTION(() => {
                const postfix = $.CONSUME(PercentOp).image;
                value = applyPostfix(value, postfix);
            });
            return value;
        });

        $.RULE('formulaWithUnaryOp', () => {
            const prefix = $.OPTION(() => $.SUBRULE($.plusMinusOp));
            const formula = $.SUBRULE($.formula);
            if (prefix) return applyPrefix(prefix, formula);
            return formula;
        });

        $.RULE('formula', () => $.OR9([
            {ALT: () => $.SUBRULE($.referenceWithIntersect)},
            {ALT: () => $.SUBRULE($.constant)},
            {ALT: () => $.SUBRULE($.functionCall)},
            // {ALT: () => $.SUBRULE($.constantArray)},
            {ALT: () => $.SUBRULE($.paren)},
            {ALT: () => $.SUBRULE($.reservedName)},
        ]));

        $.RULE('paren', () => $.OR([{
            GATE: () => {
                console.log('try paren..')
                return $.LA(1).image === '(';
            },
            ALT: () => {
                $.CONSUME(OpenParen);
                const value = $.SUBRULE9($.formulaWithCompareOp);
                $.CONSUME(CloseParen);
                return value;
            }
        }]));

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
                    const functionName = $.CONSUME(Function).image.slice(0, -1);
                    console.log('functionName', functionName);
                    const args = $.OPTION(() => $.SUBRULE($.arguments));
                    $.CONSUME(CloseParen);
                    return callFunction(functionName, args);
                }
            }
        ]));

        $.RULE('arguments', () => {
            console.log('try arguments')
            const args = [];
            // allows empty arguments
            $.OPTION(() => {
                args.push($.SUBRULE($.formulaWithCompareOp));
                $.MANY(() => {
                    $.CONSUME1(Comma);
                    args.push($.SUBRULE2($.formulaWithCompareOp));
                });
            });
            // allows ',' in the end
            $.OPTION2(() => {
                $.MANY2(() => {
                    $.CONSUME2(Comma);
                })
            });
            return args;
        });

        $.RULE('postfixOp', () => $.CONSUME(PercentOp).image);

        $.RULE('referenceWithIntersect', () => $.OR9([
            {
                GATE: () => {
                    // remove nested () until only one left
                    return $.LA(1).image === '(';
                },
                ALT: () => {
                    $.CONSUME(OpenParen);
                    const res = $.SUBRULE2($.referenceWithIntersect);
                    $.CONSUME(CloseParen);
                    return res;
                }
            },
            {
                // e.g.  'A1 A2 A3'
                ALT: () => {
                    let ref1, refs = [ref1];
                    ref1 = $.SUBRULE($.referenceWithRange);
                    $.MANY({
                        GATE: () => {
                            // see https://github.com/SAP/chevrotain/blob/master/examples/grammars/css/css.js#L436-L441
                            const prevToken = $.LA(0);
                            const nextToken = $.LA(1);
                            //  This is the only place where the grammar is whitespace sensitive.
                            return nextToken.startOffset > prevToken.endOffset;
                        },
                        DEF: () => {
                            refs.push($.SUBRULE3($.referenceWithRange));
                        }
                    });
                    if (refs.length > 1) {
                        return applyIntersect(refs);
                    }
                    return ref1;
                }
            }
        ]));

        $.RULE('referenceWithRange', () => $.OR([
            {
                // e.g. 'A1:C3'
                ALT: () => {
                    const ref1 = $.SUBRULE($.referenceWithoutInfix);
                    $.OPTION(() => {
                        $.CONSUME(Colon);
                        const ref2 = $.SUBRULE2($.referenceWithoutInfix);
                        return getRange(ref1, ref2);
                    });
                    return ref1;
                }
            },

        ]));

        $.RULE('referenceWithoutInfix', () => $.OR([
            {
                ALT: () => {
                    return getCell($.SUBRULE($.referenceItem))
                }
            },
            {ALT: () => $.SUBRULE($.referenceFunctionCall)},

            {
                // sheet name prefix
                ALT: () => {
                    console.log('try sheetName');
                    const sheetName = $.SUBRULE($.prefixName);
                    console.log('sheetName', sheetName);
                    const referenceItem = $.SUBRULE2($.referenceWithRange);
                    referenceItem.sheet = sheetName;
                    getCell(referenceItem);
                }
            },

            // {ALT: () => $.SUBRULE('dynamicDataExchange')},
        ]));

        $.RULE('referenceFunctionCall', () => $.OR([
            {
                ALT: () => {
                    $.CONSUME(OpenParen);
                    const result = $.SUBRULE($.union);
                    $.CONSUME(CloseParen);
                    return result;
                }
            },
            {
                ALT: () => {
                    const refFunctionName = $.SUBRULE($.refFunctionName);
                    console.log('refFunctionName', refFunctionName);
                    const args = $.SUBRULE($.arguments);
                    $.CONSUME2(CloseParen);
                    return callFunction(refFunctionName, args);
                }
            }
        ]));

        $.RULE('refFunctionName', () => $.OR([
            {ALT: () => $.CONSUME(ExcelRefFunction).image.slice(0, -1)},
            {ALT: () => $.CONSUME(ExcelConditionalRefFunction).image.slice(0, -1)}
        ]));

        $.RULE('union', () => {
            // console.log('try union')
            const args = [];
            // allows empty arguments
            $.OPTION(() => {
                args.push($.SUBRULE($.referenceWithIntersect));
                $.MANY(() => {
                    $.CONSUME(Comma);
                    args.push($.SUBRULE2($.referenceWithIntersect));
                });
            });
            // allows ',' in the end
            $.OPTION2(() => {
                $.MANY2(() => {
                    $.CONSUME2(Comma);
                })
            });

            return applyUnion(...args);
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
            return parseCellAddress($.CONSUME(Cell).image);
        });

        $.RULE('namedRange', () => {
            return getVariable($.CONSUME(Name).image);
        });

        $.RULE('prefixName', () => $.OR([
            {ALT: () => $.CONSUME(Sheet).image.slice(0, -1)},
            {ALT: () => $.CONSUME(SheetQuoted).image.slice(0, -1)},
        ]));

        $.RULE('refError', () => $.CONSUME(RefError).image);

        this.performSelfAnalysis();
    }
}


const parserInstance = new Parser();

module.exports = {

    allTokens: Object.values(tokenVocabulary),

    parserInstance: parserInstance,

    Parser: Parser,

    parse: function (inputText) {
        const lexResult = lexer.lex(inputText);

        // ".input" is a setter which will reset the parser's internal's state.
        parserInstance.input = lexResult.tokens;

        // No semantic actions so this won't return anything yet.
        const res = parserInstance.formulaWithCompareOp();

        if (parserInstance.errors.length > 0) {
            throw Error(
                "Sad sad panda, parsing errors detected!\n" +
                parserInstance.errors[0].message
            )
        }
        return res;
    }
};

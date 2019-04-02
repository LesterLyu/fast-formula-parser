const lexer = require('./lexing');
const chevrotain = require("chevrotain");
const tokenVocabulary = lexer.tokenVocabulary;

const Utils = require('./utils/utils');

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
    // RangeColumn,
    // RangeRow,
    Sheet,
    ReservedName,
    Name,
    Number,
    Boolean,
    Column,
    // Array,

    At,
    Comma,
    Colon,
    Semicolon,
    OpenParen,
    CloseParen,
    OpenSquareParen,
    CloseSquareParen,
    // ExclamationMark,
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
    constructor(context) {
        super(tokenVocabulary, {
            outputCst: false,
            maxLookahead: 1,
            ignoredIssues: {
                // referenceWithIntersect: {OR9: true},
                // formula: {OR9: true},
                // paren: {OR9: true}
            }
        });
        const {getCell, getColumnRange, getRowRange, getRange, getVariable, callFunction} = context;
        this.utils = context.utils;
        const $ = this;

        // Adopted from https://github.com/spreadsheetlab/XLParser/blob/master/src/XLParser/ExcelFormulaGrammar.cs

        $.RULE('formulaWithCompareOp', () => {
            let value = $.SUBRULE($.formulaWithConcatOp);
            $.MANY(() => {
                const infix = $.SUBRULE($.compareOp);
                const value2 = $.SUBRULE2($.formulaWithConcatOp);
                value = this.utils.applyInfix(value, infix, value2);
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
                value = this.utils.applyInfix(value, infix, formula2);
            });
            return value;
        });


        $.RULE('formulaWithBinaryOp', () => {
            let value = $.SUBRULE($.formulaWithMulDivOp);
            $.MANY(() => {
                const infix = $.SUBRULE($.plusMinusOp);
                const formula2 = $.SUBRULE2($.formulaWithMulDivOp);
                value = this.utils.applyInfix(value, infix, formula2);
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
                value = this.utils.applyInfix(value, infix, formula2);
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
                value = this.utils.applyInfix(value, infix, formula2);
            });
            return value;
        });

        $.RULE('formulaWithPercentOp', () => {
            let value = $.SUBRULE($.formulaWithUnaryOp);
            $.OPTION(() => {
                const postfix = $.CONSUME(PercentOp).image;
                value = this.utils.applyPostfix(value, postfix);
            });
            return value;
        });

        $.RULE('formulaWithUnaryOp', () => {
            // support ++---3 => -3
            const prefixes = [];
            $.MANY(() => {
                prefixes.push($.SUBRULE($.plusMinusOp));
            });
            const formula = $.SUBRULE($.formulaWithIntersect);
            if (prefixes.length > 0) return this.utils.applyPrefix(prefixes, formula);
            return formula;
        });


        $.RULE('formulaWithIntersect', () => $.OR9([
            {
                // e.g.  'A1 A2 A3'
                ALT: () => {
                    let ref1 = $.SUBRULE($.formulaWithRange);
                    const refs = [ref1];
                    // console.log('check intersect')
                    $.MANY({
                        GATE: () => {
                            // see https://github.com/SAP/chevrotain/blob/master/examples/grammars/css/css.js#L436-L441
                            const prevToken = $.LA(0);
                            const nextToken = $.LA(1);
                            //  This is the only place where the grammar is whitespace sensitive.
                            return nextToken.startOffset > prevToken.endOffset + 1;
                        },
                        DEF: () => {
                            refs.push($.SUBRULE3($.formulaWithRange));
                        }
                    });
                    if (refs.length > 1) {
                        return this.utils.applyIntersect(refs);
                    }
                    return ref1;
                }
            }
        ]));

        $.RULE('formulaWithRange', () => {
            // e.g. 'A1:C3' or 'A1:A3:C4', can be any number of references, at lease 2
            const ref1 = $.SUBRULE($.formula);
            const refs = [ref1];
            $.MANY(() => {
                $.CONSUME(Colon);
                refs.push($.SUBRULE2($.formula));
            });
            if (refs.length > 1)
                return this.utils.applyRange(refs);
            return ref1;
        });

        $.RULE('formula', () => $.OR9([
            {ALT: () => $.SUBRULE($.reservedName)},
            {ALT: () => $.SUBRULE($.referenceWithoutInfix)},
            {ALT: () => $.SUBRULE($.paren)},
            {ALT: () => $.SUBRULE($.constant)},
            {ALT: () => $.SUBRULE($.functionCall)},
            {ALT: () => $.SUBRULE($.constantArray)},
        ]));

        $.RULE('paren', () => {
            // formula paren or union paren
            $.CONSUME(OpenParen);
            let result;
            const refs = [];
            refs.push($.SUBRULE($.formulaWithCompareOp));
            $.MANY(() => {
                $.CONSUME(Comma);
                refs.push($.SUBRULE2($.formulaWithCompareOp));
            });
            if (refs.length > 1)
                result = this.utils.applyUnion(refs);
            else
                result = refs[0];

            $.CONSUME(CloseParen);
            return result;
        });

        $.RULE('constantArray', () => {
            // console.log('constantArray');
            const arr = [[]];
            let currentRow = 0;
            $.CONSUME(OpenCurlyParen);

            // array must contain at least one item
            arr[currentRow].push($.SUBRULE($.constantForArray));
            $.MANY(() => {
                const sep = $.OR([
                    {ALT: () => $.CONSUME(Comma).image},
                    {ALT: () => $.CONSUME(Semicolon).image}
                ]);
                const constant = $.SUBRULE2($.constantForArray);
                if (sep === ',') {
                    arr[currentRow].push(constant)
                } else {
                    currentRow++;
                    arr[currentRow] = [];
                    arr[currentRow].push(constant)
                }
            });

            $.CONSUME(CloseCurlyParen);

            return this.utils.toArray(arr);
        });

        /**
         * Used in array
         */
        $.RULE('constantForArray', () => $.OR([
            {
                ALT: () => {
                    const prefix = $.OPTION(() => $.SUBRULE($.plusMinusOp));
                    const number = this.utils.toNumber($.CONSUME(Number).image);
                    if (prefix)
                        return this.utils.applyPrefix([prefix], number);
                    return number;
                }
            }, {
                ALT: () => {
                    return this.utils.toString($.CONSUME(String).image);
                }
            }, {
                ALT: () => {
                    return this.utils.toBoolean($.CONSUME(Boolean).image);
                }
            }, {
                ALT: () => {
                    return this.utils.toError($.CONSUME(FormulaError).image);
                }
            }, {
                ALT: () => {
                    return this.utils.toError($.CONSUME(RefError).image);
                }
            },
        ]));

        $.RULE('reservedName', () => {
            const name = $.CONSUME(ReservedName).image;
            return getVariable(name);
        });

        $.RULE('constant', () => $.OR([
            {
                ALT: () => {
                    return this.utils.toNumber($.CONSUME(Number).image);
                }
            }, {
                ALT: () => {
                    return this.utils.toString($.CONSUME(String).image);
                }
            }, {
                ALT: () => {
                    return this.utils.toBoolean($.CONSUME(Boolean).image);
                }
            }, {
                ALT: () => {
                    return this.utils.toError($.CONSUME(FormulaError).image);
                }
            },
        ]));

        $.RULE('functionCall', () => $.OR([
            {
                ALT: () => {
                    const functionName = $.CONSUME(Function).image.slice(0, -1);
                    // console.log('functionName', functionName);
                    const args = $.SUBRULE($.arguments);
                    $.CONSUME(CloseParen);
                    return callFunction(functionName, args);
                }
            }
        ]));

        $.RULE('arguments', () => {
            // console.log('try arguments')

            // allows ',' in the front
            $.MANY2(() => {
                $.CONSUME2(Comma);
            });
            const args = [];
            // allows empty arguments
            $.OPTION(() => {
                args.push($.SUBRULE($.formulaWithCompareOp));
                $.MANY(() => {
                    $.CONSUME1(Comma);
                    $.OPTION3(() => args.push($.SUBRULE2($.formulaWithCompareOp)));
                });
            });
            return args;
        });

        $.RULE('postfixOp', () => $.CONSUME(PercentOp).image);


        $.RULE('referenceWithoutInfix', () => $.OR([

            {ALT: () => ($.SUBRULE($.referenceItem))},
            {ALT: () => $.SUBRULE($.referenceFunctionCall)},

            {
                // sheet name prefix
                ALT: () => {
                    // console.log('try sheetName');
                    const sheetName = $.SUBRULE($.prefixName);
                    // console.log('sheetName', sheetName);
                    const referenceItem = $.SUBRULE2($.formulaWithRange);
                    referenceItem.ref.sheet = sheetName;
                    return (referenceItem);
                }
            },

            // {ALT: () => $.SUBRULE('dynamicDataExchange')},
        ]));

        $.RULE('referenceFunctionCall', () => $.OR([

            {
                ALT: () => {
                    const refFunctionName = $.SUBRULE($.refFunctionName);
                    // console.log('refFunctionName', refFunctionName);
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

        $.RULE('referenceItem', () => $.OR([
            {ALT: () => this.utils.parseCellAddress($.CONSUME(Cell).image)},
            {ALT: () => getVariable($.CONSUME(Name).image)},
            {ALT: () => this.utils.parseCol($.CONSUME(Column).image)},
            // A row check should be here, but the token is same with Number,
            // In other to resolve ambiguities, I leave this empty, and
            // parse the number to row number when needed.
            {ALT: () => this.utils.toError($.CONSUME(RefError).image)},
            // {ALT: () => $.SUBRULE($.udfFunctionCall)},
            // {ALT: () => $.SUBRULE($.structuredReference)},
        ]));

        $.RULE('prefixName', () => $.OR([
            {ALT: () => $.CONSUME(Sheet).image.slice(0, -1)},
            {ALT: () => $.CONSUME(SheetQuoted).image.slice(1, -2)},
        ]));

        this.performSelfAnalysis();
    }
}

module.exports = {
    allTokens: Object.values(tokenVocabulary),
    Parser: Parser,
};

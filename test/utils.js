const expect = require('chai').expect;
module.exports = {
    generateTests: (parser, TestCase) => {
        const funs = Object.keys(TestCase);

        funs.forEach(fun => {
            it(fun, () => {
                const formulas = Object.keys(TestCase[fun]);
                formulas.forEach(formula => {
                    const expected = TestCase[fun][formula];
                    let result = parser.parse(formula, {row: 1, col: 1});
                    if (result.result) result = result.result;
                    if (typeof result === "number" && typeof expected === "number") {
                        expect(result, `${formula} should equal ${expected}\n`).to.closeTo(expected, 0.00000001);
                    } else {
                        // For FormulaError
                        if (expected.equals)
                            expect(expected.equals(result), `${formula} should equal ${expected.error}\n`).to.equal(true);
                        else
                            expect(result, `${formula} should equal ${expected}\n`).to.equal(expected);
                    }
                })
            });
        });
    }
};

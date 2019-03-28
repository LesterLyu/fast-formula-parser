
class FormulaError {

    constructor(error) {
        this._error = error;
    }

    get error() {
        return this._error;
    }

    equals(err) {
        return err._error === this._error;
    }

    toString() {
        return this._error;
    }
}

FormulaError.DIV0 = new FormulaError("#DIV/0!");
FormulaError.NA = new FormulaError("#N/A");
FormulaError.NAME = new FormulaError("#NAME?");
FormulaError.NULL = new FormulaError("#NULL!");
FormulaError.NUM = new FormulaError("#NUM!");
FormulaError.REF = new FormulaError("#REF!");
FormulaError.VALUE = new FormulaError("#VALUE!");

module.exports = FormulaError;

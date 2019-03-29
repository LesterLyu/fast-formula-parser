
class FormulaError {

    constructor(error) {
        this._error = error;
    }

    get message() {
        return this._msg;
    }

    set message(msg) {
        this._msg = msg;
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

FormulaError.NOT_IMPLEMENTED = (functionName) => {
    return new Error(`Function ${functionName} is not implemented.`)
};
FormulaError.TOO_MANY_ARGS = (functionName) => {
    return new Error(`Function ${functionName} has too many arguments.`)
};

FormulaError.ARG_MISSING = (args) => {
    return new Error(`Argument type ${args.join(', ')} is missing.`)
};

module.exports = FormulaError;

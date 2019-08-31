/**
 * Formula Error.
 */
class FormulaError {

    constructor(error) {
        this._error = error;
    }

    /**
     * Get the error message.
     * @returns {*}
     */
    get message() {
        return this._msg;
    }

    /**
     * Set the error message.
     * @param {string} msg
     */
    set message(msg) {
        this._msg = msg;
    }

    /**
     * Get the error.
     * @returns {string} formula error
     */
    get error() {
        return this._error;
    }

    /**
     * Return true if two errors are same.
     * @param {FormulaError} err
     * @returns {boolean} if two errors are same.
     */
    equals(err) {
        return err._error === this._error;
    }

    /**
     * Return the formula error in string representation.
     * @returns {string} the formula error in string representation.
     */
    toString() {
        return this._error;
    }
}

/**
 * DIV0 error
 * @type {FormulaError}
 */
FormulaError.DIV0 = new FormulaError("#DIV/0!");

/**
 * NA error
 * @type {FormulaError}
 */
FormulaError.NA = new FormulaError("#N/A");

/**
 * NAME error
 * @type {FormulaError}
 */
FormulaError.NAME = new FormulaError("#NAME?");

/**
 * NULL error
 * @type {FormulaError}
 */
FormulaError.NULL = new FormulaError("#NULL!");

/**
 * NUM error
 * @type {FormulaError}
 */
FormulaError.NUM = new FormulaError("#NUM!");

/**
 * REF error
 * @type {FormulaError}
 */
FormulaError.REF = new FormulaError("#REF!");

/**
 * VALUE error
 * @type {FormulaError}
 */
FormulaError.VALUE = new FormulaError("#VALUE!");

/**
 * NOT_IMPLEMENTED error
 * @param {string} functionName - the name of the not implemented function
 * @returns {Error}
 * @constructor
 */
FormulaError.NOT_IMPLEMENTED = (functionName) => {
    return new Error(`Function ${functionName} is not implemented.`)
};

/**
 * TOO_MANY_ARGS error
 * @param functionName - the name of the errored function
 * @returns {Error}
 * @constructor
 */
FormulaError.TOO_MANY_ARGS = (functionName) => {
    return new Error(`Function ${functionName} has too many arguments.`)
};

/**
 * ARG_MISSING error
 * @param args - the name of the errored function
 * @returns {Error}
 * @constructor
 */
FormulaError.ARG_MISSING = (args) => {
    return new Error(`Argument type ${args.join(', ')} is missing.`)
};

module.exports = FormulaError;

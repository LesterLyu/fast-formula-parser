const FormulaError = require('./error');

const Types = {
    NUMBER: 0,
    ARRAY: 1,
    BOOLEAN: 2,
    STRING: 3,
    RANGE_REF: 4, // can be 'A:C' or '1:4', not only 'A1:C3'
    CELL_REF: 5,
};

const type2Number = {
    number: Types.NUMBER,
    boolean: Types.BOOLEAN,
    string: Types.STRING,
    object: -1
};

const FormulaHelpers = {
    type2Number,

    checkResult: (result) => {
        if (isNaN(result)) {
            throw FormulaError.VALUE;
        }
        return result;
    },

    /**
     * Check if the param valid, return the parsed param.
     * @param {*} param
     * @param {Array} types
     * @param {boolean} [allowArray]
     */
    accept: (param, types, allowArray=true) => {
        const paramType = FormulaHelpers.type(param);
        types.forEach(type => {
            if (paramType === type) {
                return param;
            }
        });

        // extract first element of the array as the input
        if (allowArray) {
            return param[0][0];
        }
        throw FormulaError.VALUE;
    },

    type: variable => {
        let type = FormulaHelpers.type2Number(typeof variable);
        if (type === -1) {
            if (Array.isArray(variable))
                type = Types.ARRAY;
            else if (variable.ref) {
                if (variable.ref.from) {
                    type = Types.RANGE_REF;
                } else {
                    type = Types.CELL_REF;
                }
            }
        }
        return type;
    }
};

module.exports = {
    FormulaHelpers,
    Types,
};

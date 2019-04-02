const FormulaError = require('./error');

const Types = {
    NUMBER: 0,
    ARRAY: 1,
    BOOLEAN: 2,
    STRING: 3,
    RANGE_REF: 4, // can be 'A:C' or '1:4', not only 'A1:C3'
    CELL_REF: 5,
    COLLECTIONS: 6, // Unions of references
};

const ReversedTypes = {};
Object.keys(Types).forEach((key) => {
    ReversedTypes[Types[key]] = key;
});

class FormulaHelpers {
    constructor() {
        this.Types = Types;
        this.type2Number = {
            number: Types.NUMBER,
            boolean: Types.BOOLEAN,
            string: Types.STRING,
            object: -1
        };
    }

    checkFunctionResult(result) {
        const type = typeof result;
        // number
        if (type === 'number') {
            if (isNaN(result)) {
                throw FormulaError.VALUE;
            }
        }
        return result;
    }

    /**
     * Flatten an array
     * @param {Array} arr1
     * @returns {*}
     */
    flattenDeep(arr1) {
        return arr1.reduce((acc, val) => Array.isArray(val) ? acc.concat(this.flattenDeep(val)) : acc.concat(val), []);
    }

    /**
     *
     * @param obj
     * @param allowArray - if it is an array: {1,2,3}, will extract the first element
     * @returns {number}
     */
    acceptNumber(obj, allowArray = true) {
        let number;

        if (typeof obj === 'number')
            number = obj;
        // TRUE -> 1, FALSE -> 0
        else if (typeof obj === 'boolean')
            number = Number(obj);
        // "123" -> 123
        else if (typeof obj === 'string') {
            number = Number(obj);
            if (isNaN(number))
                throw FormulaError.VALUE;
        } else if (Array.isArray(obj)) {
            if (!allowArray)
                throw FormulaError.VALUE;
            if (obj[0].length === 1)
                number = this.acceptNumber(obj[0][0]);
        } else {
            throw Error('Unknown type in FormulaHelpers.acceptNumber')
        }
        return number;
    }

    /**
     * Check many params.
     * @see {@link FormulaHelpers.accept}
     * @param {Array} params
     * @param types
     */
    acceptMany(params, types) {
        if (types.length !== params.length)
            throw Error('FormulaHelpers.acceptMany: params length should match types.');
        const res = [];
        for (let i = 0; i < params.length; i++) {
            res.push(this.accept(params[i], types[i]))
        }
      return res;
    }

    /**
     * Check if the param valid, return the parsed param.
     * @param {*} param
     * @param {number[]} types - The expected type
     *           NUMBER: Expect a single number,
     *           ARRAY: Expect an flatten array,
     *           BOOLEAN: Expect a single boolean,
     *           STRING: Expect a single string,
     *           COLLECTIONS: Expect a Array of the above types
     *              e.g. [NUMBER, ARRAY, STRING]. The collection is not a flatted array.
     * @param [optional]
     * @return {string|number|boolean|{}}
     */
    accept(param, types, optional = false) {
        if ((param === undefined || param === null) && !optional) {
            const args = [];
            types.forEach(type => args.push(ReversedTypes[type]));
            throw FormulaError.ARG_MISSING(args);
        } else if (param === undefined || param === null)
            return undefined;

        const isArray = param.isArray;
        param = param.value;
        // change expectSingle to false when needed
        if (types.includes(Types.ARRAY) && (Array.isArray(param) || param.collections)) {
            // flatten the array
            if (param.collections)
                param = param.collections;
            return this.flattenDeep(param);
        } else if (types.includes(Types.COLLECTIONS))
            return param;

        // the only possible types for expectSingle=true are: string, boolean, number;
        // If array encountered, extract the first element.
        // extract first element from array
        if (isArray) {
            param = param[0][0];
        }
        const paramType = this.type(param);
        types.forEach(type => {
            if (type === Types.STRING) {
                if (paramType === Types.BOOLEAN)
                    param = param ? 'TRUE' : 'FALSE';
                else
                    param = `${param}`
            } else if (type === Types.BOOLEAN) {
                if (paramType === Types.STRING)
                    throw FormulaError.VALUE;
                if (paramType === Types.NUMBER)
                    param = Boolean(param);
            } else if (type === Types.NUMBER) {
                param = this.acceptNumber(param, false);
            }
        });
        return param;

    }

    type(variable) {
        let type = this.type2Number[typeof variable];
        if (type === -1) {
            if (Array.isArray(variable))
                type = Types.ARRAY;
            else if (variable.ref) {
                if (variable.ref.from) {
                    type = Types.RANGE_REF;
                } else {
                    type = Types.CELL_REF;
                }
            } else if (variable.collections)
                type = Types.COLLECTIONS;
        }
        return type;
    }

    isRangeRef(param) {
        return param.ref && param.ref.from;
    }

    isCellRef(param) {
        return param.ref && !param.ref.from;
    }
}

module.exports = {
    FormulaHelpers: new FormulaHelpers(),
    Types,
    ReversedTypes,
};

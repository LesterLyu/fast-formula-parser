const FormulaError = require('./error');

const Types = {
    NUMBER: 0,
    ARRAY: 1,
    BOOLEAN: 2,
    STRING: 3,
    RANGE_REF: 4, // can be 'A:C' or '1:4', not only 'A1:C3'
    CELL_REF: 5,
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

    checkFunctionResult(result, ) {
        // number
        if (typeof result === 'number') {
            if (isNaN(result)) {
                throw FormulaError.VALUE;
            }
        }
        // string: OK
        // TODO...

        return result;
    }

    /**
     *
     * @param param
     * @param types - Types can only be ARRAY or RANGE_REF
     * @param flatten
     */
    acceptMany(param, types, flatten=true) {

    }

    acceptNumber(obj) {
        let number;

        if (typeof obj === 'number')
            number = obj;
        else if (typeof obj === 'boolean')
            number = Number(obj);
        else if (typeof obj === 'string') {
            number = Number(obj);
            if (isNaN(number))
                throw FormulaError;
        }
        else if (Array.isArray(obj)) {
            if (obj[0].length === 1)
                number = this.acceptNumber(obj[0][0]);
        }
        else {
            throw Error('Unknown error in FormulaHelpers.acceptNumber')
        }
        return number;

    }


    /**
     * Check if the param valid, return the parsed param.
     * @param {*} param
     * @param {Array} types - The expected type
     * @param [optional]
     * @param [expectSingle] - If the param is only one value
     * @param {boolean} [extractRef]
     * @return {string|number|boolean|{}}
     */
    accept(param, types, optional=false, expectSingle=true, extractRef=true) {
        if ((param === undefined || param === null) && !optional) {
            const args = [];
            types.forEach(type => args.push(ReversedTypes[type]));
            throw FormulaError.ARG_MISSING(args);
        } else if (param === undefined || param === null)
            return undefined;

        // change expectSingle to false when needed
        if (types.includes(Types.CELL_REF) || types.includes(Types.RANGE_REF) || types.includes(Types.ARRAY)) {
            expectSingle = false;
        }

        // the only possible types for expectSingle=true are: string, boolean, number;
        // If array or range ref encountered, extract the first element.
        if (expectSingle) {
            // extract first element from array, except reference a row of elements, e.g. A1:C1
            // e.g. A1:A5
            if (this.isRangeRef(param)) {
                if (param.ref.from.col === param.ref.to.col)
                    param = param.value[0][0];
                else
                    // e.g. A1:C3, A1:C1
                    throw FormulaError.VALUE;
            } else if (this.isCellRef(param)) {
                param = param.value;
            } else if (Array.isArray(param)) {
                param = param[0][0];
            }
            const paramType = this.type(param);
            types.forEach(type => {
                if (type === Types.STRING) {
                    param = `${param}`
                }
                else if (type === Types.BOOLEAN) {
                    if (paramType === Types.STRING)
                        throw FormulaError.VALUE;
                    if (paramType === Types.NUMBER)
                        param = Boolean(param);
                }
                else if (type === Types.NUMBER) {
                    if (paramType === Types.STRING)
                        throw FormulaError.VALUE;
                    if (paramType === Types.BOOLEAN)
                        param = Number(param);
                }
            });
            return param;
        } else {
            throw FormulaError.NOT_IMPLEMENTED();
        }
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
            }
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

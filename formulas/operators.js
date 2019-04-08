const FormulaError = require('../formulas/error');
const {FormulaHelpers} = require('../formulas/helpers');

const Prefix = {
    unaryOp: (prefixes, value, isArray) => {
        try {
            value = FormulaHelpers.acceptNumber(value, isArray);
        } catch (e) {
            if (e instanceof FormulaError)
                return e;
            throw e;
        }

        prefixes.forEach(prefix => {
            if (prefix === '+') {

            } else if (prefix === '-') {
                value = -value;
            } else {
                throw new Error(`Unrecognized prefix: ${prefix}`);
            }
        });
        return value;
    }
};

const Postfix = {
    percentOp: (value, postfix, isArray) => {
        try {
            value = FormulaHelpers.acceptNumber(value, isArray);
        } catch (e) {
            if (e instanceof FormulaError)
                return e;
            throw e;
        }
        if (postfix === '%') {
            return value / 100;
        }
        throw new Error(`Unrecognized postfix: ${postfix}`);
    }
};

const type2Number = {'boolean': 3, 'string': 2, 'number': 1};

const Infix = {
    compareOp: (value1, infix, value2, isArray1, isArray2) => {
        // for array: {1,2,3}, get the first element to compare
        if (isArray1) {
            value1 = value1[0][0];
        }
        if (isArray2) {
            value2 = value2[0][0];
        }

        if (value1 instanceof FormulaError)
            return value1;
        if (value2 instanceof FormulaError)
            return value2;

        const type1 = typeof value1, type2 = typeof value2;

        if (type1 === type2) {
            // same type comparison
            switch (infix) {
                case '=':
                    return value1 === value2;
                case '>':
                    return value1 > value2;
                case '<':
                    return value1 < value2;
                case '<>':
                    return value1 !== value2;
                case '<=':
                    return value1 <= value2;
                case '>=':
                    return value1 >= value2;
            }
        }
        else {
            switch (infix) {
                case '=':
                    return false;
                case '>':
                    return type2Number[type1] > type2Number[type2];
                case '<':
                    return type2Number[type1] < type2Number[type2];
                case '<>':
                    return true;
                case '<=':
                    return type2Number[type1] <= type2Number[type2];
                case '>=':
                    return type2Number[type1] >= type2Number[type2];
            }

        }
        throw Error('Infix.compareOp: Should not reach here.');
    },

    concatOp: (value1, infix, value2, isArray1, isArray2) => {
        // for array: {1,2,3}, get the first element to concat
        if (isArray1) {
            value1 = value1[0][0];
        }
        if (isArray2) {
            value2 = value2[0][0];
        }

        if (value1 instanceof FormulaError)
            return value1;
        if (value2 instanceof FormulaError)
            return value2;

        const type1 = typeof value1, type2 = typeof value2;
        // convert boolean to string
        if (type1 === 'boolean')
            value1 = value1 ? 'TRUE' : 'FALSE';
        if (type2 === 'boolean')
            value2 = value2 ? 'TRUE' : 'FALSE';
        return '' + value1 + value2;
    },

    mathOp: (value1, infix, value2, isArray1, isArray2) => {
        try {
            value1 = FormulaHelpers.acceptNumber(value1, isArray1);
            value2 = FormulaHelpers.acceptNumber(value2, isArray2);
        } catch (e) {
            if (e instanceof FormulaError)
                return e;
            throw e;
        }

        switch (infix) {
            case '+':
                return value1 + value2;
            case '-':
                return value1 - value2;
            case '*':
                return value1 * value2;
            case '/':
                if (value2 === 0)
                    return FormulaError.DIV0;
                return value1 / value2;
            case '^':
                return value1 ** value2;
        }

        throw Error('Infix.mathOp: Should not reach here.');
    },

};

module.exports = {
    Prefix,
    Postfix,
    Infix,
    Operators: {
        compareOp: ['<', '>', '=', '<>', '<=', '>='],
        concatOp: ['&'],
        mathOp: ['+', '-', '*', '/', '^'],
    }
};

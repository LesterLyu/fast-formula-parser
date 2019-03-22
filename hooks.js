const functions = {};

class FormulaParser {

    constructor() {
        this.functions = {};
    }

    static getCell(cell) {
        console.log('get cell', cell);
    }

    static getColumnRange(range) {
        console.log('get col range', range);
    }

    static getRowRange(range) {
        console.log('get row range', range);
    }

    static getRange(...params) {
        console.log('get range', params);
    }

    static getVariable(name) {
        console.log('get variable', name);
        return 0;
    }

    static callFunction(name, args) {
        return functions[name](...args);
    }

    /**
     * @param {string} number
     * @return {number}
     */
    static toNumber(number) {
        return Number(number);
    }

    /**
     * @param {string} string
     * @return {string}
     */
    static toString(string) {
        return string.substring(1, string.length - 1);
    }

    /**
     * @param {string} bool
     * @return {boolean}
     */
    static toBoolean(bool) {
        return bool === 'TRUE';
    }

    /**
     * @param {string} error
     * @return {string}
     */
    static toError(error) {
        return error;
    }

    static applyPrefix(prefix, value) {
        // TO-DO if value is 1D or 2D array
        if (prefix === '+') {
            return value;
        } else if (prefix === '-') {
            return -value;
        }
        throw new Error(`Unrecognized prefix: ${prefix}`);
    }

    static applyPostfix(value, postfix) {
        // TO-DO if value is 1D or 2D array
        if (postfix === '%') {
            return value / 100;
        }
        throw new Error(`Unrecognized postfix: ${postfix}`);
    }

    static applyInfix(value1, infix, value2) {
        // TO-DO if value is 1D or 2D array
        switch (infix) {
            case '^':
                return value1 ** value2;
            case '*':
                return value1 * value2;
            case '/':
                return value1 / value2;
            case '+':
                return value1 + value2;
            case '-':
                return value1 - value2;
            case '&':
                return '' + value1 + value2;
            case '>':
                return value1 > value2;
            case '<':
                return value1 < value2;
            case '=':
                return value1 === value2;
            case '<>':
                return value1 !== value2;
            case '<=':
                return value1 <= value2;
            case '>=':
                return value1 >= value2;
            default:
                throw new Error(`Unrecognized infix: ${infix}`);
        }
    }

    static applyIntersect() {

    }

    static applyUnion() {

    }

}

module.exports = {
    FormulaParser,

}

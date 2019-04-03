const FormulaError = require('./error');
const {FormulaHelpers, Types} = require('./helpers');
const H = FormulaHelpers;
const ssf = require('ssf');

const TextFunctions = {
    ASC: (...params) => {

    },

    BAHTTEXT: (...params) => {

    },

    CHAR: (number) => {
        number = H.accept(number, Types.NUMBER);
        if (number > 255 || number < 1)
            throw FormulaError.VALUE;
        return String.fromCharCode(number);
    },

    CLEAN: (...params) => {

    },

    CODE: (...params) => {

    },

    CONCAT: (...params) => {
        let texts = H.accept(params.shift(), Types.ARRAY_OR_STRING);
        if (Array.isArray(texts))
            texts = texts.join('');
        params.forEach(param => {
            let text = H.accept(param, Types.ARRAY_OR_STRING, true);
            if (text) {
                if (Array.isArray(text))
                    text = text.join('');
                texts += text;
            }
        });
        return texts
    },

    CONCATENATE: (...params) => {
        let texts = H.accept(params.shift(), Types.STRING);
        params.forEach(param => {
            const text = H.accept(param, Types.STRING, true);
            if (text)
                texts += text;
        });
        return texts
    },

    DBCS: (...params) => {

    },

    DOLLAR: (...params) => {

    },

    EXACT: (...params) => {

    },

    FIND: (findText, withinText, startNum) => {
        findText = H.accept(findText, Types.STRING);
        withinText = H.accept(withinText, Types.STRING);
        startNum = H.accept(startNum, Types.NUMBER, true);
        if (startNum === undefined)
            startNum = 1;
        if (startNum < 1 || startNum > withinText.length)
            throw FormulaError.VALUE;
        const res = withinText.indexOf(findText, startNum - 1);
        if (res === -1)
            throw FormulaError.VALUE;
        return res + 1;
    },

    FINDB: (...params) => {
        return TextFunctions.FIND(...params);
    },

    FIXED: (...params) => {

    },

    LEFT: (text, numChars) => {
        text = H.accept(text, Types.STRING);
        numChars = H.accept(numChars, Types.NUMBER, true);
        if (numChars === undefined)
            numChars = 1;

        if (numChars < 0)
            throw FormulaError.VALUE;
        if (numChars > text.length)
            return text;
        return text.slice(0, numChars);
    },

    LEFTB: (...params) => {
        return TextFunctions.LEFT(...params);
    },

    LEN: (text) => {
        text = H.accept(text, Types.STRING);
        return text.length;
    },

    LENB: (...params) => {

    },

    LOWER: (...params) => {

    },

    MID: (...params) => {

    },

    MIDB: (...params) => {

    },

    NUMBERVALUE: (...params) => {

    },

    PHONETIC: (...params) => {

    },

    PROPER: (...params) => {

    },

    REPLACE: (...params) => {

    },

    REPLACEB: (...params) => {

    },

    REPT: (...params) => {

    },

    RIGHT: (text, numChars) => {
        text = H.accept(text, Types.STRING);
        if (numChars.omitted) {
            numChars = 1;
        } else {
            numChars = H.accept(numChars, Types.NUMBER);
        }
        if (numChars < 0)
            throw FormulaError.VALUE;
        const len = text.length;
        if (numChars > len)
            return text;
        return text.slice(len - numChars);
    },

    RIGHTB: (...params) => {

    },

    SEARCH: (findText, withinText, startNum) => {
        findText = H.accept(findText, Types.STRING);
        withinText = H.accept(withinText, Types.STRING);
        startNum = H.accept(startNum, Types.NUMBER, true);
        if (startNum === undefined)
            startNum = 1;
        if (startNum < 1 || startNum > withinText.length)
            throw FormulaError.VALUE;
        findText = findText.replace(/[.]/, '')
        // transform to regex expression
        let findTextRegex = '[';
        for (let i = 0; i < findText.length; i++) {
            const char = findText[i];
            // A question mark matches any single character; an asterisk matches any sequence of characters.
            if (char === '*' || char === '?') {
                findTextRegex += `]${char === '*' ? '.*' : '.'}[`;
            } else if (char === '[' || char === ']') {
                findTextRegex += '\\' + char;
            } else {
                findTextRegex += char;
            }
        }
        findTextRegex += ']';
        findTextRegex = findTextRegex.replace(/\[\]/, '');
        const res = withinText.slice(startNum - 1).search(RegExp(findTextRegex, 'i'));
        if (res === -1)
            throw FormulaError.VALUE;
        return res + startNum;
    },

    SEARCHB: (...params) => {

    },

    SUBSTITUTE: (...params) => {

    },

    T: (value) => {
        // extract the real parameter
        value = H.accept(value);
        if (typeof value === "string")
            return value;
        return '';
    },

    TEXT: (value, formatText) => {
        value = H.accept(value, Types.NUMBER);
        formatText = H.accept(formatText, Types.STRING);
        // I know ssf contains bugs...
        return ssf.format(formatText, value);
    },

    TEXTJOIN: (...params) => {

    },

    TRIM: (...params) => {

    },

    TEXTJOIN: (...params) => {

    },

    UNICHAR: (...params) => {

    },

    UNICODE: (...params) => {

    },
};

module.exports = TextFunctions;

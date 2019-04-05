const FormulaError = require('../error');
const {FormulaHelpers, Types} = require('../helpers');
const H = FormulaHelpers;

// Spreadsheet number format
const ssf = require('../../ssf/ssf');

// Change number to Thai pronunciation string
const bahttext = require('bahttext');

// full-width and half-width converter
const charsets = {
    latin: {halfRE: /[!-~]/g, fullRE: /[！-～]/g, delta: 0xFEE0},
    hangul1: {halfRE: /[ﾡ-ﾾ]/g, fullRE: /[ᆨ-ᇂ]/g, delta: -0xEDF9},
    hangul2: {halfRE: /[ￂ-ￜ]/g, fullRE: /[ᅡ-ᅵ]/g, delta: -0xEE61},
    kana: {delta: 0,
        half: "｡｢｣､･ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝﾞﾟ",
        full: "。「」、・ヲァィゥェォャュョッーアイウエオカキクケコサシ" +
            "スセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワン゛゜"},
    extras: {delta: 0,
        half: "¢£¬¯¦¥₩\u0020|←↑→↓■°",
        full: "￠￡￢￣￤￥￦\u3000￨￩￪￫￬￭￮"}
};
const toFull = set => c => set.delta ?
    String.fromCharCode(c.charCodeAt(0) + set.delta) :
    [...set.full][[...set.half].indexOf(c)];
const toHalf = set => c => set.delta ?
    String.fromCharCode(c.charCodeAt(0) - set.delta) :
    [...set.half][[...set.full].indexOf(c)];
const re = (set, way) => set[way + "RE"] || new RegExp("[" + set[way] + "]", "g");
const sets = Object.keys(charsets).map(i => charsets[i]);
const toFullWidth = str0 =>
    sets.reduce((str,set) => str.replace(re(set, "half"), toFull(set)), str0);
const toHalfWidth = str0 =>
    sets.reduce((str,set) => str.replace(re(set, "full"), toHalf(set)), str0);

const TextFunctions = {
    ASC: (text) => {
        text = H.accept(text, Types.STRING);
        return toHalfWidth(text);
    },

    BAHTTEXT: (number) => {
        number = H.accept(number, Types.NUMBER);
        try {
            return bahttext(number);
        } catch (e) {
            throw Error(`Error in https://github.com/jojoee/bahttext \n${e.toString()}`)
        }
    },

    CHAR: (number) => {
        number = H.accept(number, Types.NUMBER);
        if (number > 255 || number < 1)
            throw FormulaError.VALUE;
        return String.fromCharCode(number);
    },

    CLEAN: (text) => {
        text = H.accept(text, Types.STRING);
        return text.replace(/[\x00-\x1F]/g, '');
    },

    CODE: (text) => {
        text = H.accept(text, Types.STRING);
        return text.charCodeAt(0);
    },

    CONCAT: (...params) => {
        let text = '';
        H.flattenParams(params, Types.STRING, item => {
            text += item;
        });
        return text
    },

    CONCATENATE: (...params) => {
        let text = '';
        H.flattenParams(params, Types.STRING, item => {
            text += item;
        }, false);
        return text;
    },

    DBCS: (text) => {
        text = H.accept(text, Types.STRING);
        return toFullWidth(text);
    },

    DOLLAR: (number, decimals) => {
        number = H.accept(number, Types.NUMBER);
        decimals = H.accept(decimals, Types.NUMBER, true);
        if (decimals === undefined)
            decimals = 2;
        const decimalString = Array(decimals).fill('0').join('');
        // Note: does not support locales
        // TODO: change currency based on user locale or settings from this library
        return ssf.format(`$#,##0.${decimalString}_);($#,##0.${decimalString})`, number).trim();
    },

    EXACT: (text1, text2) => {
        text1 = H.accept(text1, [Types.STRING]);
        text2 = H.accept(text2, [Types.STRING]);

        return text1 === text2;
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

    FIXED: (number, decimals, noCommas) => {
        number = H.accept(number, Types.NUMBER);
        decimals = H.accept(decimals, Types.NUMBER, true);
        noCommas = H.accept(noCommas, Types.BOOLEAN,true);

        if (decimals === undefined)
            decimals = 2;
        const decimalString = Array(decimals).fill('0').join('');
        const comma = noCommas ? '' : '#,';
        return ssf.format(`${comma}##0.${decimalString}_);(${comma}##0.${decimalString})`, number).trim();
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
        return TextFunctions.LEN(...params);
    },

    LOWER: (text) => {
        text = H.accept(text, [Types.STRING]);
        return text.toLowerCase();
    },

    MID: (text, start_num, num_chars) => {
        text = H.accept(text, [Types.STRING]);
        start_num = H.accept(start_num, [Types.NUMBER]);
        num_chars = H.accept(num_chars, [Types.NUMBER]);
        let str = "";

        for (let i = start_num - 1; i < num_chars; i++) {
            str += text[i];
        }
        return str;
    },

    MIDB: (...params) => {
        return TextFunctions.MID(...params);
    },

    NUMBERVALUE: (...params) => {

    },

    PHONETIC: (...params) => {

    },

    PROPER: (text) => {
        text = H.accept(text, [Types.STRING]);
        let str = text.split(" ");
        const word = [];

        for (let char of str) {
            word.push(char[0].toUpperCase() + char.slice(1));
        }
        return word.join(" ");
    },

    REPLACE: (old_text, start_num, num_chars, new_text) => {
        old_text = H.accept(old_text, [Types.STRING]);
        start_num = H.accept(start_num, [Types.NUMBER]);
        num_chars = H.accept(num_chars, [Types.NUMBER]);
        new_text = H.accept(new_text, [Types.STRING]);

        let arr = old_text.split("");
        arr.splice(start_num - 1, num_chars, new_text);

        return arr.join("");
    },

    REPLACEB: (...params) => {
        return TextFunctions.REPLACE(...params)
    },

    REPT: (text, number_times) => {
        text = H.accept(text, [Types.STRING]);
        number_times = H.accept(number_times, [Types.NUMBER]);
        let str = "";

        for (let i = 0; i < number_times; i++) {
            str += text;
        }
        return str;
    },

    RIGHT: (text, numChars) => {
        text = H.accept(text, Types.STRING);
        numChars = H.accept(numChars, Types.NUMBER, true);
        if (numChars === undefined)
            numChars = 1;
        if (numChars < 0)
            throw FormulaError.VALUE;
        const len = text.length;
        if (numChars > len)
            return text;
        return text.slice(len - numChars);
    },

    RIGHTB: (...params) => {
        return TextFunctions.RIGHT(...params);
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
            if (char === '~') {
                const nextChar = findText[i + 1];
                if (nextChar === '?' || nextChar === '*') {
                    // TODO;
                }
            } else if (char === '*' || char === '?') {
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
        return TextFunctions.SEARCH(...params)
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
        try {
            return ssf.format(formatText, value);
        } catch (e) {
            console.error(e)
            throw FormulaError.VALUE;
        }
    },

    TEXTJOIN: (...params) => {

    },

    TRIM: (text) => {
        text = H.accept(text, [Types.STRING]);
        return text.replace(/^\s+|\s+$/g, '')
    },

    TEXTJOIN: (...params) => {

    },

    UNICHAR: (number) => {
        number = H.accept(number, [Types.NUMBER]);
        return TextFunctions.CHAR(number);
    },

    UNICODE: (text) => {
        text = H.accept(text, [Types.STRING]);
        return TextFunctions.CODE(text);
    },
};

module.exports = TextFunctions;

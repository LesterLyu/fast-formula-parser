const FormulaError = require('../error');
const {FormulaHelpers, Types, WildCard} = require('../helpers');
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
    kana: {
        delta: 0,
        half: "｡｢｣､･ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝﾞﾟ",
        full: "。「」、・ヲァィゥェォャュョッーアイウエオカキクケコサシ" +
            "スセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワン゛゜"
    },
    extras: {
        delta: 0,
        half: "¢£¬¯¦¥₩\u0020|←↑→↓■°",
        full: "￠￡￢￣￤￥￦\u3000￨￩￪￫￬￭￮"
    }
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
    sets.reduce((str, set) => str.replace(re(set, "half"), toFull(set)), str0);
const toHalfWidth = str0 =>
    sets.reduce((str, set) => str.replace(re(set, "full"), toHalf(set)), str0);

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
        if (text.length === 0)
            throw FormulaError.VALUE;
        return text.charCodeAt(0);
    },

    CONCAT: (...params) => {
        let text = '';
        // does not allow union
        H.flattenParams(params, Types.STRING, false, item => {
            item = H.accept(item, Types.STRING);
            text += item;
        });
        return text
    },

    CONCATENATE: (...params) => {
        let text = '';
        if (params.length === 0)
            throw Error('CONCATENATE need at least one argument.');
        params.forEach(param => {
            // does not allow range reference, array, union
            param = H.accept(param, Types.STRING);
            text += param;
        });

        return text;
    },

    DBCS: (text) => {
        text = H.accept(text, Types.STRING);
        return toFullWidth(text);
    },

    DOLLAR: (number, decimals) => {
        number = H.accept(number, Types.NUMBER);
        decimals = H.accept(decimals, Types.NUMBER, 2);
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
        startNum = H.accept(startNum, Types.NUMBER, 1);
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
        decimals = H.accept(decimals, Types.NUMBER, 2);
        noCommas = H.accept(noCommas, Types.BOOLEAN, false);

        const decimalString = Array(decimals).fill('0').join('');
        const comma = noCommas ? '' : '#,';
        return ssf.format(`${comma}##0.${decimalString}_);(${comma}##0.${decimalString})`, number).trim();
    },

    LEFT: (text, numChars) => {
        text = H.accept(text, Types.STRING);
        numChars = H.accept(numChars, Types.NUMBER, 1);

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
        text = H.accept(text, Types.STRING);
        return text.toLowerCase();
    },

    MID: (text, startNum, numChars) => {
        text = H.accept(text, Types.STRING);
        startNum = H.accept(startNum, Types.NUMBER);
        numChars = H.accept(numChars, Types.NUMBER);
        if (startNum > text.length)
            return '';
        if (startNum < 1 || numChars < 1)
            throw FormulaError.VALUE;
        return text.slice(startNum - 1, startNum + numChars - 1);
    },

    MIDB: (...params) => {
        return TextFunctions.MID(...params);
    },

    NUMBERVALUE: (text, decimalSeparator, groupSeparator) => {
        text = H.accept(text, Types.STRING);
        // TODO: support reading system locale and set separators
        decimalSeparator = H.accept(decimalSeparator, Types.STRING, '.');
        groupSeparator = H.accept(groupSeparator, Types.STRING, ',');

        if (text.length === 0)
            return 0;
        if (decimalSeparator.length === 0 || groupSeparator.length === 0)
            throw FormulaError.VALUE;
        decimalSeparator = decimalSeparator[0];
        groupSeparator = groupSeparator[0];
        if (decimalSeparator === groupSeparator
            || text.indexOf(decimalSeparator) < text.lastIndexOf(groupSeparator))
            throw FormulaError.VALUE;

        const res = text.replace(groupSeparator, '')
            .replace(decimalSeparator, '.')
            // remove chars that not related to number
            .replace(/[^\-0-9.%()]/g, '')
            .match(/([(-]*)([0-9]*[.]*[0-9]+)([)]?)([%]*)/);
        if (!res)
            throw FormulaError.VALUE;
        // ["-123456.78%%", "(-", "123456.78", ")", "%%"]
        const leftParenOrMinus = res[1].length, rightParen = res[3].length, percent = res[4].length;
        let number = Number(res[2]);
        if (leftParenOrMinus > 1 || leftParenOrMinus && !rightParen
            || !leftParenOrMinus && rightParen || isNaN(number))
            throw FormulaError.VALUE;
        number = number / 100 ** percent;
        return leftParenOrMinus ? -number : number;
    },

    PHONETIC: () => {
    },

    PROPER: (text) => {
        text = H.accept(text, [Types.STRING]);
        text = text.toLowerCase();
        text = text.charAt(0).toUpperCase() + text.slice(1);
        return text.replace(/(?:[^a-zA-Z])([a-zA-Z])/g,
            letter => letter.toUpperCase());
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
        text = H.accept(text, Types.STRING);
        number_times = H.accept(number_times, Types.NUMBER);
        let str = "";

        for (let i = 0; i < number_times; i++) {
            str += text;
        }
        return str;
    },

    RIGHT: (text, numChars) => {
        text = H.accept(text, Types.STRING);
        numChars = H.accept(numChars, Types.NUMBER, 1);

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
        startNum = H.accept(startNum, Types.NUMBER, 1);
        if (startNum < 1 || startNum > withinText.length)
            throw FormulaError.VALUE;

        // transform to js regex expression
        let findTextRegex = WildCard.isWildCard(findText) ? WildCard.toRegex(findText, 'i') : findText;
        const res = withinText.slice(startNum - 1).search(findTextRegex);
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

    UNICHAR: (number) => {
        number = H.accept(number, [Types.NUMBER]);
        if (number <= 0)
            throw FormulaError.VALUE;
        return String.fromCharCode(number);
    },

    UNICODE: (text) => {
        return TextFunctions.CODE(text);
    },
};

module.exports = TextFunctions;

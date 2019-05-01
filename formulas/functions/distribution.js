const FormulaError = require('../error');
const {FormulaHelpers, Types, Criteria, Address} = require('../helpers');
const {Infix} = require('../operators');
const H = FormulaHelpers;
var utils = require('../lib/utils');
const jStat = require('jstat');
const MathFunctions = require('./math');

const DistributionFunctions = {
    'BETA.DIST': (x, alpha, beta, cumulative, a, b) => {
        x = H.accept(x, Types.NUMBER);
        alpha = H.accept(alpha, Types.NUMBER);
        beta = H.accept(beta, Types.NUMBER);
        cumulative = H.accept(cumulative, Types.BOOLEAN);
        a = H.accept(a, Types.NUMBER, 0);
        b = H.accept(b, Types.NUMBER, 1);
        if (alpha <= 0 || beta <= 0 || x < a || x > b || a === b)
            throw FormulaError.NUM;

        x = (x - a) / (b - a);
        return cumulative ? jStat.beta.cdf(x, alpha, beta) : jStat.beta.pdf(x, alpha, beta) / (b - a);
    },

    'BETA.INV': (probability, alpha, beta, a, b) => {
        probability = H.accept(probability, Types.NUMBER);
        alpha = H.accept(alpha, Types.NUMBER);
        beta = H.accept(beta, Types.NUMBER);
        a = H.accept(a, Types.NUMBER, 0);
        b = H.accept(b, Types.NUMBER, 1);
        if (alpha <= 0 || beta <= 0 || probability <= 0 || probability > 1)
            throw FormulaError.NUM;
        return jStat.beta.inv(probability, alpha, beta) * (b - a) + a;
    },

    'BINOM.DIST': (numberS, trials, probabilityS, cumulative) => {
        numberS = H.accept(numberS, Types.NUMBER);
        trials = H.accept(trials, Types.NUMBER);
        probabilityS = H.accept(probabilityS, Types.NUMBER);
        cumulative = H.accept(cumulative, Types.BOOLEAN);
        if (trials < 0 || probabilityS < 0 || probabilityS > 1 || numberS < 0 || numberS > trials)
            throw FormulaError.NUM;

        return cumulative ? jStat.binomial.cdf(numberS, trials, probabilityS)
            : jStat.binomial.pdf(numberS, trials, probabilityS);
    },

    'BINOM.DIST.RANGE': (trials, probabilityS, numberS, numberS2) => {
        trials = H.accept(trials, Types.NUMBER);
        probabilityS = H.accept(probabilityS, Types.NUMBER);
        numberS = H.accept(numberS, Types.NUMBER);
        numberS2 = H.accept(numberS2, Types.NUMBER, numberS);
        if (trials < 0 || probabilityS < 0 || probabilityS > 1 || numberS < 0 || numberS > trials || numberS2 < numberS || numberS2 > trials)
            throw FormulaError.NUM;

        let result = 0;
        for (let i = numberS; i <= numberS2; i++) {
            result += MathFunctions.COMBIN(trials, i) * Math.pow(probabilityS, i) * Math.pow(1 - probabilityS, trials - i);
        }
        return result;
    },

    'BINOM.INV': (trials, probabilityS, alpha) => {
        trials = H.accept(trials, Types.NUMBER);
        probabilityS = H.accept(probabilityS, Types.NUMBER);
        alpha = H.accept(alpha, Types.NUMBER);
        if (trials < 0 || probabilityS < 0 || probabilityS > 1 || alpha < 0 || alpha > 1)
            throw FormulaError.NUM;

        let x = 0;
        while (x <= trials) {
            if (jStat.binomial.cdf(x, trials, probabilityS) >= alpha) {
                return x;
            }
            x++;
        }
    },

    'CHISQ.DIST': (x, degFreedom, cumulative) => {
        x = H.accept(x, Types.NUMBER);
        degFreedom = H.accept(degFreedom, Types.NUMBER);
        cumulative = H.accept(cumulative, Types.NUMBER);
        degFreedom = Math.trunc(degFreedom);
        if (x < 0 || degFreedom < 1 || degFreedom > 10 ** 10)
            throw FormulaError.NUM;

        return cumulative ? jStat.chisquare.cdf(x, degFreedom) : jStat.chisquare.pdf(x, degFreedom);
    },

    'CHISQ.DIST.RT': (x, degFreedom) => {
        x = H.accept(x, Types.NUMBER);
        degFreedom = H.accept(degFreedom, Types.NUMBER);
        degFreedom = Math.trunc(degFreedom);
        if (x < 0 || degFreedom < 1 || degFreedom > 10 ** 10)
            throw FormulaError.NUM;

        return 1 - jStat.chisquare.cdf(x, degFreedom);
    },

    'CHISQ.INV': (probability, degFreedom) => {
        probability = H.accept(probability, Types.NUMBER);
        degFreedom = H.accept(degFreedom, Types.NUMBER);
        degFreedom = Math.trunc(degFreedom);
        if (probability < 0 || probability > 1 || degFreedom < 1 || degFreedom > 10 ** 10)
            throw FormulaError.NUM;

        return jStat.chisquare.inv(probability, degFreedom);
    },

    'CHISQ.INV.RT': (probability, degFreedom) => {
        probability = H.accept(probability, Types.NUMBER);
        degFreedom = H.accept(degFreedom, Types.NUMBER);
        degFreedom = Math.trunc(degFreedom);
        if (probability < 0 || probability > 1 || degFreedom < 1 || degFreedom > 10 ** 10)
            throw FormulaError.NUM;

        return jStat.chisquare.inv(1 - probability, degFreedom);
    },

    'CHISQ.TEST': (actualRange, expectedRange) => {
        // TODO
        const actual = [], expected = [];
        H.flattenParams(actualRange, null, false, (item, info) => {
            if (info.isLiteral) throw FormulaError.VALUE;
            if (typeof item === "number") {
                actual.push(item);
            }
        });
        H.flattenParams(expectedRange, null, false, (item, info) => {
            if (info.isLiteral) throw FormulaError.VALUE;
            if (typeof item === "number") {
                expected.push(item);
            }
        });

        if (actual.length !== expected.length)
            throw FormulaError.NA;

        const row = actual.length;
        const col = actual[0].length;
        const dof = (col === 1) ? row - 1 : (row - 1) * (col - 1);
        let xsqr = 0;

        for (let i = 0; i < row; i++) {
            xsqr += Math.pow((actual[i] - expected[i]), 2) / expected[i];
        }

        // Get independent by X square and its degree of freedom
        let p = Math.exp(-0.5 * xsqr);
        if ((dof % 2) === 1) {
            p = p * Math.sqrt(2 * xsqr / Pi);
        }
        let k = dof;
        while (k >= 2) {
            p = p * xsqr / k;
            k = k - 2;
        }
        let t = p, a = dof;
        while (t > 0.000000000000001 * p) {
            a = a + 2;
            t = t * xsqr / a;
            p = p + t;
        }
        return 1 - p;
    },

    'CONFIDENCE.NORM': (alpha, std, size) => {
        alpha = H.accept(alpha, Types.NUMBER);
        std = H.accept(std, Types.NUMBER);
        size = H.accept(size, Types.NUMBER);
        size = Math.trunc(size);
        if (alpha <= 0 || alpha >= 1 || std <= 0 || size < 1)
            throw FormulaError.NUM;
        return jStat.normalci(1, alpha, std, size)[1] - 1;
    },

    'CONFIDENCE.T': (alpha, std, size) => {
        alpha = H.accept(alpha, Types.NUMBER);
        std = H.accept(std, Types.NUMBER);
        size = H.accept(size, Types.NUMBER);
        size = Math.trunc(size);
        if (alpha <= 0 || alpha >= 1 || std <= 0 || size < 1)
            throw FormulaError.NUM;
        if (size === 1)
            throw FormulaError.DIV0;
        return jStat.tci(1, alpha, std, size)[1] - 1;
    },

    'CORREL': (array1, array2) => {
        // TODO
        array1 = H.accept(array1, Types.ARRAY, undefined, true, true);
        array2 = H.accept(array2, Types.ARRAY, undefined, true, true);
        if (array1.length !== array2.length)
            throw FormulaError.NA;

        return jStat.corrcoeff(array1, array2);
    },

    'F.DIST': (x, d1, d2, cumulative) => {
        x = H.accept(x, Types.NUMBER);
        d1 = H.accept(x, Types.NUMBER);
        d2 = H.accept(x, Types.NUMBER);
        if (utils.anyIsError(x, d1, d2)) {
            return error.value;
        }
        return (cumulative) ? jStat.centralF.cdf(x, d1, d2) : jStat.centralF.pdf(x, d1, d2);
    },

};



module.exports = {
    DistributionFunctions,
};

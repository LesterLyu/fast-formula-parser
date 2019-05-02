const FormulaError = require('../error');
const {FormulaHelpers, Types, Criteria, Address} = require('../helpers');
const {Infix} = require('../operators');
const H = FormulaHelpers;
const jStat = require("jstat");
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
        const actual = H.accept(actualRange, Types.ARRAY, undefined, false, false);
        const expected = H.accept(expectedRange, Types.ARRAY, undefined, false, false);

        if (actual.length !== expected.length || actual[0].length !== expected[0].length
            || actual.length === 1 && actual[0].length === 1)
            throw FormulaError.NA;

        const row = actual.length;
        const col = actual[0].length;
        let dof = (row - 1) * (col - 1);
        if (row === 1)
            dof = col - 1;
        else
            dof = row - 1;
        let xsqr = 0;

        for (let i = 0; i < row; i++) {
            for (let j = 0; j < col; j++) {
                if (typeof actual[i][j] !== "number" || typeof expected[i][j] !== "number")
                    continue;
                if (expected[i][j] === 0) throw FormulaError.DIV0;
                xsqr += Math.pow((actual[i][j] - expected[i][j]), 2) / expected[i][j];
            }
        }

        // Get independent by X square and its degree of freedom
        let p = Math.exp(-0.5 * xsqr);
        if ((dof % 2) === 1) {
            p = p * Math.sqrt(2 * xsqr / Math.PI);
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

    CORREL: (array1, array2) => {
        array1 = H.accept(array1, Types.ARRAY, undefined, true, true);
        array2 = H.accept(array2, Types.ARRAY, undefined, true, true);
        if (array1.length !== array2.length)
            throw FormulaError.NA;

        // filter out values that are not number
        const filterArr1 = [], filterArr2 = [];
        for (let i = 0; i < array1.length; i++) {
            if (typeof array1[i] !== "number" || typeof array2[i] !== "number")
                continue;
            filterArr1.push(array1[i]);
            filterArr2.push(array2[i]);
        }
        if (filterArr1.length <= 1)
            throw FormulaError.DIV0;

        return jStat.corrcoeff(filterArr1, filterArr2);
    },

    'COVARIANCE.P': (array1, array2) => {
        array1 = H.accept(array1, Types.ARRAY, undefined, true, true);
        array2 = H.accept(array2, Types.ARRAY, undefined, true, true);
        if (array1.length !== array2.length)
            throw FormulaError.NA;

        // filter out values that are not number
        const filterArr1 = [], filterArr2 = [];
        for (let i = 0; i < array1.length; i++) {
            if (typeof array1[i] !== "number" || typeof array2[i] !== "number")
                continue;
            filterArr1.push(array1[i]);
            filterArr2.push(array2[i]);
        }
        const mean1 = jStat.mean(filterArr1), mean2 = jStat.mean(filterArr2);
        let result = 0;
        for (let i = 0; i < filterArr1.length; i++) {
            result += (filterArr1[i] - mean1) * (filterArr2[i] - mean2);
        }
        return result / filterArr1.length;
    },

    'COVARIANCE.S': (array1, array2) => {
        array1 = H.accept(array1, Types.ARRAY, undefined, true, true);
        array2 = H.accept(array2, Types.ARRAY, undefined, true, true);
        if (array1.length !== array2.length)
            throw FormulaError.NA;

        // filter out values that are not number
        const filterArr1 = [], filterArr2 = [];
        for (let i = 0; i < array1.length; i++) {
            if (typeof array1[i] !== "number" || typeof array2[i] !== "number")
                continue;
            filterArr1.push(array1[i]);
            filterArr2.push(array2[i]);
        }

        if (filterArr1.length <= 1)
            throw FormulaError.DIV0;

        return jStat.covariance(filterArr1, filterArr2);
    },

    DEVSQ: (...numbers) => {
        let sum = 0, x = [];
        // parse number only if the input is literal
        H.flattenParams(numbers, Types.NUMBER, true, (item, info) => {
            if (typeof item === "number") {
                sum += item;
                x.push(item);
            }
        });
        const mean = sum / x.length;
        sum = 0;
        for (let i = 0; i < x.length; i++) {
            sum += (x[i] - mean) ** 2;
        }
        return sum;
    },

    'EXPON.DIST': (x, lambda, cumulative) => {
        x = H.accept(x, Types.NUMBER);
        lambda = H.accept(lambda, Types.NUMBER);
        cumulative = H.accept(cumulative, Types.BOOLEAN);
        if (x < 0 || lambda <= 0)
            throw FormulaError.NUM;
        return cumulative ? jStat.exponential.cdf(x, lambda) : jStat.exponential.pdf(x, lambda);
    },

    'F.DIST': (x, degFreedom1, degFreedom2, cumulative) => {
        x = H.accept(x, Types.NUMBER);
        degFreedom1 = H.accept(degFreedom1, Types.NUMBER);
        degFreedom2 = H.accept(degFreedom2, Types.NUMBER);
        cumulative = H.accept(cumulative, Types.BOOLEAN);
        degFreedom1 = Math.trunc(degFreedom1);
        degFreedom2 = Math.trunc(degFreedom2);
        return (cumulative) ? jStat.centralF.cdf(x, degFreedom1, degFreedom2)
            : jStat.centralF.pdf(x, degFreedom1, degFreedom2);
    },

    'F.DIST.RT': () => {
        // TODO
    },

    'F.INV': () => {
        // TODO
    },

    'F.INV.RT': () => {
        // TODO
    },

    /**
     * https://en.wikipedia.org/wiki/F-test_of_equality_of_variances
     */
    'F.TEST': (array1, array2) => {
        array1 = H.accept(array1, Types.ARRAY, undefined, true, true);
        array2 = H.accept(array2, Types.ARRAY, undefined, true, true);

        // filter out values that are not number
        const x1 = [], x2 = [];
        let x1Mean = 0, x2Mean = 0;
        for (let i = 0; i < Math.max(array1.length, array2.length); i++) {
            if (typeof array1[i] === "number") {
                x1.push(array1[i]);
                x1Mean += array1[i];
            }
            if (typeof array2[i] === "number") {
                x2.push(array2[i]);
                x2Mean += array2[i];
            }
        }
        if (x1.length <= 1 || x2.length <= 1)
            throw FormulaError.DIV0;

        x1Mean /= x1.length;
        x2Mean /= x2.length;
        let s1 = 0, s2 = 0; // sample variance S^2
        for (let i = 0; i < x1.length; i++) {
            s1 += (x1Mean - x1[i]) ** 2
        }
        s1 /= x1.length - 1;
        for (let i = 0; i < x2.length; i++) {
            s2 += (x2Mean - x2[i]) ** 2
        }
        s2 /= x2.length - 1;
        // P(F<=f) one-tail * 2
        return jStat.centralF.cdf(s1 / s2, x1.length - 1, x2.length - 1) * 2;
    },

    FISHER: () => {
        // TODO
    },

    FISHERINV: () => {
        // TODO
    },

    FORECAST: () => {
        // TODO
    },

    'FORECAST.ETS': () => {

    },

    'FORECAST.ETS.CONFINT': () => {

    },

    'FORECAST.ETS.SEASONALITY': () => {

    },

    'FORECAST.ETS.STAT': () => {

    },

    'FORECAST.LINEAR': () => {

    },

    FREQUENCY: () => {

    },

    GAMMA: () => {
        // TODO
    },

    'GAMMA.DIST': () => {
        // TODO
    },

    'GAMMA.INV': () => {
        // TODO
    },

    GAMMALN: () => {
        // TODO
    },

    'GAMMALN.PRECISE': () => {
        // TODO
    },

    GAUSS: () => {
        // TODO
    },

    GEOMEAN: () => {

    },

    GROWTH: () => {

    },

    HARMEAN: () => {

    },

    'HYPGEOM.DIST': () => {

    },

    INTERCEPT: () => {

    },

    KURT: () => {

    },

    LINEST: () => {

    },

    LOGEST: () => {

    },

    'LOGNORM.DIST': () => {

    },

    'LOGNORM.INV': () => {

    },

    'MODE.MULT': () => {

    },

    'MODE.SNGL': () => {

    },

    'NEGBINOM.DIST': () => {

    },

    'NORM.DIST': () => {

    },

    'NORM.INV': () => {

    },

    'NORM.S.DIST': () => {

    },

    'NORM.S.INV': () => {

    },

    PEARSON: () => {

    },

    'PERCENTILE.EXC': () => {

    },

    'PERCENTILE.INC': () => {

    },

    'PERCENTRANK.EXC': () => {

    },

    'PERCENTRANK.INC': () => {

    },

    PERMUTATIONA: () => {

    },

    PHI: () => {

    },

    'POISSON.DIST': () => {

    },

    'PROB': () => {

    },

    'QUARTILE.EXC': () => {

    },

    'QUARTILE.INC': () => {

    },

    'RANK.AVG': () => {

    },

    'RANK.EQ': () => {

    },

    RSQ: () => {

    },

    SKEW: () => {

    },

    'SKEW.P': () => {

    },

    SLOPE: () => {

    },

    STANDARDIZE: () => {

    },

    'STDEV.P': () => {

    },

    'STDEV.S': () => {

    },

    STDEVA: () => {

    },

    STDEVPA: () => {

    },

    STEYX: () => {

    },

    'T.DIST': () => {

    },

    'T.DIST.2T': () => {

    },

    'T.DIST.RT': () => {

    },

    'T.INV': () => {

    },

    'T.INV.2T': () => {

    },

    'T.TEST': () => {

    },

    TREND: () => {

    },

    TRIMMEAN: () => {

    },

    'VAR.P': () => {

    },

    'VAR.S': () => {

    },

    'VARA': () => {

    },

    'VARPA': () => {

    },

    'WEIBULL.DIST': () => {

    },

    'Z.TEST': () => {

    }
};


module.exports = {
    DistributionFunctions,
};

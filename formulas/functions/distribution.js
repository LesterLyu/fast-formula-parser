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

    'F.DIST': (x, d1, d2, cumulative) => {
        x = H.accept(x, Types.NUMBER);
        d1 = H.accept(d1, Types.NUMBER);
        d2 = H.accept(d2, Types.NUMBER);
        cumulative = H.accept(cumulative, Types.BOOLEAN);

        // If x is negative, F.DIST returns the #NUM! error value.
        // If deg_freedom1 < 1, F.DIST returns the #NUM! error value.
        // If deg_freedom2 < 1, F.DIST returns the #NUM! error value.
        if (x < 0 || d1 < 1 || d2 < 1) {
            throw FormulaError.NUM;
        }

        // If deg_freedom1 or deg_freedom2 is not an integer, it is truncated.
        d1 = Math.trunc(d1);
        d2 = Math.trunc(d2);

        return cumulative ? jStat.centralF.cdf(x, d1, d2) : jStat.centralF.pdf(x, d1, d2);
    },

    'F.DIST.RT': (x, d1, d2) => {
        // David
        x = H.accept(x, Types.NUMBER);
        d1 = H.accept(d1, Types.NUMBER);
        d2 = H.accept(d2, Types.NUMBER);
        // If deg_freedom1 < 1 F.DIST.RT returns the #NUM! error value.
        // If deg_freedom2 < 1 F.DIST.RT returns the #NUM! error value.
        // If x is negative, F.DIST.RT returns the #NUM! error value.
        if (x < 0 || d1 < 1 || d2 < 1) {
            throw FormulaError.NUM;
        }

        // If deg_freedom1 or deg_freedom2 is not an integer, it is truncated.
        d1 = Math.trunc(d1);
        d2 = Math.trunc(d2);

        return 1 - jStat.centralF.cdf(x, d1, d2);
    },

    'F.INV': (probability, d1, d2) => {
        // David
        probability = H.accept(probability, Types.NUMBER);
        d1 = H.accept(d1, Types.NUMBER);
        d2 = H.accept(d2, Types.NUMBER);
        // If probability < 0 or probability > 1, F.INV returns the #NUM! error value.
        if (probability < 0.0 || probability > 1.0) {
            throw FormulaError.NUM;
        }
        // If deg_freedom1 < 1, or deg_freedom2 < 1, F.INV returns the #NUM! error value.
        if (d1 < 1.0 || d2 < 1.0) {
            throw FormulaError.NUM;
        }

        // If deg_freedom1 or deg_freedom2 is not an integer, it is truncated.
        d1 = Math.trunc(d1);
        d2 = Math.trunc(d2);

        return jStat.centralF.inv(probability, d1, d2);
    },

    'F.INV.RT': (probability, d1, d2) => {
        // David
        probability = H.accept(probability, Types.NUMBER);
        d1 = H.accept(d1, Types.NUMBER);
        d2 = H.accept(d2, Types.NUMBER);
        // If Probability is < 0 or probability is > 1, F.INV.RT returns the #NUM! error value.
        if (probability < 0.0 || probability > 1.0) {
            throw FormulaError.NUM;
        }

        // If Deg_freedom1 is < 1, or Deg_freedom2 is < 1, F.INV.RT returns the #NUM! error value.
        if (d1 < 1.0 || d1 >= Math.pow(10, 10)) {
            throw FormulaError.NUM;
        }

        // If Deg_freedom2 is < 1 or Deg_freedom2 is ≥ 10^10, F.INV.RT returns the #NUM! error value.
        if (d2 < 1.0 || d2 >= Math.pow(10, 10)) {
            throw FormulaError.NUM;
        }
        // If Deg_freedom1 or Deg_freedom2 is not an integer, it is truncated.
        d1 = Math.trunc(d1);
        d2 = Math.trunc(d2);

        return jStat.centralF.inv(1.0 - probability, d1, d2);
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

    FISHER: (x) => {
        // David
        x = H.accept(x, Types.NUMBER);
        // If x ≤ -1 or if x ≥ 1, FISHER returns the #NUM! error value.
        if (x <= -1 || x >= 1) {
            throw FormulaError.NUM;
        }
        return Math.log((1 + x) / (1 - x)) / 2;
    },

    FISHERINV: (x) => {
        // David
        x = H.accept(x, Types.NUMBER);
        let e2y = Math.exp(2 * x);
        return (e2y - 1) / (e2y + 1);
    },

    // FIXME
    FORECAST: () => {

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

    GAMMA: (x) => {
        // David

        // If Number contains characters that are not valid, GAMMA returns the #VALUE! error value.
        x = H.accept(x, Types.NUMBER);

        // If Number is a negative integer or 0, GAMMA returns the #NUM! error value.
        if (x === 0 || (x < 0 && x === Math.trunc(x))) {
            throw FormulaError.NUM;
        }

        return jStat.gammafn(x);
    },

    'GAMMA.DIST': (x, alpha, beta, cumulative) => {
        // David
        // If x, alpha, or beta is nonnumeric, GAMMA.DIST returns the #VALUE! error value.
        x = H.accept(x, Types.NUMBER);
        alpha = H.accept(alpha, Types.NUMBER);
        beta = H.accept(beta, Types.NUMBER);
        cumulative = H.accept(cumulative, Types.BOOLEAN);

        // If x < 0, GAMMA.DIST returns the #NUM! error value.
        // If alpha ≤ 0 or if beta ≤ 0, GAMMA.DIST returns the #NUM! error value.
        if (x < 0 || alpha <= 0 || beta <= 0) {
            throw FormulaError.NUM;
        }

        return cumulative ? jStat.gamma.cdf(x, alpha, beta, true) : jStat.gamma.pdf(x, alpha, beta, false);
    },

    'GAMMA.INV': (probability, alpha, beta) => {
        // David
        // If any argument is text, GAMMA.INV returns the #VALUE! error value.
        probability = H.accept(probability, Types.NUMBER);
        alpha = H.accept(alpha, Types.NUMBER);
        beta = H.accept(beta, Types.NUMBER);

        // If probability < 0 or probability > 1, GAMMA.INV returns the #NUM! error value.
        // If alpha ≤ 0 or if beta ≤ 0, GAMMA.INV returns the #NUM! error value.
        if (probability < 0 || probability > 1 || alpha <= 0 || beta <= 0) {
            throw FormulaError.NUM;
        }

        return jStat.gamma.inv(probability, alpha, beta);
    },

    GAMMALN: (x) => {
        // David

        x = H.accept(x, Types.NUMBER);
        // If x is nonnumeric, GAMMALN returns the #VALUE! error value.
        // If x ≤ 0, GAMMALN returns the #NUM! error value.
        if (x <= 0) {
            throw FormulaError.NUM;
        }

        return jStat.gammaln(x);
    },

    'GAMMALN.PRECISE': (x) => {
        // David
        // return distribution.GAMMALN(x);
        x = H.accept(x, Types.NUMBER);
        // If x is nonnumeric, GAMMALN returns the #VALUE! error value.
        // If x ≤ 0, GAMMALN returns the #NUM! error value.
        if (x <= 0) {
            throw FormulaError.NUM;
        }

        return jStat.gammaln(x);
    },

    GAUSS: (z) => {
        // David
        // If z is not a valid number, GAUSS returns the #NUM! error value.
        // If z is not a valid data type, GAUSS returns the #VALUE! error value.
        z = H.accept(z, Types.NUMBER);

        return jStat.normal.cdf(z, 0, 1) - 0.5;
    },

    GEOMEAN: (...numbers) => {
        // David
        const filterArr = [];
        // parse number only if the input is literal
        H.flattenParams(numbers, Types.NUMBER, true, (item, info) => {
            if (typeof item === "number") {
                filterArr.push(item);
            }
        });
        return jStat.geomean(filterArr);
    },

    GROWTH: () => {

    },

    HARMEAN: () => {

    },

    'HYPGEOM.DIST': (sample_s, number_sample, population_s, number_pop, cumulative) => {
        //          num_successes, num_draws, successes_in_pop, pop_size
        // If any argument is nonnumeric, HYPGEOM.DIST returns the #VALUE! error value.
        sample_s = H.accept(sample_s, Types.NUMBER);
        number_sample = H.accept(number_sample, Types.NUMBER);
        population_s = H.accept(population_s, Types.NUMBER);
        number_pop = H.accept(number_pop, Types.NUMBER);
        cumulative = H.accept(cumulative, Types.BOOLEAN);

        // All arguments are truncated to integers.
        sample_s = Math.trunc(sample_s);
        number_sample = Math.trunc(number_sample);
        population_s = Math.trunc(population_s);
        number_pop = Math.trunc(number_pop);

        // // If number_pop ≤ 0, HYPGEOM.DIST returns the #NUM! error value.
        if (number_pop <= 0 || sample_s < 0 || number_sample <= 0 || population_s <= 0) {
            throw FormulaError.NUM;
        }

        // // If number_sample ≤ 0 or number_sample > number_population, HYPGEOM.DIST returns the #NUM! error value.
        if (number_sample > number_pop) {
            throw FormulaError.NUM;
        }
        // // If population_s ≤ 0 or population_s > number_population, HYPGEOM.DIST returns the #NUM! error value.
        if (population_s > number_pop) {
            throw FormulaError.NUM;
        }

        // If sample_s < 0 or sample_s is greater than the lesser of number_sample or population_s, HYPGEOM.DIST returns the #NUM! error value.
        // Google and Mircrosoft has different version on this funtion
        if (number_sample < sample_s || population_s < sample_s) {
            throw FormulaError.NUM;
        }
        // If sample_s is less than the larger of 0 or (number_sample - number_population + population_s), HYPGEOM.DIST returns the #NUM! error value.
        if (sample_s < (number_sample - number_pop + population_s)) {
            throw FormulaError.NUM;
        }

        function pdf(x, n, M, N) {
            return MathFunctions.COMBIN(M, x) * MathFunctions.COMBIN(N - M, n - x) / MathFunctions.COMBIN(N, n);
        }

        function cdf(x, n, M, N) {
            let result = 0;
            for (let i = 0; i <= x; i++) {
                result += pdf(i, n, M, N);
            }
            return result;
        }

        return cumulative ? cdf(sample_s, number_sample, population_s, number_pop) : pdf(sample_s, number_sample, population_s, number_pop);
    },

    INTERCEPT: () => {

    },

    KURT: () => {

    },

    LINEST: () => {

    },

    LOGEST: () => {

    },

    'LOGNORM.DIST': (x, mean, standard_dev, cumulative) => {
        // if any argument is nonnumeric, LOGNORM.DIST returns the #VALUE! error value.
        x = H.accept(x, Types.NUMBER);
        mean = H.accept(mean, Types.NUMBER);
        standard_dev = H.accept(standard_dev, Types.NUMBER);
        cumulative = H.accept(x, Types.BOOLEAN);
        // If x ≤ 0 or if standard_dev ≤ 0, LOGNORM.DIST returns the #NUM! error value.
        if (x <= 0 || standard_dev <= 0) {
            throw FormulaError.NUM;
        }

        return cumulative ? jStat.lognormal.cdf(x, mean, standard_dev) : jStat.lognormal.pdf(x, mean, standard_dev);
    },

    'LOGNORM.INV': (probability, mean, standard_dev) => {
        // If any argument is nonnumeric, LOGNORM.INV returns the #VALUE! error value.
        probability = H.accept(probability, Types.NUMBER);
        mean = H.accept(mean, Types.NUMBER);
        standard_dev = H.accept(standard_dev, Types.NUMBER);
        // If probability <= 0 or probability >= 1, LOGNORM.INV returns the #NUM! error value.
        if (probability <= 0 || probability >= 1) {
            throw FormulaError.NUM;
        }
        // If standard_dev <= 0, LOGNORM.INV returns the #NUM! error value.
        if (standard_dev <= 0) {
            throw FormulaError.NUM;
        }

        return jStat.lognormal.inv(probability, mean, standard_dev);
    },

    'MODE.MULT': () => {

    },

    'MODE.SNGL': () => {

    },

    'NEGBINOM.DIST': (number_f, number_s, probability_s, cumulative) => {
        // If any argument is nonnumeric, NEGBINOM.DIST returns the #VALUE! error value.
        number_f = H.accept(number_f, Types.NUMBER);
        number_s = H.accept(number_s, Types.NUMBER);
        probability_s = H.accept(probability_s, Types.NUMBER);
        cumulative = H.accept(cumulative, Types.BOOLEAN);
        // Number_f and number_s are truncated to integers.
        number_f = Math.trunc(number_f);
        number_s = Math.trunc(number_s);

        // If probability_s < 0 or if probability > 1, NEGBINOM.DIST returns the #NUM! error value.
        if (probability_s < 0 || probability_s > 1) {
            throw FormulaError.NUM;
        }
        // If number_f < 0 or number_s < 1, NEGBINOM.DIST returns the #NUM! error value.
        if (number_f < 0 || number_s < 1) {
            throw FormulaError.NUM;
        }

        return cumulative ? jStat.negbin.cdf(number_f, number_s, probability_s) : jStat.negbin.pdf(number_f, number_s, probability_s);
    },

    'NORM.DIST': (x, mean, standard_dev, cumulative) => {
        // If mean or standard_dev is nonnumeric, NORM.DIST returns the #VALUE! error value.
        x = H.accept(x, Types.NUMBER);
        mean = H.accept(mean, Types.NUMBER);
        standard_dev = H.accept(standard_dev, Types.NUMBER);
        cumulative = H.accept(cumulative, Types.BOOLEAN);

        // If standard_dev ≤ 0, NORM.DIST returns the #NUM! error value.
        if (standard_dev <= 0) {
            throw FormulaError.NUM;
        }
        // If mean = 0, standard_dev = 1, and cumulative = TRUE, NORM.DIST returns the standard normal distribution, NORM.S.DIST.
        return cumulative ? jStat.normal.cdf(x, mean, standard_dev) : jStat.normal.pdf(x, mean, standard_dev);

    },

    'NORM.INV': (probability, mean, standard_dev) => {
        // If any argument is nonnumeric, NORM.INV returns the #VALUE! error value.
        probability = H.accept(probability, Types.NUMBER);
        mean = H.accept(mean, Types.NUMBER);
        standard_dev = H.accept(standard_dev, Types.NUMBER);

        // If probability <= 0 or if probability >= 1, NORM.INV returns the #NUM! error value.
        if (probability <= 0 || probability >= 1) {
            throw FormulaError.NUM;
        }
        // If standard_dev ≤ 0, NORM.INV returns the #NUM! error value.
        if (standard_dev <= 0) {
            throw FormulaError.NUM;
        }
        // If mean = 0 and standard_dev = 1, NORM.INV uses the standard normal distribution (see NORMS.INV).
        // if(mean === 0 && standard_dev === 1){
        // }

        return jStat.normal.inv(probability, mean, standard_dev);

    },

    'NORM.S.DIST': (z, cumulative) => {
        // If z is nonnumeric, NORM.S.DIST returns the #VALUE! error value.
        z = H.accept(z, Types.NUMBER);
        cumulative = H.accept(cumulative, Types.BOOLEAN);

        return (cumulative) ? jStat.normal.cdf(z, 0, 1) : jStat.normal.pdf(z, 0, 1);
    },

    'NORM.S.INV': (probability) => {
        // If probability is nonnumeric, NORMS.INV returns the #VALUE! error value.
        probability = H.accept(probability, Types.NUMBER);
        // If probability <= 0 or if probability >= 1, NORMS.INV returns the #NUM! error value.
        if (probability <= 0 || probability >= 1) {
            throw FormulaError.NUM;
        }
        return jStat.normal.inv(probability, 0, 1);
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

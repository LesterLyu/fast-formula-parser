const tests = {

    AVEDEV: {
        'AVEDEV({4,1,6,7,5,4,3})': 1.469387755,
        'AVEDEV({4,1,6,7,5,4,3},(A7,B7),"1")': 1.8,
        'AVEDEV({4,1,6,7,5,4,3,TRUE},(A7,B7),"1")': 1.8,
        'AVEDEV({4,1,6,7,5,4,3,TRUE},(A7,B7),"1",1)': 1.83471074380165,
    },

    AVERAGE: {
        'AVERAGE({TRUE,1,2,"12"}, 3)': 2,
        'AVERAGE((A7, B7), 3)': 2,
        'AVERAGE(TRUE, "3")': 2,
        'AVERAGE(TRUE, "3a")': '#VALUE!',
    },

    AVERAGEA: {
        'AVERAGEA({TRUE,1,2,"12"}, 3)': 1.5,
        'AVERAGEA((A7, B7), 3)': 2,
        'AVERAGEA(TRUE, "3")': 2,
        'AVERAGEA(TRUE, "3a")': '#VALUE!',
        'AVERAGEA({TRUE,1,2,"3",""}, 3, TRUE, "1", 0)': 1,
        'AVERAGEA("", 1)': '#VALUE!'
    },

    AVERAGEIF: {
        // Example 1
        'AVERAGEIF(B8:B11,"<23000")': 14000,
        'AVERAGEIF(A8:A11,"<250000")': 150000,
        'AVERAGEIF(A8:A11,"<95000")': '#DIV/0!',
        'AVERAGEIF(A8:A11,">250000",B8:B11)': 24500,
        // Example 2
        'AVERAGEIF(A12:A16,"=*West",B12:B16)': 16733.5,
        'AVERAGEIF(A12:A16,"<>*(New Office)",B12:B16)': 18589,

        'AVERAGEIF(A17:D17,">0")': 1.5,
    },

    COUNT: {
        'COUNT(A2:A5, 123)': 1,
        'COUNT(A2:A5)': 0,
        'COUNT(A1:E1)': 1,
        'COUNT(A2:E2)': 3,
        'COUNT(A2:E2, A1:E1)': 4,
        'COUNT((A2:E2, A1:E1))': 4,
    },

    COUNTIF: {
        'COUNTIF(A2:A5, "apples")': 2,
        'COUNTIF(A2:A5,A4)': 1,
        'COUNTIF(A2:A5,A2)+COUNTIF(A2:A5,A3)': 3,
        'COUNTIF(B2:B5,">55")': 2,
        'COUNTIF(B2:B5,"<>"&B4)': 3,
        'COUNTIF(B2:B5,">=32")-COUNTIF(B2:B5,">85")': 3,
        'COUNTIF(A2:A5,"*")': 4,
        'COUNTIF(A2:A5,"?????es")': 2,
        'COUNTIF(B1:E1,TRUE)': 2,
        'COUNTIF(B1:E1,"=TRUE")': 2,
        'COUNTIF(B1:E1,"TRUE")': 2,
        'COUNTIF(B1:E1,"TRUE1")': 1,
        'COUNTIF(B1:E1,"=TRUE1")': 1,
        'COUNTIF(B1:E1, {1,3,4})': 1,
        'COUNTIF(C2:E2, "{1,2}")': 1,
        'COUNTIF(C2:E2, "={1,2}")': 1,
        'COUNTIF(C2:E2, {1,2})': 0,
    },

};

const distributions = {
    'BETA.DIST': {
        'BETA.DIST(2,8,10,TRUE,1,3)': 0.6854705810547,
        'BETA.DIST(2,8,10,FALSE,1,3)': 1.4837646484375,
        'BETA.DIST(6,8,10,FALSE,1,7)': 0.0008976224783,
    },

    'BETA.INV': {
        'BETA.INV(0.6854705810547,8,10,1,3)': 2,
    },

    'BINOM.DIST': {
        'BINOM.DIST(6,10,0.5,FALSE)': 0.2050781250000,
        'BINOM.DIST(6,10,0.5,TRUE)': 0.8281250000000,
    },

    'BINOM.DIST.RANGE': {
        'BINOM.DIST.RANGE(60,0.75,48)': 0.0839749674290,
        'BINOM.DIST.RANGE(60,0.75,45,50)': 0.5236297934719,
    },

    'BINOM.INV': {
        'BINOM.INV(6, 0.6, 0.75)': 4,
    },

    'CHISQ.DIST': {
        'CHISQ.DIST(0.5,1,TRUE)': 0.5204998778130,
        'CHISQ.DIST(2,3,FALSE)': 0.2075537487103,
    },

    'CHISQ.DIST.RT': {
        'CHISQ.DIST.RT(18.307,10)': 0.0500005890914,
    },

    'CHISQ.INV': {
        'CHISQ.INV(0.93,1)': 3.2830202867595,
        'CHISQ.INV(0.6,2)': 1.8325814637483,
    },

    'CHISQ.INV.RT': {
        'CHISQ.INV.RT(0.050001,10)': 18.3069734569611,
        'CHISQ.INV.RT(0.6,2)': 1.0216512475320,
    },

    'CHISQ.TEST': {
        'CHISQ.TEST({58,35;11,25;10,23},{43.35,47.65;17.56,18.44;16.09,0})': '#DIV/0!',
        'CHISQ.TEST({58,35;11,25;10,23},{43.35,47.65;17.56,18.44;16.09,16.91})': 0.0001513457663,
        'CHISQ.TEST({58,35;11,25;10,23},{43.35,47.65;17.56,18.44;16.09,"16.91"})': 0.000453139,
    },

    'CONFIDENCE.NORM': {
        'CONFIDENCE.NORM(0.05,2.5,50)': 0.6929519121748,
    },

    'CONFIDENCE.T': {
        'CONFIDENCE.T(0.05,1,50)': 0.2841968554957,
    },

    'CORREL': {
        'CORREL({3,2,4,5,6},{9,7,12,15,17})': 0.99705448550158,
        'CORREL({3,2,4,5,6},{9,7,12,15,"17"})': 0.9959100033105,
    },

    'COVARIANCE.P': {
        'COVARIANCE.P({3,2,4,5,6},{9,7,12,15,17})': 5.2,
        'COVARIANCE.P({3,2,4,5,6},{9,7,12,15,"17"})': 3.375,
    },

    'COVARIANCE.S': {
        'COVARIANCE.S(3,9)': '#DIV/0!',
        'COVARIANCE.S({2,4,8},{5,11,12})': 9.666666666667,
        'COVARIANCE.S({3,2,4,5,6},{9,7,12,15,17})': 6.5,
        'COVARIANCE.S({3,2,4,5,6},{9,7,12,15,"17"})': 4.5,
    },

    'DEVSQ': {
        'DEVSQ(1,2,3)': 2,
        'DEVSQ(1,"2",{1,2},1)': 1.2,
        'DEVSQ(1,"2",{1,2,"2"},1,TRUE)': 1.3333333333,
    },

    'EXPON.DIST': {
        'EXPON.DIST(0.2,10,TRUE)': 0.864664716763387,
        'EXPON.DIST(0.2,10,FALSE)': 1.353352832366130,
        'EXPON.DIST(0.-2,10,FALSE)': '#NUM!',
        'EXPON.DIST(0.2,-10,FALSE)': '#NUM!',
        'EXPON.DIST(0.2,0.0,FALSE)': '#NUM!',
    },

    // David
    'F.DIST': {
        'F.DIST(15,6,4,TRUE)': 0.989741952394019000,
        'F.DIST(15,6.1,4,TRUE)': 0.989741952394019000,
        'F.DIST(15,6.9,4.8,TRUE)': 0.989741952394019000,
        'F.DIST(15,6,4,FALSE)': 0.001271447,
        'F.DIST(-0.5,6,4,TRUE)': '#NUM!',
        'F.DIST(15.6,0.9,4,TRUE)': '#NUM!',
        'F.DIST(15.6,6,0.4,TRUE)': '#NUM!',
    },

    'F.DIST.RT': {
        'F.DIST.RT(15.2068649, 6, 4)': 0.01,
        'F.DIST.RT(15.2068649, 6.5, 4)': 0.01,
        'F.DIST.RT(15.2068649, 6, 4.4)': 0.01,
        'F.DIST.RT(-0.5, 6, 4)': '#NUM!',
        'F.DIST.RT(15.6, 0.9, 4)': '#NUM!',
        'F.DIST.RT(15.6, 6, 0.4)': '#NUM!',
    },

    'F.INV': {
        'F.INV(0.01,  6,  4)': 0.109309914,
        'F.INV(0.01,  6.9,  4.9)': 0.109309914,
        'F.INV(-0.01,  6,  4)': '#NUM!',
        'F.INV(1.01,  6,  4)': '#NUM!',
        'F.INV(1.01,  0.6,  4)': '#NUM!',
        'F.INV(0.01,  6,  0.4)': '#NUM!',
        'F.INV(1.01,  -6,  -4)': '#NUM!',
    },
    'F.INV.RT': {
        'F.INV.RT(0.01, 6, 4)': 15.20686486,
        'F.INV.RT(0.01, 6.9, 4.8)': 15.20686486,
        'F.INV.RT(-0.01, 6.9, 4.8)': '#NUM!',
        'F.INV.RT(1.01, 6.9, 4.8)': '#NUM!',
        'F.INV.RT(0.01, 0.9, 4)': '#NUM!',
        'F.INV.RT(0.01, 6.9, 0.4)': '#NUM!',
        'F.INV.RT(0.01, 1000000000000, 4)': '#NUM!',
        'F.INV.RT(0.01, 6.9, 1000000000000)': '#NUM!',
    },

    'F.TEST': {
        'F.TEST({6,7,9,15,21}, {20,1})': 0.200507085811744,
        'F.TEST({6,7,9,15,21}, {20,28,31,38,40})': 0.648317846786174,
        'F.TEST({6,7,9,15,21}, {20,28,31,38,"40"})': 0.732034211877256,
        'F.TEST({6}, {20})': '#DIV/0!'
    },

    FISHER: {
        'FISHER(0.75)': 0.97295507452765700,
        'FISHER(0.5)': 0.54930614433405500,
        'FISHER(-1.1)': '#NUM!',
        'FISHER(1.1)': '#NUM!'
    },

    FISHERINV: {
        'FISHERINV(0.972955)': 0.749999967,
        'FISHERINV("string")': '#VALUE!',
    },

    FORECAST: {
        'FORECAST(30,{6,7,9,15,21},{20,28,31,38,40})': 10.60725308642,
        'FORECAST(30,{6,6},{2,"1"})': '#DIV/0!',
        'FORECAST(30,{6,6,4},{2,1,3})': -22.66666666667,
        'FORECAST(30,{6,6,4},{2,1})': '#N/A',
    },

    // 'FORECAST.ETS': {},
    //
    // 'FORECAST.ETS.CONFINT': {},
    //
    // 'FORECAST.ETS.SEASONALITY': {},
    //
    // 'FORECAST.ETS.STAT': {},

    'FORECAST.LINEAR': {
        'FORECAST.LINEAR(30,{6,7,9,15,21},{20,28,31,38,40})': 10.60725308642,
        'FORECAST.LINEAR(30,{6,6},{2,"1"})': '#DIV/0!',
        'FORECAST.LINEAR(30,{6,6,4},{2,1,3})': -22.66666666667,
        'FORECAST.LINEAR(30,{6,6,4},{2,1})': '#N/A',
    },

    FREQUENCY: {
        'FREQUENCY({1,2,3,4,5},{1,5,11})': 1,
        'FREQUENCY({1,2,3,4,5},{5,1,11})': 1,
        'FREQUENCY({1,2,3,4,5},{2,3})': 2,
        'FREQUENCY({1,2,3,4,5},A1)': 5,
    },

    // David
    GAMMA: {
        'GAMMA(2.5)': 1.329340388,
        // 'GAMMA(-3.75)': 0.267866128861417,  // Error: precise problem
        'GAMMA(-2.5)': -0.94530872048,
        'GAMMA(0)': '#NUM!',
        'GAMMA(-2)': '#NUM!',
    },

    'GAMMA.DIST': {
        'GAMMA.DIST(-10.00001131, 9, 2, FALSE)': '#NUM!',
        'GAMMA.DIST(10.00001131, -9, 2, TRUE)': '#NUM!',
        'GAMMA.DIST(10.00001131, 9, -2, FALSE)': '#NUM!',
        'GAMMA.DIST(10.00001131, 9, 2, TRUE)': 0.068094004,
        'GAMMA.DIST(10.00001131, 9, 2, FALSE)': 0.03263913,
    },

    'GAMMA.INV': {
        'GAMMA.INV(0.068094,9,2)': 10.00001119,
        'GAMMA.INV(-0.1,9,2)': '#NUM!',
        'GAMMA.INV(11.1,9,2)': '#NUM!',
        'GAMMA.INV(0.5,-0.9,2)': '#NUM!',
        'GAMMA.INV(0.5,9,-0.2)': '#NUM!',
    },

    GAMMALN: {
        'GAMMALN(4)': 1.791759469,
        'GAMMALN("string")': '#VALUE!',
        'GAMMALN(-4)': '#NUM!',
    },

    'GAMMALN.PRECISE': {
        'GAMMALN.PRECISE(4)': 1.791759469,
        'GAMMALN.PRECISE("string")': '#VALUE!',
        'GAMMALN.PRECISE(-4)': '#NUM!',
    },
    GAUSS: {
        'GAUSS(2)': 0.477249868,
        'GAUSS("string")': '#VALUE!',
    },

    GEOMEAN: {
        'GEOMEAN({2, 2})': 2.0,
        'GEOMEAN({2, 2, "string"})': 2.0,
        'GEOMEAN({4,5,8,7,11,4,3})': 5.47698696965696,
    },

    GROWTH: {
        'GROWTH({33100,47300,69000,102000,150000,220000})': 32618.2037735398,
        'GROWTH({33100,47300,69000,102000,150000,"220000"})': '#VALUE!',
        'GROWTH({33100,47300,69000,102000,150000,220000}, {11,12,13,14,15})': '#REF!',
        'GROWTH({33100,47300,69000,102000,150000,220000}, {11,12,13,14,15,16})': 32618.2037735398,
        'SUM(GROWTH({33100,47300,69000,102000,150000,220000}, {11,12,13,14,15,16}))': 620750.363577979,
        'GROWTH({33100,47300,69000,102000,150000,220000}, {11,12,13,14,15,16},{1;2})': 724.76739866295,
        'SUM(GROWTH({33100,47300,69000,102000,150000,220000}, {11,12,13,14,15,16},{1;2}))': 1785.301869179600,
        'SUM(GROWTH({1,2,3,4},{4,6,8,11},{8,9,10,11}))': 13.9796233554563,
    },

    HARMEAN: {
        'HARMEAN(4,5,8,7,11,4,3)': 5.02837596206,
        'HARMEAN(4,"5",{8,7,11,4,3})': 5.02837596206,
    },

    'HYPGEOM.DIST': {
        // 'HYPGEOM.DIST': (sample_s, number_sample, population_s, number_pop, cumulative)
        'HYPGEOM.DIST(1,4,8,20,TRUE)': 0.465428276574,
        'HYPGEOM.DIST(1,4,8,20,FALSE)': 0.363261093911,
        // if ( sample_s < 0  || number_sample <= 0 || population_s <= 0 || number_pop <= 0 )
        'HYPGEOM.DIST(0,4,8,20,TRUE)': 0.102167183,
        'HYPGEOM.DIST(-1,4,8,20,TRUE)': '#NUM!',
        'HYPGEOM.DIST(1,0.0,8,20,TRUE)': '#NUM!',
        'HYPGEOM.DIST(1,-4,8,20,TRUE)': '#NUM!',
        'HYPGEOM.DIST(1,4,0,20,TRUE)': '#NUM!',
        'HYPGEOM.DIST(1,4,-8,20,TRUE)': '#NUM!',
        'HYPGEOM.DIST(1,4,8,0.0,TRUE)': '#NUM!',
        'HYPGEOM.DIST(1,4,8,-20,TRUE)': '#NUM!',

        // if (number_sample > number_pop)
        'HYPGEOM.DIST(1,21,8,20,TRUE)': '#NUM!',

        // if (population_s > number_pop)
        'HYPGEOM.DIST(1,4,8,7,TRUE)': '#NUM!',

        // If sample_s is less than the larger of 0 or (number_sample - number_population + population_s), HYPGEOM.DIST returns the #NUM! error value.
        'HYPGEOM.DIST(1,4,8,10,FALSE)': '#NUM!',

        // if (number_sample < sample_s || population_s < sample_s)
        'HYPGEOM.DIST(5,4,8,20,TRUE)': '#NUM!',
        'HYPGEOM.DIST(9,15,8,20,TRUE)': '#NUM!',
        'HYPGEOM.DIST(8,15,8,14,TRUE)': '#NUM!',
        'HYPGEOM.DIST(1,8,8,7,FALSE)': '#NUM!',
        'HYPGEOM.DIST(1,4,21,20,FALSE)': '#NUM!',

    },

    INTERCEPT: {
        'INTERCEPT({2,3,9,1,8},{6,5,11,7,5})': 0.04838709677,
    },

    KURT: {
        'KURT(3,4,5,2,3,4,5,6,4,7)': -0.151799637208,
        'KURT(3,{4,5},"2",3,4,5,6,4,7)': -0.151799637208,
    },

    LINEST: {},

    LOGEST: {},

    'LOGNORM.DIST': {
        'LOGNORM.DIST(4,3.5,1.2,TRUE)': 0.0390835557068,
        'LOGNORM.DIST(4,3.5,1.2,FALSE)': 0.0176175966818,
        'LOGNORM.DIST(-4,3.5,1.2,TRUE)': '#NUM!',
        'LOGNORM.DIST(4,3.5,-1.2,TRUE)': '#NUM!',
    },

    'LOGNORM.INV': {
        'LOGNORM.INV(0.039084, 3.5, 1.2)': 4.0000252186806,
        'LOGNORM.INV(-0.039084, 3.5, 1.2)': '#NUM!',
        'LOGNORM.INV( 1.039084, 3.5, 1.2)': '#NUM!',
        'LOGNORM.INV(0.039084, 3.5, -1.2)': '#NUM!',
    },

    'MODE.MULT': {},

    'MODE.SNGL': {},

    'NEGBINOM.DIST': {
        // number_f, number_s,probability_s,cumulative
        'NEGBINOM.DIST(10, 5, 0.25,TRUE)': 0.3135140584782,
        'NEGBINOM.DIST(10, 5, 0.25,FALSE)': 0.0550486603752,
        'NEGBINOM.DIST(10, 5, -0.25,FALSE)': '#NUM!',
        'NEGBINOM.DIST(10, 5, 1.25,FALSE)': '#NUM!',
        'NEGBINOM.DIST(-10, 5, 0.25,FALSE)': '#NUM!',
        'NEGBINOM.DIST(10, 0.5, 0.25,FALSE)': '#NUM!',
    },

    'NORM.DIST': {
        'NORM.DIST(42, 40, 1.5, TRUE)': 0.90878878,
        'NORM.DIST(42, 40, 1.5, FALSE)': 0.10934005,
        'NORM.DIST(1.333333, 0, 1, TRUE)': 0.908788726, // the same to NORM.S.DIST
        'NORM.DIST(42, 40, 0, TRUE)': '#NUM!',
        'NORM.DIST(42, 40, -1.1, TRUE)': '#NUM!',
    },

    'NORM.INV': {
        'NORM.INV(0.908789, 40, 1.5)': 42.00000201,
        'NORM.INV(0.908789, 0, 1)': 1.333334673,  // the same to NORM.S.INV
        'NORM.INV(-1.0, 40, 1.5)': '#NUM!',
        'NORM.INV(0.0, 40, 1.5)': '#NUM!',
        'NORM.INV(1.1, 40, 1.5)': '#NUM!',
        'NORM.INV(1.0, 40, 1.5)': '#NUM!',
        'NORM.INV(0.9, 40, -1.5)': '#NUM!',
        'NORM.INV(0.9, 40, 0.0)': '#NUM!',
    },

    'NORM.S.DIST': {
        'NORM.S.DIST(1.333333,TRUE)': 0.908788726,
        'NORM.S.DIST(1.333333,FALSE)': 0.164010148,
    },

    'NORM.S.INV': {
        'NORM.S.INV(0.908789)': 1.333334673,
        'NORM.S.INV(-1)': '#NUM!',
        'NORM.S.INV(0)': '#NUM!',
        'NORM.S.INV(1)': '#NUM!',
        'NORM.S.INV(1.1)': '#NUM!',
    },

    PEARSON: {},

    'PERCENTILE.EXC': {},

    'PERCENTILE.INC': {},

    'PERCENTRANK.EXC': {},

    'PERCENTRANK.INC': {},

    PERMUTATIONA: {},

    PHI: {},

    'POISSON.DIST': {},

    'PROB': {},

    'QUARTILE.EXC': {},

    'QUARTILE.INC': {},

    'RANK.AVG': {},

    'RANK.EQ': {},

    RSQ: {},

    SKEW: {},

    'SKEW.P': {},

    SLOPE: {},

    STANDARDIZE: {},

    'STDEV.P': {},

    'STDEV.S': {},

    STDEVA: {},

    STDEVPA: {},

    STEYX: {},

    'T.DIST': {},

    'T.DIST.2T': {},

    'T.DIST.RT': {},

    'T.INV': {},

    'T.INV.2T': {},

    'T.TEST': {},

    TREND: {},

    TRIMMEAN: {},

    'VAR.P': {},

    'VAR.S': {},

    'VARA': {},

    'VARPA': {},

    'WEIBULL.DIST': {},

    'Z.TEST': {}


};

module.exports = Object.assign(distributions, tests);

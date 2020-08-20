const FormulaError = require('./error');
const Collection = require('../grammar/type/collection');

const Types = {
    NUMBER: 0,
    ARRAY: 1,
    BOOLEAN: 2,
    STRING: 3,
    RANGE_REF: 4, // can be 'A:C' or '1:4', not only 'A1:C3'
    CELL_REF: 5,
    COLLECTIONS: 6, // Unions of references
    NUMBER_NO_BOOLEAN: 10,
};

const Factorials = [1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880, 3628800, 39916800, 479001600, 6227020800, 87178291200, 1307674368000, 20922789888000, 355687428096000, 6402373705728000, 121645100408832000, 2432902008176640000, 51090942171709440000, 1124000727777607680000, 25852016738884976640000, 620448401733239439360000, 15511210043330985984000000, 403291461126605635584000000, 10888869450418352160768000000, 304888344611713860501504000000, 8841761993739701954543616000000, 265252859812191058636308480000000, 8222838654177922817725562880000000, 263130836933693530167218012160000000, 8683317618811886495518194401280000000, 295232799039604140847618609643520000000, 10333147966386144929666651337523200000000, 371993326789901217467999448150835200000000, 13763753091226345046315979581580902400000000, 523022617466601111760007224100074291200000000, 20397882081197443358640281739902897356800000000, 815915283247897734345611269596115894272000000000, 33452526613163807108170062053440751665152000000000, 1405006117752879898543142606244511569936384000000000, 60415263063373835637355132068513997507264512000000000, 2658271574788448768043625811014615890319638528000000000, 119622220865480194561963161495657715064383733760000000000, 5502622159812088949850305428800254892961651752960000000000, 258623241511168180642964355153611979969197632389120000000000, 12413915592536072670862289047373375038521486354677760000000000, 608281864034267560872252163321295376887552831379210240000000000, 30414093201713378043612608166064768844377641568960512000000000000, 1551118753287382280224243016469303211063259720016986112000000000000, 80658175170943878571660636856403766975289505440883277824000000000000, 4274883284060025564298013753389399649690343788366813724672000000000000, 230843697339241380472092742683027581083278564571807941132288000000000000, 12696403353658275925965100847566516959580321051449436762275840000000000000, 710998587804863451854045647463724949736497978881168458687447040000000000000, 40526919504877216755680601905432322134980384796226602145184481280000000000000, 2350561331282878571829474910515074683828862318181142924420699914240000000000000, 138683118545689835737939019720389406345902876772687432540821294940160000000000000, 8320987112741390144276341183223364380754172606361245952449277696409600000000000000, 507580213877224798800856812176625227226004528988036003099405939480985600000000000000, 31469973260387937525653122354950764088012280797258232192163168247821107200000000000000, 1982608315404440064116146708361898137544773690227268628106279599612729753600000000000000, 126886932185884164103433389335161480802865516174545192198801894375214704230400000000000000, 8247650592082470666723170306785496252186258551345437492922123134388955774976000000000000000, 544344939077443064003729240247842752644293064388798874532860126869671081148416000000000000000, 36471110918188685288249859096605464427167635314049524593701628500267962436943872000000000000000, 2480035542436830599600990418569171581047399201355367672371710738018221445712183296000000000000000, 171122452428141311372468338881272839092270544893520369393648040923257279754140647424000000000000000, 11978571669969891796072783721689098736458938142546425857555362864628009582789845319680000000000000000, 850478588567862317521167644239926010288584608120796235886430763388588680378079017697280000000000000000, 61234458376886086861524070385274672740778091784697328983823014963978384987221689274204160000000000000000, 4470115461512684340891257138125051110076800700282905015819080092370422104067183317016903680000000000000000, 330788544151938641225953028221253782145683251820934971170611926835411235700971565459250872320000000000000000, 24809140811395398091946477116594033660926243886570122837795894512655842677572867409443815424000000000000000000, 1885494701666050254987932260861146558230394535379329335672487982961844043495537923117729972224000000000000000000, 145183092028285869634070784086308284983740379224208358846781574688061991349156420080065207861248000000000000000000, 11324281178206297831457521158732046228731749579488251990048962825668835325234200766245086213177344000000000000000000, 894618213078297528685144171539831652069808216779571907213868063227837990693501860533361810841010176000000000000000000, 71569457046263802294811533723186532165584657342365752577109445058227039255480148842668944867280814080000000000000000000, 5797126020747367985879734231578109105412357244731625958745865049716390179693892056256184534249745940480000000000000000000, 475364333701284174842138206989404946643813294067993328617160934076743994734899148613007131808479167119360000000000000000000, 39455239697206586511897471180120610571436503407643446275224357528369751562996629334879591940103770870906880000000000000000000, 3314240134565353266999387579130131288000666286242049487118846032383059131291716864129885722968716753156177920000000000000000000, 281710411438055027694947944226061159480056634330574206405101912752560026159795933451040286452340924018275123200000000000000000000, 24227095383672732381765523203441259715284870552429381750838764496720162249742450276789464634901319465571660595200000000000000000000, 2107757298379527717213600518699389595229783738061356212322972511214654115727593174080683423236414793504734471782400000000000000000000, 185482642257398439114796845645546284380220968949399346684421580986889562184028199319100141244804501828416633516851200000000000000000000, 16507955160908461081216919262453619309839666236496541854913520707833171034378509739399912570787600662729080382999756800000000000000000000, 1485715964481761497309522733620825737885569961284688766942216863704985393094065876545992131370884059645617234469978112000000000000000000000, 135200152767840296255166568759495142147586866476906677791741734597153670771559994765685283954750449427751168336768008192000000000000000000000, 12438414054641307255475324325873553077577991715875414356840239582938137710983519518443046123837041347353107486982656753664000000000000000000000, 1156772507081641574759205162306240436214753229576413535186142281213246807121467315215203289516844845303838996289387078090752000000000000000000000, 108736615665674308027365285256786601004186803580182872307497374434045199869417927630229109214583415458560865651202385340530688000000000000000000000, 10329978488239059262599702099394727095397746340117372869212250571234293987594703124871765375385424468563282236864226607350415360000000000000000000000, 991677934870949689209571401541893801158183648651267795444376054838492222809091499987689476037000748982075094738965754305639874560000000000000000000000, 96192759682482119853328425949563698712343813919172976158104477319333745612481875498805879175589072651261284189679678167647067832320000000000000000000000, 9426890448883247745626185743057242473809693764078951663494238777294707070023223798882976159207729119823605850588608460429412647567360000000000000000000000, 933262154439441526816992388562667004907159682643816214685929638952175999932299156089414639761565182862536979208272237582511852109168640000000000000000000000, 93326215443944152681699238856266700490715968264381621468592963895217599993229915608941463976156518286253697920827223758251185210916864000000000000000000000000];

const ReversedTypes = {};
Object.keys(Types).forEach((key) => {
    ReversedTypes[Types[key]] = key;
});

/**
 * Formula helpers.
 */
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

    checkFunctionResult(result) {
        const type = typeof result;
        // number
        if (type === 'number') {
            if (isNaN(result)) {
                return FormulaError.VALUE;
            } else if (!isFinite(result)) {
                return FormulaError.NUM;
            }
        }
        if (result === undefined || result === null)
            return FormulaError.NULL;
        return result;
    }

    /**
     * Flatten an array
     * @param {Array} arr1
     * @returns {*}
     */
    flattenDeep(arr1) {
        return arr1.reduce((acc, val) => Array.isArray(val) ? acc.concat(this.flattenDeep(val)) : acc.concat(val), []);
    }

    /**
     *
     * @param obj
     * @param isArray - if it is an array: [1,2,3], will extract the first element
     * @param allowBoolean - Allow parse boolean into number
     * @returns {number|FormulaError}
     */
    acceptNumber(obj, isArray = true, allowBoolean = true) {
        // check error
        if (obj instanceof FormulaError)
            return obj;
        let number;

        if (typeof obj === 'number')
            number = obj;
        // TRUE -> 1, FALSE -> 0
        else if (typeof obj === 'boolean') {
            if (allowBoolean) {
                number = Number(obj);
            } else {
                throw FormulaError.VALUE;
            }
        }
        // "123" -> 123
        else if (typeof obj === 'string') {
            if (obj.length === 0) {
                throw FormulaError.VALUE;
            }
            number = Number(obj);
            // Note: the unique never-equal-to-itself characteristic of NaN
            if (number !== number) {
                throw FormulaError.VALUE;
            }
        } else if (Array.isArray(obj)) {
            if (!isArray) {
                // for range ref, only allow single column range ref
                if (obj[0].length === 1) {
                    number = this.acceptNumber(obj[0][0]);
                } else {
                    throw FormulaError.VALUE;
                }
            } else {
                number = this.acceptNumber(obj[0][0]);
            }

        } else {
            throw Error('Unknown type in FormulaHelpers.acceptNumber')
        }
        return number;
    }

    /**
     * Flatten parameters to 1D array.
     * @see {@link FormulaHelpers.accept}
     * @param {Array} params - Parameter that needs to flatten.
     * @param {Types|null} valueType - The type each item should be,
     *                          null if allows any type. This only applies to literals.
     * @param {boolean} allowUnion - Allow union, e.g. (A1:C1, E4:F3)
     * @param {function} hook - Invoked after parsing each item.
     *                         of the array.
     * @param {*} [defValue=null] - The value if an param is omitted. i.e. SUM(1,2,,,,,)
     * @param {number} [minSize=1] - The minimum size of the parameters
     */
    flattenParams(params, valueType, allowUnion, hook, defValue = null, minSize = 1) {
        if (params.length < minSize)
            throw FormulaError.ARG_MISSING([valueType]);
        if (defValue == null) {
            defValue = valueType === Types.NUMBER ? 0 : valueType == null ? null : '';
        }
        params.forEach(param => {
            const {isCellRef, isRangeRef, isArray} = param;
            const isUnion = param.value instanceof Collection;
            const isLiteral = !isCellRef && !isRangeRef && !isArray && !isUnion;
            const info = {isLiteral, isCellRef, isRangeRef, isArray, isUnion};

            // single element
            if (isLiteral) {
                if (param.omitted)
                    param = defValue;
                else
                    param = this.accept(param, valueType, defValue);
                hook(param, info);
            }
            // cell reference of single range reference (A1:A1)
            else if (isCellRef) {
                hook(param.value, info);
            }
            // union
            else if (isUnion) {
                if (!allowUnion) throw FormulaError.VALUE;
                param = param.value.data;
                param = this.flattenDeep(param);
                param.forEach(item => {
                    hook(item, info);
                })
            } else if (isRangeRef || isArray) {
                param = this.flattenDeep(param.value);
                param.forEach(item => {
                    hook(item, info);
                })
            }
        });
    }

    /**
     * Check if the param valid, return the parsed param.
     * If type is not given, return the un-parsed param.
     * @param {*} param
     * @param {number|null} [type] - The expected type
     *           NUMBER: Expect a single number,
     *           ARRAY: Expect an flatten array,
     *           BOOLEAN: Expect a single boolean,
     *           STRING: Expect a single string,
     *           COLLECTIONS: Expect an Array of the above types
     *           null: Do not parse the value, return it directly.
     *           The collection is not a flatted array.
     * @param {*} [defValue] - Default value if the param is not given.
     *               if undefined, this param is required, a Error will throw if not given.
     *               if null, and param is undefined, null will be returned.
     * @param {boolean} [flat=true] - If the array should be flattened,
     *                      only applicable when type is ARRAY.
     *                      If false, collection is disallowed.
     * @param {boolean} allowSingleValue - If pack single value into 2d array,
     *                     only applicable when type is ARRAY.
     * @return {string|number|boolean|{}|Array}
     */
    accept(param, type = null, defValue, flat = true, allowSingleValue = false) {
        // TODO: remove this array check
        if (Array.isArray(type))
            type = type[0];
        if (param == null && defValue === undefined) {
            throw FormulaError.ARG_MISSING([type]);
        } else if (param == null)
            return defValue;

        if (typeof param !== "object" || Array.isArray(param))
            return param;

        const isArray = param.isArray;
        if (param.value != null) param = param.value;

        // return an un-parsed type.
        if (type == null)
            return param;

        if (param instanceof FormulaError)
            throw param;

        if (type === Types.ARRAY) {
            if (Array.isArray(param)) {
                return flat ? this.flattenDeep(param) : param;
            } else if (param instanceof Collection) {
                throw FormulaError.VALUE;
            } else if (allowSingleValue) {
                return flat ? [param] : [[param]];
            }
            throw FormulaError.VALUE;
        } else if (type === Types.COLLECTIONS) {
            return param;
        }

        // the only possible type for expectSingle=true are: string, boolean, number;
        // If array encountered, extract the first element.
        // extract first element from array
        if (isArray) {
            param = param[0][0];
        }
        const paramType = this.type(param);
        if (type === Types.STRING) {
            if (paramType === Types.BOOLEAN)
                param = param ? 'TRUE' : 'FALSE';
            else
                param = `${param}`
        } else if (type === Types.BOOLEAN) {
            if (paramType === Types.STRING)
                throw FormulaError.VALUE;
            if (paramType === Types.NUMBER)
                param = Boolean(param);
        } else if (type === Types.NUMBER) {
            param = this.acceptNumber(param, false);
        } else if (type === Types.NUMBER_NO_BOOLEAN) {
            param = this.acceptNumber(param, false, false);
        } else {
            throw FormulaError.VALUE;
        }
        return param;
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
            } else if (variable instanceof Collection)
                type = Types.COLLECTIONS;
        }
        return type;
    }

    isRangeRef(param) {
        return param.ref && param.ref.from;
    }

    isCellRef(param) {
        return param.ref && !param.ref.from;
    }

    /**
     * Helper function for SUMIF, AVERAGEIF,...
     * @param context
     * @param range1
     * @param range2
     */
    retrieveRanges(context, range1, range2) {
        // process args
        range2 = Address.extend(range1, range2);

        // retrieve values
        range1 = this.retrieveArg(context, range1);
        range1 = H.accept(range1, Types.ARRAY, undefined, false, true);

        if (range2 !== range1) {
            range2 = this.retrieveArg(context, range2);
            range2 = H.accept(range2, Types.ARRAY, undefined, false, true);
        } else
            range2 = range1;

        return [range1, range2];
    }

    retrieveArg(context, arg) {
        if (arg === null)
            return {value: 0, isArray: false, omitted: true};
        const res = context.utils.extractRefValue(arg);
        return {value: res.val, isArray: res.isArray, ref: arg.ref};
    }
}

const H = new FormulaHelpers();

const WildCard = {
    /**
     * @param {string|*} obj
     * @returns {*}
     */
    isWildCard: obj => {
        if (typeof obj === "string")
            return /[*?]/.test(obj);
        return false;
    },

    toRegex: (lookupText, flags) => {
        return RegExp(lookupText.replace(/[.+^${}()|[\]\\]/g, '\\$&') // escape the special char for js regex
            .replace(/([^~]??)[?]/g, '$1.') // ? => .
            .replace(/([^~]??)[*]/g, '$1.*') // * => .*
            .replace(/~([?*])/g, '$1'), flags); // ~* => * and ~? => ?
    }
};

const Criteria = {
    /**
     * Parse criteria, support comparison and wild card match.
     * @param {string|number} criteria
     * @return {{op: string, value: string|number|boolean|RegExp, match: boolean|undefined}} - The parsed criteria.
     */
    parse: (criteria) => {
        const type = typeof criteria;
        if (type === "string") {
            // criteria = 'TRUE' or 'FALSE'
            const upper = criteria.toUpperCase();
            if (upper === 'TRUE' || upper === 'FALSE') {
                // excel boolean
                return {op: '=', value: upper === 'TRUE'};
            }

            const res = criteria.match(/(<>|>=|<=|>|<|=)(.*)/);
            // is comparison
            if (res) {
                // [">10", ">", "10", index: 0, input: ">10", groups: undefined]
                let op = res[1], value;

                // string or boolean or error
                if (isNaN(res[2])) {
                    const upper = res[2].toUpperCase();
                    if (upper === 'TRUE' || upper === 'FALSE') {
                        // excel boolean
                        value = upper === 'TRUE';
                    } else if (/#NULL!|#DIV\/0!|#VALUE!|#NAME\?|#NUM!|#N\/A|#REF!/.test(res[2])) {
                        // formula error
                        value = new FormulaError(res[2]);
                    } else {
                        // string, can be wildcard
                        value = res[2];
                        if (WildCard.isWildCard(value)) {
                            return {op: 'wc', value: WildCard.toRegex(value), match: op === '='}
                        }
                    }
                } else {
                    // number
                    value = Number(res[2])
                }
                return {op, value};

            } else if (WildCard.isWildCard(criteria)) {
                return {op: 'wc', value: WildCard.toRegex(criteria), match: true}
            } else {
                return {op: '=', value: criteria}
            }
        } else if (type === "boolean" || type === 'number' || (Array.isArray(criteria)
            || criteria instanceof FormulaError)) {
            return {op: '=', value: criteria}
        } else {
            throw Error(`Criteria.parse: type ${typeof criteria} not support`)
        }
    }
};

const Address = {

    columnNumberToName: (number) => {
        let dividend = number;
        let name = '';
        let modulo = 0;

        while (dividend > 0) {
            modulo = (dividend - 1) % 26;
            name = String.fromCharCode('A'.charCodeAt(0) + modulo) + name;
            dividend = Math.floor((dividend - modulo) / 26);
        }

        return name;
    },

    columnNameToNumber: (columnName) => {
        columnName = columnName.toUpperCase();
        const len = columnName.length;
        let number = 0;
        for (let i = 0; i < len; i++) {
            const code = columnName.charCodeAt(i);
            if (!isNaN(code)) {
                number += (code - 64) * 26 ** (len - i - 1)
            }
        }
        return number;
    },

    /**
     * Extend range2 to match with the dimension in range1.
     * @param {{ref: {}}} range1
     * @param {{ref: {}}} [range2]
     */
    extend: (range1, range2) => {
        if (range2 == null) {
            return range1;
        }
        let rowOffset, colOffset;
        if (H.isCellRef(range1)) {
            rowOffset = 0;
            colOffset = 0;
        } else if (H.isRangeRef(range1)) {
            rowOffset = range1.ref.to.row - range1.ref.from.row;
            colOffset = range1.ref.to.col - range1.ref.from.col;
        } else throw Error('Address.extend should not reach here.');
        // if range2 is a cell reference
        if (H.isCellRef(range2)) {
            if (rowOffset > 0 || colOffset > 0)
                range2 = {
                    ref: {
                        from: {col: range2.ref.col, row: range2.ref.row},
                        to: {row: range2.ref.row + rowOffset, col: range2.ref.col + colOffset}
                    }
                };
        } else {
            // range2 is a range reference
            range2.ref.to.row = range2.ref.from.row + rowOffset;
            range2.ref.to.col = range2.ref.from.col + colOffset;
        }
        return range2;
    },
};

module.exports = {
    FormulaHelpers: H,
    Types,
    ReversedTypes,
    Factorials,
    WildCard,
    Criteria,
    Address,
};

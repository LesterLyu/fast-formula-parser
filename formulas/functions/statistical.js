const FormulaError = require('../error');
const {FormulaHelpers, Types, WildCard, Criteria} = require('../helpers');
const {Infix} = require('../operators');
const H = FormulaHelpers;

const StatisticalFunctions = {
    COUNT: (...ranges) => {
        let cnt = 0;
        H.flattenParams(ranges, null, true,
            (item, info) => {
                // literal will be parsed to Type.NUMBER
                if (info.isLiteral && !isNaN(item)) {
                   cnt++;
                } else {
                    if (typeof item === "number")
                        cnt++;
                }
            });
        return cnt;
    },

    COUNTIF: (range, criteria) => {
        // do not flatten the array
        range = H.accept(range, Types.ARRAY, undefined, false, true);
        const isCriteriaArray = criteria.isArray;
        criteria = H.accept(criteria);

        let cnt = 0;
        // parse criteria
        criteria = Criteria.parse(criteria);

        range.forEach(row => {
            row.forEach(value => {
                // wildcard
                if (criteria.op === 'wc') {
                    if (criteria.value.test(value))
                        cnt++;
                } else if (Infix.compareOp(value, criteria.op, criteria.value, Array.isArray(value), isCriteriaArray)) {
                    cnt++;
                }
            })
        });
        return cnt;
    },

};

module.exports = StatisticalFunctions;

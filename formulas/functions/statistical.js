const FormulaError = require('../error');
const {FormulaHelpers, Types, WildCard, Criteria} = require('../helpers');
const {Infix} = require('../operators');
const H = FormulaHelpers;

const StatisticalFunctions = {
    COUNTIF: (range, criteria) => {
        // do not flatten the array
        range = H.accept(range, Types.ARRAY, null, false, true);
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

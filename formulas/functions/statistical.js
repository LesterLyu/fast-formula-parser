const FormulaError = require('../error');
const {FormulaHelpers, Types, WildCard, Criteria} = require('../helpers');
const {Infix} = require('../operators');
const H = FormulaHelpers;

const StatisticalFunctions = {
    AVEDEV: (...numbers) => {
        let sum = 0;
        const arr = [];
        // parse number only if the input is literal
        H.flattenParams(numbers, Types.NUMBER, true, (item, info) => {
            if (typeof item === "number") {
                sum += item;
                arr.push(item);
            }
        });
        const avg = sum / arr.length;
        sum = 0;
        for (let i = 0; i < arr.length; i++) {
            sum += Math.abs(arr[i] - avg);
        }
        return sum / arr.length;
    },

    AVERAGE: (...numbers) => {
        let sum = 0, cnt = 0;
        // parse number only if the input is literal
        H.flattenParams(numbers, Types.NUMBER, true, (item, info) => {
            if (typeof item === "number") {
                sum += item;
                cnt++;
            }
        });
        return sum / cnt;
    },

    AVERAGEA: (...numbers) => {
        let sum = 0, cnt = 0;
        // parse number only if the input is literal
        H.flattenParams(numbers, Types.NUMBER, true, (item, info) => {
            const type = typeof item;
            if (type === "number") {
                sum += item;
                cnt++;
            } else if (type === "string") {
                cnt++;
            }
        });
        return sum / cnt;
    },

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

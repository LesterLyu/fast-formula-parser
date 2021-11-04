const FormulaError = require("../error");
const { FormulaHelpers, Types, Criteria, Address } = require("../helpers");
const { Infix } = require("../operators");
const H = FormulaHelpers;
const { DistributionFunctions } = require("./distribution");

/**
 * Moved the logic from COUNTIF to here so that it could be used in both COUNTIF and
 * COUNTIFS.
 *
 * NOTE: This function returns an array of booleans that can be used
 *       in COUNTIFS to calculate a master array containing only values
 *       that passed all the checks.
 *
 * @param range
 * @param criteria
 * @returns Bool array of passed checks
 */
 const countIf = (range, criteria) => {
  // do not flatten the array
  range = H.accept(range, Types.ARRAY, undefined, false, true);
  const isCriteriaArray = criteria.isArray;
  criteria = H.accept(criteria);

  let arr = new Array(range.length * range[0].length).fill(false);
  // parse criteria
  criteria = Criteria.parse(criteria);

  let cnt = 0;
  range.forEach(row => {
    row.forEach(value => {
      // wildcard
      if (criteria.op === 'wc') {
        if (criteria.match === criteria.value.test(value))
          arr[cnt] = true;
      } else if (Infix.compareOp(value, criteria.op, criteria.value, Array.isArray(value), isCriteriaArray)) {
        arr[cnt] = true;
      }
      cnt++;
    })
  });
  return arr;
}

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
    let sum = 0,
      cnt = 0;
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
    let sum = 0,
      cnt = 0;
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

  // special
  AVERAGEIF: (context, range, criteria, averageRange) => {
    const ranges = H.retrieveRanges(context, range, averageRange);
    range = ranges[0];
    averageRange = ranges[1];

    criteria = H.retrieveArg(context, criteria);
    const isCriteriaArray = criteria.isArray;
    criteria = Criteria.parse(H.accept(criteria));

    let sum = 0,
      cnt = 0;
    range.forEach((row, rowNum) => {
      row.forEach((value, colNum) => {
        const valueToAdd = averageRange[rowNum][colNum];
        if (typeof valueToAdd !== "number") return;
        // wildcard
        if (criteria.op === "wc") {
          if (criteria.match === criteria.value.test(value)) {
            sum += valueToAdd;
            cnt++;
          }
        } else if (
          Infix.compareOp(
            value,
            criteria.op,
            criteria.value,
            Array.isArray(value),
            isCriteriaArray
          )
        ) {
          sum += valueToAdd;
          cnt++;
        }
      });
    });
    if (cnt === 0) throw FormulaError.DIV0;
    return sum / cnt;
  },

  AVERAGEIFS: () => {},

  COUNT: (...ranges) => {
    let cnt = 0;
    H.flattenParams(ranges, null, true, (item, info) => {
      // literal will be parsed to Type.NUMBER
      if (info.isLiteral && !isNaN(item)) {
        cnt++;
      } else {
        if (typeof item === "number") cnt++;
      }
    });
    return cnt;
  },

  COUNTA: (...ranges) => {
    let cnt = 0;
    H.flattenParams(ranges, null, true, (item) => {
      if (item) {
        cnt++;
      }
    });
    return cnt;
  },

  COUNTIF: (range, criteria) => {
    let cnt = 0;
    countIf(range, criteria).forEach(val => {
      if (val) cnt++;
    })
    return cnt;
  },

  COUNTIFS: (range1, criteria1, ...criteriaList) => {
    criteriaList.push(range1, criteria1);
    if (criteriaList.length % 2 != 0) throw FormulaError.ERROR('Bad argument count - All arguments must be in range/criteria pairs.');
    let arrs = [], currarr = [], len = 0;
    for (let i = 0; i < criteriaList.length; i += 2) {
      currarr = countIf(criteriaList[i], criteriaList[i+1]);
      if (i == 0) len = currarr.length;
      else if (currarr.length != len) throw FormulaError.ERROR('All parameter ranges must be of equal size.')
      arrs.push(currarr);
    }
    len = arrs[0].length;
    let arr = new Array(len).fill(true);
    arrs.forEach(currarr => {
      for (let i = 0; i < len; i++) {
        arr[i] = arr[i] && currarr[i];
      }
    })
    let cnt = 0;
    arr.forEach(val => {
      if (val) cnt++;
    })
    return cnt;
  },

  LARGE: () => {},

  MAX: () => {},

  MAXA: () => {},

  MAXIFS: () => {},

  MEDIAN: () => {},

  MIN: () => {},

  MINA: () => {},

  MINIFS: () => {},

  PERMUT: () => {},

  PERMUTATIONA: () => {},

  SMALL: () => {},
};

module.exports = Object.assign(StatisticalFunctions, DistributionFunctions);

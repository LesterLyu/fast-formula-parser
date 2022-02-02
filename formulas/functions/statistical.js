const FormulaError = require("../error");
const { FormulaHelpers, Criteria, Address } = require("../helpers");
const { Types } = require("../types");
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
  range.forEach((row) => {
    row.forEach((value) => {
      // wildcard
      if (criteria.op === "wc") {
        if (criteria.match === criteria.value.test(value)) arr[cnt] = true;
      } else{
        let x = Infix.compareOp(value, criteria.op, criteria.value, Array.isArray(value), isCriteriaArray)
        if(typeof x === "boolean"){
          bool = x
        }else{
          let localBool = false
          
          //not modifying bool for some reason
          x.forEach(row => 
            row.forEach(val => 
              localBool |= val
            )
          )
          bool = localBool
        }
        
        if(bool)
          arr[cnt] = true
        
      }
      cnt++;
    });
  });

  return arr;
};

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
    countIf(range, criteria).forEach((val) => {
      if (val) cnt++;
    });
    return cnt;
  },

  COUNTIFS: (range1, criteria1, ...criteriaList) => {
    criteriaList.push(range1, criteria1);
    if (criteriaList.length % 2 != 0)
      throw FormulaError.ERROR(
        "Bad argument count - All arguments must be in range/criteria pairs."
      );
    let arrs = [],
      currarr = [],
      len = 0;
    for (let i = 0; i < criteriaList.length; i += 2) {
      currarr = countIf(criteriaList[i], criteriaList[i + 1]);
      if (i == 0) len = currarr.length;
      else if (currarr.length != len)
        throw FormulaError.ERROR("All parameter ranges must be of equal size.");
      arrs.push(currarr);
    }
    len = arrs[0].length;
    let arr = new Array(len).fill(true);
    arrs.forEach((currarr) => {
      for (let i = 0; i < len; i++) {
        arr[i] = arr[i] && currarr[i];
      }
    });
    let cnt = 0;
    arr.forEach((val) => {
      if (val) cnt++;
    });
    return cnt;
  },

  LARGE: (range, k) => {
    if(range == null || k == null)
      throw FormulaError.NUM
    const index = H.accept(k, Types.NUMBER) - 1
    const flatArr = FormulaHelpers.flattenDeep(range.value)
    const filteredArr = flatArr.filter(a => typeof a === "number");
    if(filteredArr.length <= index || index < 0)
      throw FormulaError.NUM;
    const sortedArr = filteredArr.sort((a, b) => b - a)
    return sortedArr[index]
  },

  MAX: () => {},

  MAXA: (...values) => {
    //Deals with all of the values within the function parameters
    const parsedFromFunction = values.map(a => {
      const currValue = a.value
      if(a.ref !== undefined)
        return currValue
      if(typeof currValue === "number")
        return currValue
      if(typeof currValue === "boolean")
        return +currValue
      if(currValue === null)
        return null
      if(!isNaN(parseFloat(currValue)))
        return parseFloat(currValue)
      if(typeof currValue === "string")
        throw FormulaError.VALUE
      throw FormulaError.VALUE
    })
    const flatArr = H.flattenDeep(parsedFromFunction)
    //deals with any values passed in as an array
    const parseNumFromArray = (a) => {
      if(typeof a === "boolean")
        return +a
      if(typeof a === "string")
        return 0
      if(typeof a === "number")
        return a
      return 0
    }
    const finalArr = flatArr.filter((value) => value != null)
    if(finalArr.length === 0)
      return 0;
    //used instead of Math.max(...finalArr) to avoid JS maximum input length
    return finalArr.reduce((prev, val) => {
      const num = parseNumFromArray(val)
      return Math.max(prev, num)
    }, -Infinity)
   
  },

  MAXIFS: () => {},

  MEDIAN: (...numbers) => {
    let arr = []
    arr.push(...numbers.map(a => a.value))
    const flatArr = FormulaHelpers.flattenDeep(arr);
          sortedArr = flatArr.sort((a,b) =>  a - b)
          filteredArr = sortedArr.filter(a => typeof(a) === "number")
    if(filteredArr.length <= 0)
      throw FormulaError.NUM
    if(filteredArr.length % 2 === 1){
      return filteredArr[(filteredArr.length - 1) / 2]
    }
    else if(filteredArr.length % 2 === 0){
      let i = Math.floor(filteredArr.length / 2)
      return (filteredArr[i] + filteredArr[i-1]) / 2
    }else{
      throw "Unreachable Code Error"
    }

  },

  MIN: () => {},

  MINA: (...values) => {
    //Deals with all of the values within the function parameters
    const parsedFromFunction = values.map(a => {
      const currValue = a.value
      if(a.ref !== undefined)
        return currValue
      if(typeof currValue === "number")
        return currValue
      if(typeof currValue === "boolean")
        return +currValue
      if(currValue === null)
        return null
      if(!isNaN(parseFloat(currValue)))
        return parseFloat(currValue)
      if(typeof currValue === "string")
        throw FormulaError.VALUE
      throw FormulaError.VALUE
    })
    const flatArr = H.flattenDeep(parsedFromFunction)
    //deals with any values passed in as an array
    const parseNumFromArray = (a) => {
      if(typeof a === "boolean")
        return +a
      if(typeof a === "string")
        return 0
      if(typeof a === "number")
        return a
      return 0
    }
    const finalArr = flatArr.filter((value) => value != null)
    if(finalArr.length === 0)
      return 0;
    //used instead of Math.max(...finalArr) to avoid JS maximum input length
    return finalArr.reduce((prev, val) => {
      const num = parseNumFromArray(val)
      return Math.min(prev, num)
    }, Infinity)
  },

  MINIFS: () => {},

  MODE: (...arr) =>{
    arr.push(...arr.map(a => a.value))
    const flatArr = FormulaHelpers.flattenDeep(arr),
          filteredArr = flatArr.filter(a => typeof a === "number");

    if(filteredArr.length <= 0)
      throw FormulaError.NA;

    let map = new Map();
    for(let i = 0; i < filteredArr.length; i++){
      const curr = filteredArr[i];
      if(!map.has(curr))
        map.set(curr, 0);
      map.set(curr, map.get(curr) + 1);
    }

    const keys = map.keys();
    let currBig = 0,
        rv = null,
        all1 = true;
    for(const key of keys){
      if(map.get(key) > 1)
        all1 = false;
      if(map.get(key) > currBig){
        currBig = map.get(key);
        rv = key;
      }
    }
    if(all1)
      throw FormulaError.NA;
    return rv;
  },

  PERMUT: () => {},

  PERMUTATIONA: () => {},

  SMALL: (range, k) => {
    if(range == null || k == null)
      throw FormulaError.NUM
    const index = H.accept(k, Types.NUMBER) - 1
    const arr = H.accept(range, Types.ARRAY)
    const flatArr = FormulaHelpers.flattenDeep(arr)
    const filteredArr = flatArr.filter(a => typeof a === "number");
    if(filteredArr.length <= index || index < 0)
      throw FormulaError.NUM;
    const sortedArr = filteredArr.sort((a, b) => a - b)
    return sortedArr[index]
  },
};

module.exports = Object.assign(StatisticalFunctions, DistributionFunctions);

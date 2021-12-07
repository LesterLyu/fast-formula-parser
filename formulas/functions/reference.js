const FormulaError = require("../error");
const { FormulaHelpers, WildCard, Address } = require("../helpers");
const { Types } = require("../types");
const Collection = require("../../grammar/type/collection");
const H = FormulaHelpers;

const ReferenceFunctions = {
  ADDRESS: (rowNumber, columnNumber, absNum, a1, sheetText) => {
    rowNumber = H.accept(rowNumber, Types.NUMBER);
    columnNumber = H.accept(columnNumber, Types.NUMBER);
    absNum = H.accept(absNum, Types.NUMBER, 1);
    a1 = H.accept(a1, Types.BOOLEAN, true);
    sheetText = H.accept(sheetText, Types.STRING, "");

    if (rowNumber < 1 || columnNumber < 1 || absNum < 1 || absNum > 4)
      throw FormulaError.VALUE;

    let result = "";
    if (sheetText.length > 0) {
      if (/[^A-Za-z_.\d\u007F-\uFFFF]/.test(sheetText)) {
        result += `'${sheetText}'!`;
      } else {
        result += sheetText + "!";
      }
    }
    if (a1) {
      // A1 style
      result += absNum === 1 || absNum === 3 ? "$" : "";
      result += Address.columnNumberToName(columnNumber);
      result += absNum === 1 || absNum === 2 ? "$" : "";
      result += rowNumber;
    } else {
      // R1C1 style
      result += "R";
      result += absNum === 4 || absNum === 3 ? `[${rowNumber}]` : rowNumber;
      result += "C";
      result +=
        absNum === 4 || absNum === 2 ? `[${columnNumber}]` : columnNumber;
    }
    return result;
  },

  AREAS: (refs) => {
    refs = H.accept(refs);
    if (refs instanceof Collection) {
      return refs.length;
    }
    return 1;
  },

  CHOOSE: (indexNum, ...values) => {},

  // Special
  COLUMN: (context, obj) => {
    if (obj == null) {
      if (context.position.col != null) return context.position.col;
      else
        throw Error(
          "FormulaParser.parse is called without position parameter."
        );
    } else {
      if (typeof obj !== "object" || Array.isArray(obj))
        throw FormulaError.VALUE;
      if (H.isCellRef(obj)) {
        return obj.ref.col;
      } else if (H.isRangeRef(obj)) {
        return obj.ref.from.col;
      } else {
        throw Error("ReferenceFunctions.COLUMN should not reach here.");
      }
    }
  },

  // Special
  COLUMNS: (context, obj) => {
    if (obj == null) {
      throw Error("COLUMNS requires one argument");
    }
    if (typeof obj != "object" || Array.isArray(obj)) throw FormulaError.VALUE;
    if (H.isCellRef(obj)) {
      return 1;
    } else if (H.isRangeRef(obj)) {
      return Math.abs(obj.ref.from.col - obj.ref.to.col) + 1;
    } else {
      throw Error("ReferenceFunctions.COLUMNS should not reach here.");
    }
  },
  /**
   *
   * @param lookupValue: the value we are filtering for in our lookupArray
   * @param lookupArray: the array which we match values to lookupValue
   * @param returnArray: the return values/array
   * @param defaultValue : OPTIONAL: returned if lookupValue is not found
   */
  FILTER: (returnArray, boolArray, defaultValue = null) => {
    boolArray = H.accept(boolArray, Types.ARRAY);
    returnArray = H.accept(returnArray, Types.ARRAY);
    if (defaultValue !== null) {
      defaultValue = H.accept(defaultValue);
    }
    if (!Array.isArray(boolArray)) {
      throw FormulaError.NA;
    }
    if (!Array.isArray(returnArray)) {
      throw FormulaError.NA;
    }
    if (boolArray.length !== returnArray.length) {
      throw FormulaError.VALUE;
    }
    var rv = [];
    for (let index = 0; index < boolArray.length; index++) {
      let currBOOL = H.accept(boolArray[index], Types.BOOLEAN);
      let currRV = H.accept(returnArray[index]);
      if (currBOOL) {
        rv.push(currRV);
      }
    }
    if (rv.length === 0 && defaultValue !== null) {
      return defaultValue;
    }
    if (rv.length === 0 && defaultValue === null) {
      throw FormulaError.VALUE;
    }
    return rv;
  },

  HLOOKUP: (lookupValue, tableArray, rowIndexNum, rangeLookup) => {
    // preserve type of lookupValue
    lookupValue = H.accept(lookupValue);
    try {
      tableArray = H.accept(tableArray, Types.ARRAY, undefined, false);
    } catch (e) {
      // catch #VALUE! and throw #N/A
      if (e instanceof FormulaError) throw FormulaError.NA;
      throw e;
    }
    rowIndexNum = H.accept(rowIndexNum, Types.NUMBER);
    rangeLookup = H.accept(rangeLookup, Types.BOOLEAN, true);

    // check if rowIndexNum out of bound
    if (rowIndexNum < 1) throw FormulaError.VALUE;
    if (tableArray[rowIndexNum - 1] === undefined) throw FormulaError.REF;

    const lookupType = typeof lookupValue; // 'number', 'string', 'boolean'
    // approximate lookup (assume the array is sorted)
    if (rangeLookup) {
      let prevValue =
        lookupType === typeof tableArray[0][0] ? tableArray[0][0] : null;
      for (let i = 1; i < tableArray[0].length; i++) {
        const currValue = tableArray[0][i];
        const type = typeof currValue;
        // skip the value if type does not match
        if (type !== lookupType) continue;
        // if the previous two values are greater than lookup value, throw #N/A
        if (prevValue > lookupValue && currValue > lookupValue) {
          throw FormulaError.NA;
        }
        if (currValue === lookupValue) return tableArray[rowIndexNum - 1][i];
        // if previous value <= lookup value and current value > lookup value
        if (
          prevValue != null &&
          currValue > lookupValue &&
          prevValue <= lookupValue
        ) {
          return tableArray[rowIndexNum - 1][i - 1];
        }
        prevValue = currValue;
      }
      if (prevValue == null) throw FormulaError.NA;
      if (tableArray[0].length === 1) {
        return tableArray[rowIndexNum - 1][0];
      }
      return prevValue;
    }
    // exact lookup with wildcard support
    else {
      let index = -1;
      if (WildCard.isWildCard(lookupValue)) {
        index = tableArray[0].findIndex((item) => {
          return WildCard.toRegex(lookupValue, "i").test(item);
        });
      } else {
        index = tableArray[0].findIndex((item) => {
          return item === lookupValue;
        });
      }
      // the exact match is not found
      if (index === -1) throw FormulaError.NA;
      return tableArray[rowIndexNum - 1][index];
    }
  },

  // Special
  INDEX: (context, ranges, rowNum, colNum, areaNum) => {
    // retrieve values
    rowNum = context.utils.extractRefValue(rowNum);
    rowNum = { value: rowNum.val, isArray: rowNum.isArray };
    rowNum = H.accept(rowNum, Types.NUMBER);
    rowNum = Math.trunc(rowNum);

    if (colNum == null) {
      colNum = 1;
    } else {
      colNum = context.utils.extractRefValue(colNum);
      colNum = { value: colNum.val, isArray: colNum.isArray };
      colNum = H.accept(colNum, Types.NUMBER, 1);
      colNum = Math.trunc(colNum);
    }

    if (areaNum == null) {
      areaNum = 1;
    } else {
      areaNum = context.utils.extractRefValue(areaNum);
      areaNum = { value: areaNum.val, isArray: areaNum.isArray };
      areaNum = H.accept(areaNum, Types.NUMBER, 1);
      areaNum = Math.trunc(areaNum);
    }

    // get the range area that we want to index
    // ranges can be cell ref, range ref or array constant
    let range = ranges;
    // many ranges (Reference form)
    if (ranges instanceof Collection) {
      range = ranges.refs[areaNum - 1];
    } else if (areaNum > 1) {
      throw FormulaError.REF;
    }

    if (rowNum === 0 && colNum === 0) {
      return range;
    }

    // query the whole column
    if (rowNum === 0) {
      if (H.isRangeRef(range)) {
        if (range.ref.to.col - range.ref.from.col < colNum - 1)
          throw FormulaError.REF;
        range.ref.from.col += colNum - 1;
        range.ref.to.col = range.ref.from.col;
        return range;
      } else if (Array.isArray(range)) {
        const res = [];
        range.forEach((row) => res.push([row[colNum - 1]]));
        return res;
      }
    }
    // query the whole row
    if (colNum === 0) {
      if (H.isRangeRef(range)) {
        if (range.ref.to.row - range.ref.from.row < rowNum - 1)
          throw FormulaError.REF;
        range.ref.from.row += rowNum - 1;
        range.ref.to.row = range.ref.from.row;
        return range;
      } else if (Array.isArray(range)) {
        return range[colNum - 1];
      }
    }
    // query single cell
    if (rowNum !== 0 && colNum !== 0) {
      // range reference
      if (H.isRangeRef(range)) {
        range = range.ref;
        if (
          range.to.row - range.from.row < rowNum - 1 ||
          range.to.col - range.from.col < colNum - 1
        )
          throw FormulaError.REF;
        return {
          ref: {
            row: range.from.row + rowNum - 1,
            col: range.from.col + colNum - 1,
          },
        };
      }
      // cell reference
      else if (H.isCellRef(range)) {
        range = range.ref;
        if (rowNum > 1 || colNum > 1) throw FormulaError.REF;
        return {
          ref: { row: range.row + rowNum - 1, col: range.col + colNum - 1 },
        };
      }
      // array constant
      else if (Array.isArray(range)) {
        if (range.length < rowNum || range[0].length < colNum)
          throw FormulaError.REF;
        return range[rowNum - 1][colNum - 1];
      }
    }
  },

  MATCH: () => {},

  // Special
  ROW: (context, obj) => {
    if (obj == null) {
      if (context.position.row != null) return context.position.row;
      else
        throw Error(
          "FormulaParser.parse is called without position parameter."
        );
    } else {
      if (typeof obj !== "object" || Array.isArray(obj))
        throw FormulaError.VALUE;
      if (H.isCellRef(obj)) {
        return obj.ref.row;
      } else if (H.isRangeRef(obj)) {
        return obj.ref.from.row;
      } else {
        throw Error("ReferenceFunctions.ROW should not reach here.");
      }
    }
  },

  // Special
  ROWS: (context, obj) => {
    if (obj == null) {
      throw Error("ROWS requires one argument");
    }
    if (typeof obj != "object" || Array.isArray(obj)) throw FormulaError.VALUE;
    if (H.isCellRef(obj)) {
      return 1;
    } else if (H.isRangeRef(obj)) {
      return Math.abs(obj.ref.from.row - obj.ref.to.row) + 1;
    } else {
      throw Error("ReferenceFunctions.ROWS should not reach here.");
    }
  },

  TRANSPOSE: (array) => {
    array = H.accept(array, Types.ARRAY, undefined, false);
    // https://github.com/numbers/numbers.js/blob/master/lib/numbers/matrix.js#L171
    const result = [];

    for (let i = 0; i < array[0].length; i++) {
      result[i] = [];

      for (let j = 0; j < array.length; j++) {
        result[i][j] = array[j][i];
      }
    }

    return result;
  },

  /**
   * @param {*} range - The data to filter by unique entries.
   * @returns unique rows in the provided source range, discarding duplicates.
   *          Rows are returned in the order in which they first appear in the source range.
   **/
  UNIQUE: (range) => {
    try {
      range = H.accept(range, Types.ARRAY, null, false);
    } catch (e) {
      range = H.accept(range);
      return range;
    }
    //Checks to see if range is an array of arrays. If it is not,
    //then the first row is Unique to its self and thus can be returned
    if (typeof range[0] !== "object") {
      return range;
    }
    let seen = new Set();
    let rv = [];
    for (let index = 0; index < range.length; index++) {
      let currValue = range[index];
      let returnValue = currValue;
      currValue = H.accept(currValue);
      returnValue = H.accept(returnValue);

      //Since JS compares based upon pointers, converting our Arrays to strings allows for element wise comparisons.
      if (typeof currValue.join === "function") {
        currValue = currValue.join();
      }
      if (!seen.has(currValue)) {
        seen.add(currValue);
        rv.push(returnValue);
      }
    }
    return rv;
  },

  VLOOKUP: (lookupValue, tableArray, colIndexNum, rangeLookup) => {
    // preserve type of lookupValue
    lookupValue = H.accept(lookupValue);
    try {
      tableArray = H.accept(tableArray, Types.ARRAY, undefined, false);
    } catch (e) {
      // catch #VALUE! and throw #N/A
      if (e instanceof FormulaError) throw FormulaError.NA;
      throw e;
    }
    colIndexNum = H.accept(colIndexNum, Types.NUMBER);
    rangeLookup = H.accept(rangeLookup, Types.BOOLEAN, true);

    // check if colIndexNum out of bound
    if (colIndexNum < 1) throw FormulaError.VALUE;
    if (tableArray[0][colIndexNum - 1] === undefined) throw FormulaError.REF;

    const lookupType = typeof lookupValue; // 'number', 'string', 'boolean'

    // approximate lookup (assume the array is sorted)
    if (rangeLookup) {
      let prevValue =
        lookupType === typeof tableArray[0][0] ? tableArray[0][0] : null;
      for (let i = 1; i < tableArray.length; i++) {
        const currRow = tableArray[i];
        const currValue = tableArray[i][0];
        const type = typeof currValue;
        // skip the value if type does not match
        if (type !== lookupType) continue;
        // if the previous two values are greater than lookup value, throw #N/A
        if (prevValue > lookupValue && currValue > lookupValue) {
          throw FormulaError.NA;
        }
        if (currValue === lookupValue) return currRow[colIndexNum - 1];
        // if previous value <= lookup value and current value > lookup value
        if (
          prevValue != null &&
          currValue > lookupValue &&
          prevValue <= lookupValue
        ) {
          return tableArray[i - 1][colIndexNum - 1];
        }
        prevValue = currValue;
      }
      if (prevValue == null) throw FormulaError.NA;
      if (tableArray.length === 1) {
        return tableArray[0][colIndexNum - 1];
      }
      return prevValue;
    }
    // exact lookup with wildcard support
    else {
      let index = -1;
      if (WildCard.isWildCard(lookupValue)) {
        index = tableArray.findIndex((currRow) => {
          return WildCard.toRegex(lookupValue, "i").test(currRow[0]);
        });
      } else {
        index = tableArray.findIndex((currRow) => {
          return currRow[0] === lookupValue;
        });
      }
      // the exact match is not found
      if (index === -1) throw FormulaError.NA;
      return tableArray[index][colIndexNum - 1];
    }
  },
  /***
   * @param lookup_value: the value we are looking for in our lookup_array
   * @param lookup_array: the array were we search for lookup_value
   * @param return_array: the array where our return value is
   * @param if_not_found: OPTIONAL default value if lookup_value is not found
   * @param match_mode: OPTIONAL:
   *                         0: If none found, return #N/A. This is the default
   *                         -1 - Exact match. If none found, return the next smaller item.
   *                          1 - Exact match. If none found, return the next larger item.
   *                          2 - A wildcard match where *, ?, and ~ have special meaning.
   * @param search_mode: OPTIONAL:
   *                          1 - Perform a search starting at the first item. This is the default.
   *                         -1 - Perform a reverse search starting at the last item.
   *                          2 - Perform a binary search that relies on lookup_array being sorted in ascending order. If not sorted, invalid results will be returned.
   *                         -2 - Perform a binary search that relies on lookup_array being sorted in descending order. If not sorted, invalid results will be returned.
   * Microsoft Link: https://support.microsoft.com/en-us/office/xlookup-function-b7fd680e-6d10-43e6-84f9-88eae8bf5929
   ***/
  XLOOKUP: (
    lookup_value,
    lookup_array,
    return_array,
    if_not_found = null,
    match_mode = 0,
    search_mode = 1
  ) => {
    try {
      lookup_array = H.accept(lookup_array, Types.ARRAY);
      return_array = H.accept(return_array, Types.ARRAY);
    } catch (e) {
      if (e instanceof FormulaError) {
        throw FormulaError.NA;
      }
      throw e;
    }
    if (lookup_array.length != return_array.length) {
      throw FormulaError.NA;
    }
    if (Array.isArray(lookup_array[0])) {
      throw FormulaError.VALUE;
    }
    if (Array.isArray(return_array[0])) {
      throw FormulaError.VALUE;
    }

    lookup_value = H.accept(lookup_value);
    search_mode = H.accept(search_mode, Types.NUMBER);
    match_mode = H.accept(match_mode, Types.NUMBER);
    if (![1, -1, 2, -2].includes(search_mode)) {
      throw FormulaError.VALUE;
    }
    if (![0, 1, -1, 2].includes(match_mode)) {
      throw FormulaError.VALUE;
    }
    if (match_mode === 2 && [2, -2].includes(search_mode)) {
      throw FormulaError.VALUE;
    }
    if (if_not_found != null) {
      if (if_not_found.omitted) {
        if_not_found = null;
      } else {
        if_not_found = H.accept(
          if_not_found,
          null,
          null,
          true,
          false,
          (test = true)
        );
      }
    }
    //If search mode is 1 or -1, then we run a linear search on the input arrays
    if ([1, -1].includes(search_mode)) {
      //Transform is 0 if search mode is 1 (we want to go through the array in order)
      //Transform is the last index if search_mode is -1 (we go through in reverse order)
      const transform = search_mode === 1 ? 0 : lookup_array.length - 1;
      var minDiff = { index: -1, value: Number.MAX_VALUE };
      var maxDiff = { index: -1, value: Number.MAX_VALUE };

      for (var i = 0; i < lookup_array.length; i++) {
        const currIndex = Math.abs(transform - i);
        const currValue = H.accept(lookup_array[currIndex]);
        const comparison = H.XLOOKUP_HELPER(
          lookup_value,
          currValue,
          match_mode != 2
        );

        if (comparison === 0) {
          return return_array[currIndex];
        }
        if ([1, -1].includes(match_mode)) {
          if (comparison < 0 && Math.abs(comparison) < minDiff.value) {
            minDiff.index = currIndex;
            minDiff.value = Math.abs(comparison);
          }
          if (comparison > 0 && comparison < maxDiff.value) {
            maxDiff.index = currIndex;
            maxDiff.value = comparison;
          }
        }
      }
      if (minDiff.index >= 0 && match_mode === -1) {
        return return_array[minDiff.index];
      }
      if (maxDiff.index >= 0 && match_mode === 1) {
        return return_array[maxDiff.index];
      }
      if (if_not_found != null) {
        return if_not_found;
      }
      throw FormulaError.NA;

      //In the case where search mode is 2 or -2, we run a binary search
    } else if ([2, -2].includes(search_mode)) {
      var front = 0;
      var back = lookup_array.length - 1;
      while (front < back - 1) {
        const middle = Math.floor((front + back) / 2);
        const currValue = H.accept(lookup_array[middle]);
        const comparison = H.XLOOKUP_HELPER(
          lookup_value,
          currValue,
          match_mode != 2,
          [2, -2].includes(search_mode)
        );
        if (comparison === 0) {
          return return_array[middle];
        } else if (comparison < 0 && search_mode === 2) {
          front = middle;
        } else if (comparison < 0 && search_mode === -2) {
          back = middle;
        } else if (comparison > 0 && search_mode === 2) {
          back = middle;
        } else if (comparison > 0 && search_mode === -2) {
          front = middle;
        } else {
          throw "Unreachable Code Error";
        }
      }
      var comparisonFront = H.XLOOKUP_HELPER(
        lookup_value,
        lookup_array[front],
        match_mode != 2
      );
      var comparisonBack = H.XLOOKUP_HELPER(
        lookup_value,
        lookup_array[back],
        match_mode != 2
      );

      if (comparisonFront === 0) {
        return return_array[front];
      }
      if (comparisonBack === 0) {
        return return_array[back];
      }
      //If search mode === 2 search_mode === 1, we have to check front first,
      //b/c its in ascending order and we want the next largest item
      if (comparisonFront > 0 && match_mode === 1 && search_mode === 2) {
        return return_array[front];
      }
      if (comparisonBack > 0 && match_mode === 1 && search_mode === 2) {
        return return_array[back];
      }
      //If search mode === 2 search_mode === -1, we have to check back first,
      //b/c its in ascending order and we want the next smaller item
      if (comparisonBack < 0 && match_mode === -1 && search_mode === 2) {
        return return_array[back];
      }
      if (comparisonFront < 0 && match_mode === -1 && search_mode === 2) {
        return return_array[front];
      }
      //If search mode === -2 search_mode === 1, we have to check back first,
      //b/c its in descending order and we want the next largest item
      if (comparisonBack > 0 && match_mode === 1 && search_mode === -2) {
        return return_array[back];
      }
      if (comparisonFront > 0 && match_mode === 1 && search_mode === -2) {
        return return_array[front];
      }
      //If search mode === -2 search_mode === -1, we have to check front first,
      //b/c its in descending order and we want the next smaller item
      if (comparisonFront < 0 && match_mode === -1 && search_mode === -2) {
        return return_array[front];
      }
      if (comparisonBack < 0 && match_mode === -1 && search_mode === -2) {
        return return_array[back];
      }
      if (if_not_found) {
        return if_not_found;
      }
    }
    throw FormulaError.NA;
  },
};

module.exports = ReferenceFunctions;

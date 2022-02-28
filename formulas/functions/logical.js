const FormulaError = require("../error");
const { FormulaHelpers } = require("../helpers");
const { Types } = require("../types");
const H = FormulaHelpers;

/**
 * Get the number of values that evaluate to true and false.
 * Cast Number and "TRUE", "FALSE" to boolean.
 * Ignore unrelated values.
 * @ignore
 * @param {any[]} params
 * @return {number[]}
 */
function getNumLogicalValue(params) {
  let numTrue = 0,
    numFalse = 0;
  H.flattenParams(params, null, true, (val) => {
    const type = typeof val;
    if (type === "string") {
      if (val === "TRUE") val = true;
      else if (val === "FALSE") val = false;
    } else if (type === "number") val = Boolean(val);

    if (typeof val === "boolean") {
      if (val === true) numTrue++;
      else numFalse++;
    }
  });
  return [numTrue, numFalse];
}

const LogicalFunctions = {
  AND: (...params) => {
    const [numTrue, numFalse] = getNumLogicalValue(params);

    // OR returns #VALUE! if no logical values are found.
    if (numTrue === 0 && numFalse === 0) return FormulaError.VALUE;

    return numTrue > 0 && numFalse === 0;
  },

  FALSE: () => {
    return false;
  },

  IF: (logicalTest, valueIfTrue, valueIfFalse) => {
    const logicalTestValue = H.accept(logicalTest, Types.BOOLEAN);
    const valueIfTrueValue = H.accept(valueIfTrue); // do not parse type
    const valueIfFalseValue = H.accept(valueIfFalse, null, false); // do not parse type

    return logicalTestValue ? valueIfTrueValue : valueIfFalseValue;
  },

  IFERROR: (value, valueIfError) => {
    return value.value instanceof FormulaError
      ? H.accept(valueIfError)
      : H.accept(value);
  },

  IFNA: function (value, valueIfNa) {
    if (arguments.length > 2) throw FormulaError.TOO_MANY_ARGS("IFNA");
    return FormulaError.NA.equals(value.value)
      ? H.accept(valueIfNa)
      : H.accept(value);
  },

  IFS: (...params) => {
    if (params.length % 2 !== 0)
      return new FormulaError(
        "#N/A",
        "IFS expects all arguments after position 0 to be in pairs."
      );

    for (let i = 0; i < params.length / 2; i++) {
      const logicalTest = H.accept(params[i * 2], Types.BOOLEAN);
      const valueIfTrue = H.accept(params[i * 2 + 1]);
      if (logicalTest) return valueIfTrue;
    }

    return FormulaError.NA;
  },

  NOT: (logical) => {
    const value = H.accept(logical, undefined, false);
    if(typeof value === "boolean")
      return !value;
    else if(Array.isArray(value))
      return value.map((row) => row.map((value) => !H.accept(value, Types.BOOLEAN)))
    else if(typeof value === "number")
      return value === 0
    throw FormulaError.VALUE;
    },

  OR: (...params) => {
    const [numTrue, numFalse] = getNumLogicalValue(params);

    // OR returns #VALUE! if no logical values are found.
    if (numTrue === 0 && numFalse === 0) return FormulaError.VALUE;

    return numTrue > 0;
  },

  SWITCH: (...params) => {},

  TRUE: () => {
    return true;
  },

  XOR: (...params) => {
    const [numTrue, numFalse] = getNumLogicalValue(params);

    // XOR returns #VALUE! if no logical values are found.
    if (numTrue === 0 && numFalse === 0) return FormulaError.VALUE;

    return numTrue % 2 === 1;
  },
};

module.exports = LogicalFunctions;

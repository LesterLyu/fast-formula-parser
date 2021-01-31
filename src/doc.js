/**
 * @typedef {Object} CellReference
 * @property {string} sheet
 * @property {number} row
 * @property {number} col
 */

/**
 * @memberOf FormulaParser
 * @typedef {Object} RangeReference
 * @property {string} sheet
 * @property {{row: number, col: number}} from
 * @property {{row: number, col: number}} to
 */


/**
 * @memberOf FormulaParser
 * @typedef {CellReference|RangeReference} CellOrRangeReference
 */

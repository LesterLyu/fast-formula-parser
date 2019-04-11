const {FormulaHelpers, Address} = require('../formulas/helpers');
const FormulaParser = require('../index');
const XlsxPopulate = require('xlsx-populate');
const MAX_ROW = 1048576, MAX_COLUMN = 16384;

let t = Date.now();
let parser, wb;

function getSharedFormula(cell, refCell) {

    const refFormula = refCell.getSharedRefFormula();

    const refCol = refCell.columnNumber();
    const refRow = refCell.rowNumber();
    const cellCol = cell.columnNumber();
    const cellRow = cell.rowNumber();

    const offsetCol = cellCol - refCol;
    const offsetRow = cellRow - refRow;

    const formula = refFormula
        .replace(/(\$)?([A-Z]+)(\$)?([0-9]+)(\()?/g, (match, absCol, colName, absRow, row, isFunction, index) => {
            if (!!isFunction) {
                return match;
            }

            const col = +Address.columnNameToNumber(colName);
            row = +row;

            const _col = !!absCol ? col : col + offsetCol;
            const _row = !!absRow ? row : row + offsetRow;

            const _colName = Address.columnNumberToName(_col);
            return `${_colName}${_row}`;
        });

    return formula;
}


class ReferenceTable {
    constructor() {
        this._data = {};
    }

    /**
     *
     * @param {string} sheet
     * @param {number} row
     * @param {number} col
     * @param {{sheet: string, row: number, col: number}} ref
     */
    add(sheet, row, col, ref) {
        if (!this._data[sheet])
            this._data[sheet] = {};
        if (!this._data[sheet][row])
            this._data[sheet][row] = {};
        if (!this._data[sheet][row][col])
            this._data[sheet][row][col] = [];
        this._data[sheet][row][col].push(ref);
    }
}


let tGetter = 0;

function initParser() {
    parser = new FormulaParser({
        onCell: ref => {
            let t = Date.now();
            let val = null;
            const sheet = wb.sheet(ref.sheet);
            if (sheet._rows[ref.row] != null && sheet._rows[ref.row]._cells[ref.col] !== null) {
                val = sheet._rows[ref.row]._cells[ref.col]._value;
            }
            // console.log(`Get cell ${val}`);
            tGetter += Date.now() - t;
            return val == null ? null : val;
        },
        onRange: ref => {
            let t = Date.now();
            const arr = [];
            const sheet = wb.sheet(ref.sheet);
            // whole column
            if (ref.to.row === MAX_ROW) {
                sheet._rows.forEach((row, rowNumber) => {
                    const cellValue = row.cell(ref.from.row)._value;
                    arr[rowNumber] = [cellValue == null ? null : cellValue];
                })
            }
            // whole row
            else if (ref.to.col === MAX_COLUMN) {
                arr.push([]);
                sheet._rows[ref.from.row].forEach(cell => {
                    arr[0].push(cell._value == null ? null : cell._value)
                })

            } else {
                const sheet = wb.sheet(ref.sheet);

                for (let row = ref.from.row; row <= ref.to.row; row++) {
                    const innerArr = [];
                    // row exists
                    if (sheet._rows[row] != null) {
                        for (let col = ref.from.col; col <= ref.to.col; col++) {
                            const cell = sheet._rows[row]._cells[col];
                            if (cell != null) {
                                innerArr[col - 1] = cell._value;
                            }
                        }
                    }
                    arr.push(innerArr);
                }
            }
            // console.log(`Get cell ${arr}`);

            tGetter += Date.now() - t;
            return arr;
        }
    });
}

function something(workbook) {
    wb = workbook;
    initParser();
    console.log(`open workbook uses ${Date.now() - t}ms`);
    t = Date.now();
    const formulas = [];
    workbook.sheets().forEach((sheet, sheetNo) => {
        const name = sheet.name();
        const sharedFormulas = [];
        sheet._rows.forEach((row, rowNumber) => {
            // const rowStyle = styles[rowNumber - 1] = {};
            row._cells.forEach((cell, colNumber) => {
                // process cell data
                let formula = cell.formula();
                if (typeof formula === 'string') {
                    // this is the parent shared formula
                    if (formula !== 'SHARED' && cell._sharedFormulaId !== undefined) {
                        sharedFormulas[cell._sharedFormulaId] = cell;
                    } else if (formula === 'SHARED') {
                        // convert this cell to normal formula
                        const refCell = sharedFormulas[cell._sharedFormulaId];
                        formula = getSharedFormula(cell, refCell);
                        const oldValue = cell.value();
                        cell.formula(formula)._value = oldValue;
                    }
                    formulas.push(formula);
                    // console.log(formula, `sheet: ${name}, row: ${rowNumber}, col: ${colNumber}`);
                    const res = parser.parseDep(formula, {sheet: name, row: rowNumber, col: colNumber});

                    // if (res != null && res.result)
                    //     cell._value = res.result;
                    // else
                    //     cell._value = res;

                }
            });
        });
    });
    console.log(`process formulas uses ${Date.now() - t}ms, with ${formulas.length} formulas, query data uses ${tGetter}ms`);
    t = Date.now();

    // get data
    const res = parser.parseDep('IFERROR(Mandatories!$B$1:$I$3012)',
        {sheet: 'Act_Summary', row: 1, col: 1});
    // console.log(res);
    console.log(`process formulas uses ${Date.now() - t}ms`);
}


XlsxPopulate.fromFileAsync("./xlsx/test.xlsx").then(something);
// 2019/4/9 20:00
// open workbook uses 1235ms
// process formulas uses 315450ms, with 26283 formulas.
// 2019/4/10 11:30
// process formulas uses 40779ms, with 26283 formulas, query data uses 38068ms
// process formulas uses 25822ms, with 26283 formulas, query data uses 23634ms
// process formulas uses 16857ms, with 26283 formulas, query data uses 15269ms
// process formulas uses 2358ms, with 26283 formulas, query data uses 1175ms

const {FormulaHelpers, Address} = require('../formulas/helpers');
const FormulaParser = require('../index');
const {DepParser} = require('../grammar/dependency/hooks');
const XlsxPopulate = require('xlsx-populate');
const MAX_ROW = 1048576, MAX_COLUMN = 16384;

let t = Date.now();
let parser, depParser, wb, rt, sheetNames = [];

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
        this._data = new Map();
    }

    /**
     * refB depends on refA, which means changes on refA will trigger
     * re-calculation on refB.
     * @param refA - Dependency of refB
     * @param refB
     */
    add(refA, refB) {
        let sheet = refA.sheet;
        if (typeof refA.sheet === "string")
            sheet = sheetNames.indexOf(refA.sheet);
        if (sheet === -1)
            throw Error('ReferenceTable.add: Sheet name does not exist: ' + refA.sheet);
        if (!this._data.get(sheet))
            this._data.set(sheet, new Map());
        let from, to;
        if (refA.from) {
            from = refA.from.row * 100000 + refA.from.col;
            to = refA.to.row * 100000 + refA.to.col;
        } else {
            from = refA.row * 100000 + refA.col;
            to = from;
        }
        if (!this._data.get(sheet).get(from))
            this._data.get(sheet).set(from, new Map());
        if (!this._data.get(sheet).get(from).get(to))
            this._data.get(sheet).get(from).set(to, new Map());

        if (!this._data.get(sheet).get(from).get(to).get(refB.sheet))
            this._data.get(sheet).get(from).get(to).set(refB.sheet, []);

        this._data.get(sheet).get(from).get(to).get(refB.sheet).push(refB.row * 100000 + refB.col);
    }

    /**
     * Called when a cell's value is cleared.
     * @param refB
     */
    remove(refB) {

    }
}


let tGetter = 0;

function initParser() {
    depParser = new DepParser({});

    parser = new FormulaParser({
        onCell: ref => {
            let val = null;
            const sheet = wb.sheet(ref.sheet);
            if (sheet.hasCell(ref.row, ref.col)) {
                val = sheet.getCell(ref.row, ref.col).getValue();
            }

            // console.log(`Get cell ${val}`);
            return val == null ? undefined : val;
        },
        onRange: ref => {
            const arr = [];
            const sheet = wb.sheet(ref.sheet);

            // whole column
            if (ref.to.row === MAX_ROW) {
                sheet._rows.forEach((row, rowNumber) => {
                    const cellValue = row.cell(ref.from.row)._value;
                    arr[rowNumber] = [cellValue == null ? null : cellValue];
                });
            } else if (ref.to.col === MAX_COLUMN) {
                // whole row
                arr.push([]);
                sheet._rows.get(ref.from.row).forEach(cell => {
                    arr[0].push(cell._value == null ? null : cell._value);
                });
            } else {
                const sheet = wb.sheet(ref.sheet);

                for (let row = ref.from.row; row <= ref.to.row; row++) {
                    const innerArr = [];

                    // row exists
                    if (sheet._rows.has(row)) {
                        for (let col = ref.from.col; col <= ref.to.col; col++) {
                            const cell = sheet._rows.get(row)._cells.get(col);
                            if (cell != null) {
                                innerArr[col - 1] = cell._value;
                            }
                        }
                    }
                    arr.push(innerArr);
                }
            }
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
    workbook.sheets().forEach(sheet => sheetNames.push(sheet.name()));
    workbook.sheets().forEach((sheet, sheetNo) => {
        const sharedFormulas = [];
        sheet._rows.forEach((row, rowNumber) => {
            // const rowStyle = styles[rowNumber - 1] = {};
            row._cells.forEach((cell, colNumber) => {
                // process cell data
                let formula = (cell._formulaType === "shared" && !cell._formulaRef) ? "SHARED" : cell._formula;
                if (typeof formula === 'string') {
                    // this is the parent shared formula
                    if (formula !== 'SHARED' && cell._sharedFormulaId !== undefined) {
                        sharedFormulas[cell._sharedFormulaId] = cell;
                    } else if (formula === 'SHARED') {
                        // convert this cell to normal formula
                        const refCell = sharedFormulas[cell._sharedFormulaId];
                        formula = getSharedFormula(cell, refCell);
                        const oldValue = cell._value;
                        cell.formula(formula)._value = oldValue;
                    }
                    formulas.push(formula);
                    // console.log(formula, `sheet: ${name}, row: ${rowNumber}, col: ${colNumber}`);
                    const position = {sheet: sheetNo, row: rowNumber, col: colNumber};
                    const res = parser.parse(formula, position);
                    // if (res.length > 0) {
                    //     res.forEach(refA => {
                    //         rt.add(refA, position);
                    //     })
                    // }

                }
            });
        });
    });
    console.log(`process formulas uses ${Date.now() - t}ms, with ${formulas.length} formulas, query data uses ${tGetter}ms`);
    t = Date.now();
    // get data
    // console.log(JSON.stringify(rt._data).length)
    const res = depParser.parse('SUM(B2:IF(TRUE, INDEX(A2:C6, 5, 2)))', {});
    console.log(res);
    console.log(`process formulas uses ${Date.now() - t}ms`);
}

rt = new ReferenceTable();
setTimeout(() => {
    t = Date.now();
    XlsxPopulate.fromFileAsync("./xlsx/test2.xlsx").then(something)
}, 0);


// 2019/4/9 20:00
// open workbook uses 1235ms
// process formulas uses 315450ms, with 26283 formulas.
// 2019/4/10 11:30
// process formulas uses 40779ms, with 26283 formulas, query data uses 38068ms
// process formulas uses 25822ms, with 26283 formulas, query data uses 23634ms
// process formulas uses 16857ms, with 26283 formulas, query data uses 15269ms
// process formulas uses 2358ms, with 26283 formulas, query data uses 1175ms

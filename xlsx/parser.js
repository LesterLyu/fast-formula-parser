const FormulaError = require('../formulas/error');
const {FormulaHelpers, Address} = require('../formulas/helpers');
const lexer = require('../grammar/lexing');
const Utils = require('../grammar/utils');
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

function initParser() {
    parser = new FormulaParser({
        onCell: ref => {
            const val = wb.sheet(ref.sheet).row(ref.row).cell(ref.col).value();
            // console.log(`Get cell ${val}`);
            return val;
        },
        onRange: ref => {
            const sheet = wb.sheet(ref.sheet);
            if (ref.to.row === MAX_ROW) {
                sheet._rows.forEach((row, rowNumber) => {

                })
            }
            const arr = [];
            for (let row = ref.from.row - 1; row < ref.to.row; row++) {
                const innerArr = [];
                for (let col = ref.from.col - 1; col < ref.to.col; col++) {
                    innerArr.push(wb.sheet(ref.sheet).row(ref.row + 1).cell(ref.col + 1).value())
                }
                arr.push(innerArr);
            }
            // console.log(`Get cell ${arr}`);
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
    workbook.sheets().forEach(sheet => {
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
                    console.log(formula, `sheet: ${name}, row: ${rowNumber}, col: ${colNumber}`);
                    cell._value = parser.parse(formula, {sheet: name, row: rowNumber, col: colNumber})
                }
            });
        });
    });
    console.log(`process formulas uses ${Date.now() - t}ms, with ${formulas.length} formulas.`);

}


XlsxPopulate.fromFileAsync("./xlsx/test.xlsx").then(something);

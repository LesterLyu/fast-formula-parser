const chai = require('chai');
const expect = require('chai').expect;
const {FormulaParser} = require('../../grammar/hooks');
const {DepParser} = require('../../grammar/dependency/hooks');

const parser = new FormulaParser();
const depParser = new DepParser();
const position = {row: 1, col: 1, sheet: 'Sheet1'};

describe('Dependency parser', () => {
    it('should parse single cell', () => {
        let actual = depParser.parse('A1', position);
        expect(actual).to.deep.eq([Object.assign({address: 'A1'}, position)]);
        actual = depParser.parse('A1+1', position);
        expect(actual).to.deep.eq([Object.assign({address: 'A1'}, position)]);
    });

    it('should parse complex formula', () => {
        let actual = depParser.parse('IF(MONTH($K$1)<>MONTH($K$1-(WEEKDAY($K$1,1)-(start_day-1))-IF((WEEKDAY($K$1,1)-(start_day-1))<=0,7,0)+(ROW(O5)-ROW($K$3))*7+(COLUMN(O5)-COLUMN($K$3)+1)),"",$K$1-(WEEKDAY($K$1,1)-(start_day-1))-IF((WEEKDAY($K$1,1)-(start_day-1))<=0,7,0)+(ROW(O5)-ROW($K$3))*7+(COLUMN(O5)-COLUMN($K$3)+1))', position);
        expect(actual).to.deep.eq([
            {
                "address": "$K$1",
                "col": 11,
                "row": 1,
                "sheet": "Sheet1",
            },
            {
                "address": "O5",
                "col": 15,
                "row": 5,
                "sheet": "Sheet1",
            },
            {
                "address": "$K$3",
                "col": 11,
                "row": 3,
                "sheet": "Sheet1",
            }
        ]);
    });

});

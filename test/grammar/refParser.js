const expect = require('chai').expect;
const {RefParser} = require('../../grammar/references/hooks');

const refParser = new RefParser();
const position = {row: 1, col: 1, sheet: 'Sheet1'};

describe('References parser', () => {
    it('parse SUM(1,)', () => {
        let actual = refParser.parse('SUM(1,)', position);
        expect(actual).to.deep.eq([]);
    });

    it('should parse single cell', () => {
        let actual = refParser.parse('A1', position);
        expect(actual).to.deep.eq([{
            type: 'cell',
            cellAddress: 'A1',
            col: {
              col: 'A',
              endOffset: 0,
              startOffset: 0,
            },
            endOffset: 1,
            ref: {
              col: 1,
              row: 1,
            },
            row: {
              row: 1,
              endOffset: 1,
              startOffset: 1,
            },
            startOffset: 0,
        }]);
        actual = refParser.parse('A1+1', position);
        expect(actual).to.deep.eq([{
            type: 'cell',
            cellAddress: 'A1',
            col: {
              col: 'A',
              endOffset: 0,
              startOffset: 0,
            },
            endOffset: 1,
            ref: {
              col: 1,
              row: 1,
            },
            row: {
              row: 1,
              endOffset: 1,
              startOffset: 1,
            },
            startOffset: 0,
        }]);
    });

    it('should parse the same cell/range multiple times', () => {
        let actual = refParser.parse('A1+A1+A1', position);
        expect(actual).to.deep.eq([{
            "cellAddress": "A1",
            "col": {
                "col": "A",
                "endOffset": 0,
                "startOffset": 0,
            },
            "endOffset": 1,
            "ref": {
                "col": 1,
                "row": 1,
            },
            "row": {
                "endOffset": 1,
                "row": 1,
                "startOffset": 1,
            },
            "startOffset": 0,
            "type": "cell",
        }, {
            "cellAddress": "A1",
            "col": {
                "col": "A",
                "endOffset": 3,
                "startOffset": 3,
            },
            "endOffset": 4,
            "ref": {
                "col": 1,
                "row": 1,
            },
            "row": {
                "endOffset": 4,
                "row": 1,
                "startOffset": 4,
            },
            "startOffset": 3,
            "type": "cell",
        }, {
            "cellAddress": "A1",
            "col": {
                "col": "A",
                "endOffset": 6,
                "startOffset": 6,
            },
            "endOffset": 7,
            "ref": {
                "col": 1,
                "row": 1,
            },
            "row": {
                "endOffset": 7,
                "row": 1,
                "startOffset": 7,
            },
            "startOffset": 6,
            "type": "cell",
        }]);
        actual = refParser.parse('A1:C3+A1:C3+A1:C3', position);
        expect(actual).to.deep.eq([{
            "cellAddress": "A1",
            "col": {
                "col": "A",
                "endOffset": 0,
                "startOffset": 0,
            },
            "endOffset": 1,
            "ref": {
                "col": 1,
                "row": 1,
            },
            "row": {
                "endOffset": 1,
                "row": 1,
                "startOffset": 1,
            },
            "startOffset": 0,
            "type": "cell",
        }, {
            "cellAddress": "C3",
            "col": {
                "col": "C",
                "endOffset": 3,
                "startOffset": 3,
            },
            "endOffset": 4,
            "ref": {
                "col": 3,
                "row": 3,
            },
            "row": {
                "endOffset": 4,
                "row": 3,
                "startOffset": 4,
            },
            "startOffset": 3,
            "type": "cell",
        }, {
            "cellAddress": "A1",
            "col": {
                "col": "A",
                "endOffset": 6,
                "startOffset": 6,
            },
            "endOffset": 7,
            "ref": {
                "col": 1,
                "row": 1,
            },
            "row": {
                "endOffset": 7,
                "row": 1,
                "startOffset": 7,
            },
            "startOffset": 6,
            "type": "cell",
        }, {
            "cellAddress": "C3",
            "col": {
                "col": "C",
                "endOffset": 9,
                "startOffset": 9,
            },
            "endOffset": 10,
            "ref": {
                "col": 3,
                "row": 3,
            },
            "row": {
                "endOffset": 10,
                "row": 3,
                "startOffset": 10,
            },
            "startOffset": 9,
            "type": "cell",
        }, {
            "cellAddress": "A1",
            "col": {
                "col": "A",
                "endOffset": 12,
                "startOffset": 12,
            },
            "endOffset": 13,
            "ref": {
                "col": 1,
                "row": 1,
            },
            "row": {
                "endOffset": 13,
                "row": 1,
                "startOffset": 13,
            },
            "startOffset": 12,
            "type": "cell",
        }, {
            "cellAddress": "C3",
            "col": {
                "col": "C",
                "endOffset": 15,
                "startOffset": 15,
            },
            "endOffset": 16,
            "ref": {
                "col": 3,
                "row": 3,
            },
            "row": {
                "endOffset": 16,
                "row": 3,
                "startOffset": 16,
            },
            "startOffset": 15,
            "type": "cell",
        }]);

        actual = refParser.parse('A1:C3+A1:C3+A1:C3+A1+B1', position);
        expect(actual).to.deep.eq([{
            "cellAddress": "A1",
            "col": {
                "col": "A",
                "endOffset": 0,
                "startOffset": 0,
            },
            "endOffset": 1,
            "ref": {
                "col": 1,
                "row": 1,
            },
            "row": {
                "endOffset": 1,
                "row": 1,
                "startOffset": 1,
            },
            "startOffset": 0,
            "type": "cell",
        }, {
            "cellAddress": "C3",
            "col": {
                "col": "C",
                "endOffset": 3,
                "startOffset": 3,
            },
            "endOffset": 4,
            "ref": {
                "col": 3,
                "row": 3,
            },
            "row": {
                "endOffset": 4,
                "row": 3,
                "startOffset": 4,
            },
            "startOffset": 3,
            "type": "cell",
        }, {
            "cellAddress": "A1",
            "col": {
                "col": "A",
                "endOffset": 6,
                "startOffset": 6,
            },
            "endOffset": 7,
            "ref": {
                "col": 1,
                "row": 1,
            },
            "row": {
                "endOffset": 7,
                "row": 1,
                "startOffset": 7,
            },
            "startOffset": 6,
            "type": "cell",
        }, {
            "cellAddress": "C3",
            "col": {
                "col": "C",
                "endOffset": 9,
                "startOffset": 9,
            },
            "endOffset": 10,
            "ref": {
                "col": 3,
                "row": 3,
            },
            "row": {
                "endOffset": 10,
                "row": 3,
                "startOffset": 10,
            },
            "startOffset": 9,
            "type": "cell",
        }, {
            "cellAddress": "A1",
            "col": {
                "col": "A",
                "endOffset": 12,
                "startOffset": 12,
            },
            "endOffset": 13,
            "ref": {
                "col": 1,
                "row": 1,
            },
            "row": {
                "endOffset": 13,
                "row": 1,
                "startOffset": 13,
            },
            "startOffset": 12,
            "type": "cell",
        }, {
            "cellAddress": "C3",
            "col": {
                "col": "C",
                "endOffset": 15,
                "startOffset": 15,
            },
            "endOffset": 16,
            "ref": {
                "col": 3,
                "row": 3,
            },
            "row": {
                "endOffset": 16,
                "row": 3,
                "startOffset": 16,
            },
            "startOffset": 15,
            "type": "cell",
        }, {
            "cellAddress": "A1",
            "col": {
                "col": "A",
                "endOffset": 18,
                "startOffset": 18,
            },
            "endOffset": 19,
            "ref": {
                "col": 1,
                "row": 1,
            },
            "row": {
                "endOffset": 19,
                "row": 1,
                "startOffset": 19,
            },
            "startOffset": 18,
            "type": "cell",
        }, {
            "cellAddress": "B1",
            "col": {
                "col": "B",
                "endOffset": 21,
                "startOffset": 21,
            },
            "endOffset": 22,
            "ref": {
                "col": 2,
                "row": 1,
            },
            "row": {
                "endOffset": 22,
                "row": 1,
                "startOffset": 22,
            },
            "startOffset": 21,
            "type": "cell",
        }]);
    });

    it('should parse ranges', () => {
        let actual = refParser.parse('A1:C3', position);
        expect(actual).to.deep.eq([{
            "cellAddress": "A1",
            "col": {
                "col": "A",
                "endOffset": 0,
                "startOffset": 0,
            },
            "endOffset": 1,
            "ref": {
                "col": 1,
                "row": 1,
            },
            "row": {
                "endOffset": 1,
                "row": 1,
                "startOffset": 1,
            },
            "startOffset": 0,
            "type": "cell",
        }, {
            "cellAddress": "C3",
            "col": {
                "col": "C",
                "endOffset": 3,
                "startOffset": 3,
            },
            "endOffset": 4,
            "ref": {
                "col": 3,
                "row": 3,
            },
            "row": {
                "endOffset": 4,
                "row": 3,
                "startOffset": 4,
            },
            "startOffset": 3,
            "type": "cell",
        }]);
        actual = refParser.parse('A:C', position);
        expect(actual).to.deep.eq([{
            "col": "A",
            "endOffset": 0,
            "ref": {
                "col": 1,
                "row": undefined,
            },
            "startOffset": 0,
            "type": "col",
        }, {
            "col": "C",
            "endOffset": 2,
            "ref": {
                "col": 3,
                "row": undefined,
            },
            "startOffset": 2,
            "type": "col",
        }]);
        actual = refParser.parse('1:3', position);
        expect(actual).to.deep.eq([{
            "endOffset": 0,
            "ref": {
                "col": undefined,
                "row": 1,
            },
            "row": 1,
            "startOffset": 0,
            "type": "row",
        }, {
            "endOffset": 2,
            "ref": {
                "col": undefined,
                "row": 3,
            },
            "row": 3,
            "startOffset": 2,
            "type": "row",
        }]);
    });

    it('should parse variable', function () {
        let actual = refParser.parse('aaaa', position);
        expect(actual).to.deep.eq([{
            "endOffset": 3,
            "name": "aaaa",
            "startOffset": 0,
            "type": "variable",
        }]);
    });

    it('should parse basic formulas', function () {

        // data types
        let actual = refParser.parse('TRUE+A1+#VALUE!+{1}', position);
        expect(actual).to.deep.eq([{
            "cellAddress": "A1",
            "col": {
                "col": "A",
                "endOffset": 5,
                "startOffset": 5,
            },
            "endOffset": 6,
            "ref": {
                "col": 1,
                "row": 1,
            },
            "row": {
                "endOffset": 6,
                "row": 1,
                "startOffset": 6,
            },
            "startOffset": 5,
            "type": "cell",
        }]);

        // function without args
        actual = refParser.parse('A1+FUN()', position);
        expect(actual).to.deep.eq([{
            "cellAddress": "A1",
            "col": {
                "col": "A",
                "endOffset": 0,
                "startOffset": 0,
            },
            "endOffset": 1,
            "ref": {
                "col": 1,
                "row": 1,
            },
            "row": {
                "endOffset": 1,
                "row": 1,
                "startOffset": 1,
            },
            "startOffset": 0,
            "type": "cell",
        }]);

        // prefix
        actual = refParser.parse('++A1', position);
        expect(actual).to.deep.eq([{
            "cellAddress": "A1",
            "col": {
                "col": "A",
                "endOffset": 2,
                "startOffset": 2,
            },
            "endOffset": 3,
            "ref": {
                "col": 1,
                "row": 1,
            },
            "row": {
                "endOffset": 3,
                "row": 1,
                "startOffset": 3,
            },
            "startOffset": 2,
            "type": "cell",
        }]);

        // postfix
        actual = refParser.parse('A1%', position);
        expect(actual).to.deep.eq([{
            "cellAddress": "A1",
            "col": {
                "col": "A",
                "endOffset": 0,
                "startOffset": 0,
            },
            "endOffset": 1,
            "ref": {
                "col": 1,
                "row": 1,
            },
            "row": {
                "endOffset": 1,
                "row": 1,
                "startOffset": 1,
            },
            "startOffset": 0,
            "type": "cell",
        }]);

        // intersect
        actual = refParser.parse('A1:A3 A3:B3', position);
        expect(actual).to.deep.eq([ {
            "cellAddress": "A1",
            "col": {
                "col": "A",
                "endOffset": 0,
                "startOffset": 0,
            },
            "endOffset": 1,
            "ref": {
                "col": 1,
                "row": 1,
            },
            "row": {
                "endOffset": 1,
                "row": 1,
                "startOffset": 1,
            },
            "startOffset": 0,
            "type": "cell",
        }, {
            "cellAddress": "A3",
            "col": {
                "col": "A",
                "endOffset": 3,
                "startOffset": 3,
            },
            "endOffset": 4,
            "ref": {
                "col": 1,
                "row": 3,
            },
            "row": {
                "endOffset": 4,
                "row": 3,
                "startOffset": 4,
            },
            "startOffset": 3,
            "type": "cell",
        }, {
            "cellAddress": "A3",
            "col": {
                "col": "A",
                "endOffset": 6,
                "startOffset": 6,
            },
            "endOffset": 7,
            "ref": {
                "col": 1,
                "row": 3,
            },
            "row": {
                "endOffset": 7,
                "row": 3,
                "startOffset": 7,
            },
            "startOffset": 6,
            "type": "cell",
        }, {
            "cellAddress": "B3",
            "col": {
                "col": "B",
                "endOffset": 9,
                "startOffset": 9,
            },
            "endOffset": 10,
            "ref": {
                "col": 2,
                "row": 3,
            },
            "row": {
                "endOffset": 10,
                "row": 3,
                "startOffset": 10,
            },
            "startOffset": 9,
            "type": "cell",
        }]);

        // union
        actual = refParser.parse('(A1:C1, A2:E9)', position);
        expect(actual).to.deep.eq([{
            "cellAddress": "A1",
            "col": {
                "col": "A",
                "endOffset": 1,
                "startOffset": 1,
            },
            "endOffset": 2,
            "ref": {
                "col": 1,
                "row": 1,
            },
            "row": {
                "endOffset": 2,
                "row": 1,
                "startOffset": 2,
            },
            "startOffset": 1,
            "type": "cell",
        }, {
            "cellAddress": "C1",
            "col": {
                "col": "C",
                "endOffset": 4,
                "startOffset": 4,
            },
            "endOffset": 5,
            "ref": {
                "col": 3,
                "row": 1,
            },
            "row": {
                "endOffset": 5,
                "row": 1,
                "startOffset": 5,
            },
            "startOffset": 4,
            "type": "cell",
        }, {
            "cellAddress": "A2",
            "col": {
                "col": "A",
                "endOffset": 8,
                "startOffset": 8,
            },
            "endOffset": 9,
            "ref": {
                "col": 1,
                "row": 2,
            },
            "row": {
                "endOffset": 9,
                "row": 2,
                "startOffset": 9,
            },
            "startOffset": 8,
            "type": "cell",
        }, {
            "cellAddress": "E9",
            "col": {
                "col": "E",
                "endOffset": 11,
                "startOffset": 11,
            },
            "endOffset": 12,
            "ref": {
                "col": 5,
                "row": 9,
            },
            "row": {
                "endOffset": 12,
                "row": 9,
                "startOffset": 12,
            },
            "startOffset": 11,
            "type": "cell",
        }]);
    });

    it('should parse complex formula', () => {
        let actual = refParser.parse('IF(MONTH($K$1)<>MONTH($K$1-(WEEKDAY($K$1,1)-(start_day-1))-IF((WEEKDAY($K$1,1)-(start_day-1))<=0,7,0)+(ROW(O5)-ROW($K$3))*7+(COLUMN(O5)-COLUMN($K$3)+1)),"",$K$1-(WEEKDAY($K$1,1)-(start_day-1))-IF((WEEKDAY($K$1,1)-(start_day-1))<=0,7,0)+(ROW(O5)-ROW($K$3))*7+(COLUMN(O5)-COLUMN($K$3)+1))', position);
        expect(actual).to.deep.eq([{
            "cellAddress": "$K$1",
            "col": {
                "col": "K",
                "endOffset": 10,
                "startOffset": 10,
            },
            "endOffset": 12,
            "ref": {
                "col": 11,
                "row": 1,
            },
            "row": {
                "endOffset": 12,
                "row": 1,
                "startOffset": 12,
            },
            "startOffset": 9,
            "type": "cell",
        }, {
            "cellAddress": "$K$1",
            "col": {
                "col": "K",
                "endOffset": 23,
                "startOffset": 23,
            },
            "endOffset": 25,
            "ref": {
                "col": 11,
                "row": 1,
            },
            "row": {
                "endOffset": 25,
                "row": 1,
                "startOffset": 25,
            },
            "startOffset": 22,
            "type": "cell",
        }, {
            "cellAddress": "$K$1",
            "col": {
                "col": "K",
                "endOffset": 37,
                "startOffset": 37,
            },
            "endOffset": 39,
            "ref": {
                "col": 11,
                "row": 1,
            },
            "row": {
                "endOffset": 39,
                "row": 1,
                "startOffset": 39,
            },
            "startOffset": 36,
            "type": "cell",
        }, {
            "endOffset": 53,
            "name": "start_day",
            "startOffset": 45,
            "type": "variable",
        }, {
            "cellAddress": "$K$1",
            "col": {
                "col": "K",
                "endOffset": 72,
                "startOffset": 72,
            },
            "endOffset": 74,
            "ref": {
                "col": 11,
                "row": 1,
            },
            "row": {
                "endOffset": 74,
                "row": 1,
                "startOffset": 74,
            },
            "startOffset": 71,
            "type": "cell",
        }, {
            "endOffset": 88,
            "name": "start_day",
            "startOffset": 80,
            "type": "variable",
        }, {
            "cellAddress": "O5",
            "col": {
                "col": "O",
                "endOffset": 107,
                "startOffset": 107,
            },
            "endOffset": 108,
            "ref": {
                "col": 15,
                "row": 5,
            },
            "row": {
                "endOffset": 108,
                "row": 5,
                "startOffset": 108,
            },
            "startOffset": 107,
            "type": "cell",
        }, {
            "cellAddress": "$K$3",
            "col": {
                "col": "K",
                "endOffset": 116,
                "startOffset": 116,
            },
            "endOffset": 118,
            "ref": {
                "col": 11,
                "row": 3,
            },
            "row": {
                "endOffset": 118,
                "row": 3,
                "startOffset": 118,
            },
            "startOffset": 115,
            "type": "cell",
        }, {
            "cellAddress": "O5",
            "col": {
                "col": "O",
                "endOffset": 132,
                "startOffset": 132,
            },
            "endOffset": 133,
            "ref": {
                "col": 15,
                "row": 5,
            },
            "row": {
                "endOffset": 133,
                "row": 5,
                "startOffset": 133,
            },
            "startOffset": 132,
            "type": "cell",
        }, {
            "cellAddress": "$K$3",
            "col": {
                "col": "K",
                "endOffset": 144,
                "startOffset": 144,
            },
            "endOffset": 146,
            "ref": {
                "col": 11,
                "row": 3,
            },
            "row": {
                "endOffset": 146,
                "row": 3,
                "startOffset": 146,
            },
            "startOffset": 143,
            "type": "cell",
        }, {
            "cellAddress": "$K$1",
            "col": {
                "col": "K",
                "endOffset": 157,
                "startOffset": 157,
            },
            "endOffset": 159,
            "ref": {
                "col": 11,
                "row": 1,
            },
            "row": {
                "endOffset": 159,
                "row": 1,
                "startOffset": 159,
            },
            "startOffset": 156,
            "type": "cell",
        }, {
            "cellAddress": "$K$1",
            "col": {
                "col": "K",
                "endOffset": 171,
                "startOffset": 171,
            },
            "endOffset": 173,
            "ref": {
                "col": 11,
                "row": 1,
            },
            "row": {
                "endOffset": 173,
                "row": 1,
                "startOffset": 173,
            },
            "startOffset": 170,
            "type": "cell",
        }, {
            "endOffset": 187,
            "name": "start_day",
            "startOffset": 179,
            "type": "variable",
        }, {
            "cellAddress": "$K$1",
            "col": {
                "col": "K",
                "endOffset": 206,
                "startOffset": 206,
            },
            "endOffset": 208,
            "ref": {
                "col": 11,
                "row": 1,
            },
            "row": {
                "endOffset": 208,
                "row": 1,
                "startOffset": 208,
            },
            "startOffset": 205,
            "type": "cell",
        }, {
            "endOffset": 222,
            "name": "start_day",
            "startOffset": 214,
            "type": "variable",
        }, {
            "cellAddress": "O5",
            "col": {
                "col": "O",
                "endOffset": 241,
                "startOffset": 241,
            },
            "endOffset": 242,
            "ref": {
                "col": 15,
                "row": 5,
            },
            "row": {
                "endOffset": 242,
                "row": 5,
                "startOffset": 242,
            },
            "startOffset": 241,
            "type": "cell",
        }, {
            "cellAddress": "$K$3",
            "col": {
                "col": "K",
                "endOffset": 250,
                "startOffset": 250,
            },
            "endOffset": 252,
            "ref": {
                "col": 11,
                "row": 3,
            },
            "row": {
                "endOffset": 252,
                "row": 3,
                "startOffset": 252,
            },
            "startOffset": 249,
            "type": "cell",
        }, {
            "cellAddress": "O5",
            "col": {
                "col": "O",
                "endOffset": 266,
                "startOffset": 266,
            },
            "endOffset": 267,
            "ref": {
                "col": 15,
                "row": 5,
            },
            "row": {
                "endOffset": 267,
                "row": 5,
                "startOffset": 267,
            },
            "startOffset": 266,
            "type": "cell",
        }, {
            "cellAddress": "$K$3",
            "col": {
                "col": "K",
                "endOffset": 278,
                "startOffset": 278,
            },
            "endOffset": 280,
            "ref": {
                "col": 11,
                "row": 3,
            },
            "row": {
                "endOffset": 280,
                "row": 3,
                "startOffset": 280,
            },
            "startOffset": 277,
            "type": "cell",
        }]);
    });


    const script_A_to_X_1_to_100 = [ { type: 'col', from: 1, to: 24, }, { type: 'row', from: 1, to: 100, } ];
    const script_A1_to_X100 = [ { type: 'cell', from: { col: 1, row: 1, }, to: { col: 24, row: 100, } } ];
    const script_aaaa_to_bbbbb = [ { type: 'variable', from: 'aaaa', to: 'bbbbb' } ];
    const script_start_day_to_first_day = [ { type: 'variable', from: 'start_day', to: 'first_day' } ];

    it('should replace single cell', () => {
        let actual = refParser.replace('A1', position, script_A_to_X_1_to_100);
        expect(actual).to.eq('X100');
        actual = refParser.replace('A1', position, script_A1_to_X100);
        expect(actual).to.eq('X100');
        actual = refParser.replace('A1+1', position, script_A_to_X_1_to_100);
        expect(actual).to.eq('X100+1');
        actual = refParser.replace('A1+1', position, script_A1_to_X100);
        expect(actual).to.eq('X100+1');
    });

    it('should replace the same cell/range multiple times', () => {
        let actual = refParser.replace('A1+A1+A1', position, script_A_to_X_1_to_100);
        expect(actual).to.eq('X100+X100+X100');
        actual = refParser.replace('A1+A1+A1', position, script_A1_to_X100);
        expect(actual).to.eq('X100+X100+X100');

        actual = refParser.replace('A1:C3+A1:C3+A1:C3', position, script_A_to_X_1_to_100);
        expect(actual).to.eq('X100:C3+X100:C3+X100:C3');
        actual = refParser.replace('A1:C3+A1:C3+A1:C3', position, script_A1_to_X100);
        expect(actual).to.eq('X100:C3+X100:C3+X100:C3');

        actual = refParser.replace('A1:C3+A1:C3+A1:C3+A1+B1', position, script_A_to_X_1_to_100);
        expect(actual).to.eq('X100:C3+X100:C3+X100:C3+X100+B100');
        actual = refParser.replace('A1:C3+A1:C3+A1:C3+A1+B1', position, script_A1_to_X100);
        expect(actual).to.eq('X100:C3+X100:C3+X100:C3+X100+B1');
    });

    it('should replace ranges', () => {
        let actual = refParser.replace('A1:C3', position, script_A_to_X_1_to_100);
        expect(actual).to.eq('X100:C3');
        actual = refParser.replace('A1:C3', position, script_A1_to_X100);
        expect(actual).to.eq('X100:C3');

        actual = refParser.replace('A:C', position, script_A_to_X_1_to_100);
        expect(actual).to.eq('X:C');
        actual = refParser.replace('A:C', position, script_A1_to_X100);
        expect(actual).to.eq('A:C');

        actual = refParser.replace('1:3', position, script_A_to_X_1_to_100);
        expect(actual).to.eq('100:3');
        actual = refParser.replace('1:3', position, script_A1_to_X100);
        expect(actual).to.eq('1:3');
    });

    it('should replace variable', function () {
        let actual = refParser.replace('aaaa', position, script_aaaa_to_bbbbb);
        expect(actual).to.eq('bbbbb');
    });

    it('should replace basic formulas', function () {

        // data types
        let actual = refParser.replace('TRUE+A1+#VALUE!+{1}', position, script_A_to_X_1_to_100);
        expect(actual).to.eq('TRUE+X100+#VALUE!+{1}');
        actual = refParser.replace('TRUE+A1+#VALUE!+{1}', position, script_A1_to_X100);
        expect(actual).to.eq('TRUE+X100+#VALUE!+{1}');

        // function without args
        actual = refParser.replace('A1+FUN()', position, script_A_to_X_1_to_100);
        expect(actual).to.eq('X100+FUN()');
        actual = refParser.replace('A1+FUN()', position, script_A1_to_X100);
        expect(actual).to.eq('X100+FUN()');

        // prefix
        actual = refParser.replace('++A1', position, script_A_to_X_1_to_100);
        expect(actual).to.eq('++X100');
        actual = refParser.replace('++A1', position, script_A1_to_X100);
        expect(actual).to.eq('++X100');

        // postfix
        actual = refParser.replace('A1%', position, script_A_to_X_1_to_100);
        expect(actual).to.eq('X100%');
        actual = refParser.replace('A1%', position, script_A1_to_X100);
        expect(actual).to.eq('X100%');

        // intersect
        actual = refParser.replace('A1:A3 A3:B3', position, script_A_to_X_1_to_100);
        expect(actual).to.eq('X100:X3 X3:B3');
        actual = refParser.replace('A1:A3 A3:B3', position, script_A1_to_X100);
        expect(actual).to.eq('X100:A3 A3:B3');

        // union
        actual = refParser.replace('(A1:C1, A2:E9)', position, script_A_to_X_1_to_100);
        expect(actual).to.eq('(X100:C100, X2:E9)');
        actual = refParser.replace('(A1:C1, A2:E9)', position, script_A1_to_X100);
        expect(actual).to.eq('(X100:C1, A2:E9)');
    });

    it('should replace complex formula', () => {
        let actual = refParser.replace('IF(MONTH($K$1)<>MONTH($K$1-(WEEKDAY($K$1,1)-(start_day-1))-IF((WEEKDAY($K$1,1)-(start_day-1))<=0,7,0)+(ROW(O5)-ROW($K$3))*7+(COLUMN(O5)-COLUMN($K$3)+1)),"",$K$1-(WEEKDAY($K$1,1)-(start_day-1))-IF((WEEKDAY($K$1,1)-(start_day-1))<=0,7,0)+(ROW(O5)-ROW($K$3))*7+(COLUMN(O5)-COLUMN($K$3)+1))', position, [...script_A_to_X_1_to_100, ...script_start_day_to_first_day]);
        expect(actual).to.eq('IF(MONTH($K$100)<>MONTH($K$100-(WEEKDAY($K$100,1)-(first_day-1))-IF((WEEKDAY($K$100,1)-(first_day-1))<=0,7,0)+(ROW(O5)-ROW($K$3))*7+(COLUMN(O5)-COLUMN($K$3)+1)),"",$K$100-(WEEKDAY($K$100,1)-(first_day-1))-IF((WEEKDAY($K$100,1)-(first_day-1))<=0,7,0)+(ROW(O5)-ROW($K$3))*7+(COLUMN(O5)-COLUMN($K$3)+1))');
        actual = refParser.replace('IF(MONTH($K$1)<>MONTH($K$1-(WEEKDAY($K$1,1)-(start_day-1))-IF((WEEKDAY($K$1,1)-(start_day-1))<=0,7,0)+(ROW(O5)-ROW($K$3))*7+(COLUMN(O5)-COLUMN($K$3)+1)),"",$K$1-(WEEKDAY($K$1,1)-(start_day-1))-IF((WEEKDAY($K$1,1)-(start_day-1))<=0,7,0)+(ROW(O5)-ROW($K$3))*7+(COLUMN(O5)-COLUMN($K$3)+1))', position, [...script_A1_to_X100, ...script_start_day_to_first_day]);
        expect(actual).to.eq('IF(MONTH($K$1)<>MONTH($K$1-(WEEKDAY($K$1,1)-(first_day-1))-IF((WEEKDAY($K$1,1)-(first_day-1))<=0,7,0)+(ROW(O5)-ROW($K$3))*7+(COLUMN(O5)-COLUMN($K$3)+1)),"",$K$1-(WEEKDAY($K$1,1)-(first_day-1))-IF((WEEKDAY($K$1,1)-(first_day-1))<=0,7,0)+(ROW(O5)-ROW($K$3))*7+(COLUMN(O5)-COLUMN($K$3)+1))');
    });
    
    it('should exchange columns', function () {
        let actual = refParser.replace('A1+AB28', position, [ { type: 'col', from: 1, to: 28, }, { type: 'col', from: 28, to: 1, } ]);
        expect(actual).to.eq('AB1+A28');
    });

    it('should exchange rows', function () {
        let actual = refParser.replace('A1+AB28', position, [ { type: 'row', from: 1, to: 28, }, { type: 'row', from: 28, to: 1, } ]);
        expect(actual).to.eq('A28+AB1');
    });

    it('should exchange cells', function () {
        let actual = refParser.replace('A1+AB28', position, [ { type: 'cell', from: { col: 1, row: 1, }, to: { col: 28, row: 28, } }, { type: 'cell', from: { col: 28, row: 28, }, to: { col: 1, row: 1, } } ]);
        expect(actual).to.eq('AB28+A1');
    });

    it('should exchange variables', function () {
        let actual = refParser.replace('aaaa+bbbbb', position, [ { type: 'variable', from: 'aaaa', to: 'bbbbb' }, { type: 'variable', from: 'bbbbb', to: 'aaaa' } ]);
        expect(actual).to.eq('bbbbb+aaaa');
    });

    it('should not throw error', function () {
        expect((() => refParser.parse('SUM(1))', position, true)))
            .to.not.throw();

        expect((() => refParser.parse('SUM(1+)', position, true)))
            .to.not.throw();

        expect((() => refParser.parse('SUM(1+)', position, true)))
            .to.not.throw();
    });
});


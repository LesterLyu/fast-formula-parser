
const { FormulaParser } = require('../../grammar/hooks');
const { expect } = require('chai');


const parser = new FormulaParser({
  onCell: (ref) => {
    return 1
  },
  onRange: () => {
    return [[1, 2]]
  },
  onStructuredReference: (tableName, columnName, thisRow, specialItem, sheet, position) => {
    if (thisRow || specialItem) {
      // Single cell
      return { row: 2, col: 2 }
    } else {
      // Full column
      return {
        sheet: 'Sheet 1',
        from: {
          row: 1,
          col: 1
        },
        to: {
          row: 10,
          col: 1
        }
      }
    }
  }
});

const position = { row: 1, col: 1, sheet: 'Sheet1' };

describe('Joins', function () {
  it('should parse join columns', async () => {
    let actual = await parser.parseAsync('Table Name[Join: Column Name]', position, true);
    expect(actual).to.deep.eq([[1, 2]]);
  });

});

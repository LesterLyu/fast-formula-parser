
const {FormulaParser} = require('../../grammar/hooks');
const FormulaError = require('../../formulas/error');
const { expect } = require('chai');


const parser = new FormulaParser({
    onCell: (ref) => {
      return 1
    },
    onRange: () => {
      return [[1, 2]]
    },
    onStructuredReference: (tableName, sheet, thisRow, position) => {
      if (thisRow) {
        // Single cell
        return {row: 2, col: 2}
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

const position = {row: 1, col: 1, sheet: 'Sheet1'};

describe('Structured References', function () {
  it('should parse table and column reference', async () => {
    let actual = await parser.parseAsync('TABLE[@COLUMN_NAME]', position, true);
    expect(actual).to.eq(1);
  });

  it('thisRow will be false', async () => {
    let actual = await parser.parseAsync('TABLE[COLUMN_NAME]', position, true);
    expect(actual).to.deep.eq([[1,2]]);
  });

  it('can detect columns without table', async () => {
    let actual = await parser.parseAsync('[@COLUMN_NAME]', position, true);
    expect(actual).to.deep.eq(1);
  });

  it('can detect columns without table', async () => {
    let actual = await parser.parseAsync('[@SalesAmount]*[@[Commission]]', position, true);
    expect(actual).to.deep.eq(1);
  });
});

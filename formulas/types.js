const Types = {
  NUMBER: 0,
  ARRAY: 1,
  BOOLEAN: 2,
  STRING: 3,
  RANGE_REF: 4, // can be 'A:C' or '1:4', not only 'A1:C3'
  CELL_REF: 5,
  COLLECTIONS: 6, // Unions of references
  NUMBER_NO_BOOLEAN: 10,
};

module.exports = {
  Types
}

class Reference {

    /**
     * @param {string|number} sheetNoOrName
     * @param {number} row
     * @param {number} col
     */
    constructor(sheetNoOrName, row, col) {
        if (typeof sheetNoOrName === "string") {
            this._sheetName = sheetNoOrName;
        } else {
            this._sheetNo = sheetNoOrName;
        }
        this._row = row;
        this._col = col;
    }

    isEqual(obj) {
        return obj instanceof Reference
            && (this._sheetName === obj._sheetName || this._sheetNo === obj._sheetNo)
            && this._row === obj._row && this._col === obj._col;
    }

}

module.exports = Reference;

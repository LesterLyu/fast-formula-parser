
module.exports = {
    /**
     * Parse the cell address only.
     * @param {string} cellAddress
     * @return {{col: string | *, address: string | *, isColAbsolute: boolean, isRowAbsolute: boolean, row: string | *}}
     */
    parseCellAddress: cellAddress => {
        const res = cellAddress.match(/([$]?)([A-Za-z]{1,4})([$]?)([1-9][0-9]*)/);
        console.log('parseCellAddress', cellAddress);
        return {
            address: res[0],
            isRowAbsolute: res[1].length !== 0,
            row: res[2],
            isColAbsolute: res[3].length !== 0,
            col: res[4]
        }
    }
};

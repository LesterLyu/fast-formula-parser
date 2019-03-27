
module.exports = {
    /**
     * Parse the cell address only.
     * @param {string} cellAddress
     * @return {{col: string | *, address: string | *, isColAbsolute: boolean, isRowAbsolute: boolean, row: string | *}}
     */
    parseCellAddress: cellAddress => {
        const res = cellAddress.match(/([$]?)([A-Za-z]{1,4})([$]?)([1-9][0-9]*)/);
        // console.log('parseCellAddress', cellAddress);
        return {
            address: res[0],
            isRowAbsolute: res[1].length !== 0,
            row: res[2],
            isColAbsolute: res[3].length !== 0,
            col: res[4]
        }
    },

    /**
     * Apply + or - unary prefix.
     * @param {Array.<string>} prefixes
     * @param {*} value
     * @return {*}
     */
    applyPrefix: (prefixes, value) => {
        // console.log('applyPrefix', prefixes, value);
        prefixes.forEach(prefix => {
            if (prefix === '+') {

            } else if (prefix === '-') {
                value = -value;
            } else {
                throw new Error(`Unrecognized prefix: ${prefix}`);
            }
        });
        return value;
        // TO-DO if value is 1D or 2D array
    }
};

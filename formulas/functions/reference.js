const FormulaError = require('../error');
const {FormulaHelpers, Types, WildCard, Address} = require('../helpers');
const Collection = require('../../grammar/type/collection');
const H = FormulaHelpers;

const ReferenceFunctions = {

    ADDRESS: (rowNumber, columnNumber, absNum, a1, sheetText) => {
        rowNumber = H.accept(rowNumber, Types.NUMBER);
        columnNumber = H.accept(columnNumber, Types.NUMBER);
        absNum = H.accept(absNum, Types.NUMBER, 1);
        a1 = H.accept(a1, Types.BOOLEAN, true);
        sheetText = H.accept(sheetText, Types.STRING, '');

        if (rowNumber < 1 || columnNumber < 1 || absNum < 1 || absNum > 4)
            throw FormulaError.VALUE;

        let result = '';
        if (sheetText.length > 0) {
            if (/[^A-Za-z_.\d\u007F-\uFFFF]/.test(sheetText)) {
                result += `'${sheetText}'!`;
            } else {
                result += sheetText + '!';
            }
        }
        if (a1) {
            // A1 style
            result += (absNum === 1 || absNum === 3) ? '$' : '';
            result += Address.columnNumberToName(columnNumber);
            result += (absNum === 1 || absNum === 2) ? '$' : '';
            result += rowNumber;
        } else {
            // R1C1 style
            result += 'R';
            result += (absNum === 4 || absNum === 3) ? `[${rowNumber}]` : rowNumber;
            result += 'C';
            result += (absNum === 4 || absNum === 2) ? `[${columnNumber}]` : columnNumber;
        }
        return result;
    },

    AREAS: refs => {
        refs = H.accept(refs);
        if (refs instanceof Collection) {
            return refs.length;
        }
        return 1;
    },

    CHOOSE: (indexNum, ...values) => {

    },

    // Special
    COLUMN: (context, obj) => {
        if (obj == null) {
            if (context.position.col != null)
                return context.position.col;
            else
                throw Error('FormulaParser.parse is called without position parameter.')
        } else {
            if (typeof obj !== 'object' || Array.isArray(obj))
                throw FormulaError.VALUE;
            if (H.isCellRef(obj)) {
                return obj.ref.col;
            } else if (H.isRangeRef(obj)) {
                return obj.ref.from.col;
            } else {
                throw Error('ReferenceFunctions.COLUMN should not reach here.')
            }
        }
    },

    // Special
    COLUMNS: (context, obj) => {
        if (obj == null) {
            throw Error('COLUMNS requires one argument');
        }
        if (typeof obj != 'object' || Array.isArray(obj))
            throw FormulaError.VALUE;
        if (H.isCellRef(obj)) {
            return 1;
        } else if (H.isRangeRef(obj)) {
            return Math.abs(obj.ref.from.col - obj.ref.to.col) + 1;
        } else {
            throw Error('ReferenceFunctions.COLUMNS should not reach here.')
        }
    },

    /***
     * @function FILTER: The FILTER function allows you to filter a range of data based on criteria you define.
     * @param lookup_value: the value being searched for
     * @param lookup_range: the array we look for lookup_value in
     * @param filter_range: the array of arrays where we will get our return rows from
     * @param default_value: the value returned if lookup_value is not found in lookup_range
     * Microsoft link: https://support.microsoft.com/en-us/office/filter-function-f4f7cb66-82eb-4767-8f7c-4877ad80c759
     ***/
    //Question: @TYLER
    //Not sure what this should return, B/c unlike other formulas, this one returns multiple rows.
    //For now it finds the rows which match lookup_value and returns the rows in lookup_range that match
    //it as an array of arrays
    //If this is correct, then I am not sure how to test it, see test cases for referance
    //Also, the Excel version has filter(..., lookup_range=lookup_value,...). I tried using the =
    //symbol in the test cases, but it looks to be incompatable with current archetecture, so I split it into
    //two parameters, 
    FILTER: (lookup_value, filter_range, lookup_range, default_value) =>{
        lookup_value = H.accept(lookup_value);
        filter_range = H.accept(filter_range, Types.ARRAY, null, false);
        lookup_range = H.accept(lookup_range, Types.ARRAY);
        default_value = H.accept(default_value);
        if(filter_range.length != lookup_range.length){
            throw FormulaError.VALUE;
        }
        
        let filtered_Array = [];
        for(let index = 0; index < filter_range.length; index++){
            if(lookup_range[index] == lookup_value){
                filtered_Array.push(filter_range[index]);
            }
        }
        if(filtered_Array.length == 0){
            return default_value;
        }
        console.log(filtered_Array)
        return filtered_Array;
        
    },

    HLOOKUP: (lookupValue, tableArray, rowIndexNum, rangeLookup) => {
        // preserve type of lookupValue
        lookupValue = H.accept(lookupValue);
        try {
            tableArray = H.accept(tableArray, Types.ARRAY, undefined, false);
        } catch (e) {
            // catch #VALUE! and throw #N/A
            if (e instanceof FormulaError)
                throw FormulaError.NA;
            throw e;
        }
        rowIndexNum = H.accept(rowIndexNum, Types.NUMBER);
        rangeLookup = H.accept(rangeLookup, Types.BOOLEAN, true);

        // check if rowIndexNum out of bound
        if (rowIndexNum < 1)
            throw FormulaError.VALUE;
        if (tableArray[rowIndexNum - 1] === undefined)
            throw FormulaError.REF;

        const lookupType = typeof lookupValue; // 'number', 'string', 'boolean'
        // approximate lookup (assume the array is sorted)
        if (rangeLookup) {
            let prevValue = lookupType === typeof tableArray[0][0] ? tableArray[0][0] : null;
            for (let i = 1; i < tableArray[0].length; i++) {
                const currValue = tableArray[0][i];
                const type = typeof currValue;
                // skip the value if type does not match
                if (type !== lookupType)
                    continue;
                // if the previous two values are greater than lookup value, throw #N/A
                if (prevValue > lookupValue && currValue > lookupValue) {
                    throw FormulaError.NA;
                }
                if (currValue === lookupValue)
                    return tableArray[rowIndexNum - 1][i];
                // if previous value <= lookup value and current value > lookup value
                if (prevValue != null && currValue > lookupValue && prevValue <= lookupValue) {
                    return tableArray[rowIndexNum - 1][i - 1];
                }
                prevValue = currValue;
            }
            if (prevValue == null)
                throw FormulaError.NA;
            if (tableArray[0].length === 1) {
                return tableArray[rowIndexNum - 1][0]
            }
            return prevValue;
        }
        // exact lookup with wildcard support
        else {
            let index = -1;
            if (WildCard.isWildCard(lookupValue)) {
                index = tableArray[0].findIndex(item => {
                    return WildCard.toRegex(lookupValue, 'i').test(item);
                });
            } else {
                index = tableArray[0].findIndex(item => {
                    return item === lookupValue;
                });
            }
            // the exact match is not found
            if (index === -1) throw FormulaError.NA;
            return tableArray[rowIndexNum - 1][index];
        }
    },

    // Special
    INDEX: (context, ranges, rowNum, colNum, areaNum) => {
        // retrieve values
        rowNum = context.utils.extractRefValue(rowNum);
        rowNum = {value: rowNum.val, isArray: rowNum.isArray};
        rowNum = H.accept(rowNum, Types.NUMBER);
        rowNum = Math.trunc(rowNum);

        if (colNum == null) {
            colNum = 1;
        } else {
            colNum = context.utils.extractRefValue(colNum);
            colNum = {value: colNum.val, isArray: colNum.isArray};
            colNum = H.accept(colNum, Types.NUMBER, 1);
            colNum = Math.trunc(colNum);
        }

        if (areaNum == null) {
            areaNum = 1;
        } else {
            areaNum = context.utils.extractRefValue(areaNum);
            areaNum = {value: areaNum.val, isArray: areaNum.isArray};
            areaNum = H.accept(areaNum, Types.NUMBER, 1);
            areaNum = Math.trunc(areaNum);
        }

        // get the range area that we want to index
        // ranges can be cell ref, range ref or array constant
        let range = ranges;
        // many ranges (Reference form)
        if (ranges instanceof Collection) {
            range = ranges.refs[areaNum - 1];
        } else if (areaNum > 1) {
            throw FormulaError.REF;
        }

        if (rowNum === 0 && colNum === 0) {
            return range;
        }

        // query the whole column
        if (rowNum === 0) {
            if (H.isRangeRef(range)) {
                if (range.ref.to.col - range.ref.from.col < colNum - 1)
                    throw FormulaError.REF;
                range.ref.from.col += colNum - 1;
                range.ref.to.col = range.ref.from.col;
                return range;
            } else if (Array.isArray(range)) {
                const res = [];
                range.forEach(row => res.push([row[colNum - 1]]));
                return res;
            }
        }
        // query the whole row
        if (colNum === 0) {
            if (H.isRangeRef(range)) {
                if (range.ref.to.row - range.ref.from.row < rowNum - 1)
                    throw FormulaError.REF;
                range.ref.from.row += rowNum - 1;
                range.ref.to.row =  range.ref.from.row;
                return range;
            } else if (Array.isArray(range)) {
                return range[colNum - 1];
            }
        }
        // query single cell
        if (rowNum !== 0 && colNum !== 0) {
            // range reference
            if (H.isRangeRef(range)) {
                range = range.ref;
                if (range.to.row - range.from.row < rowNum - 1 || range.to.col - range.from.col < colNum - 1)
                    throw FormulaError.REF;
                return {ref: {row: range.from.row + rowNum - 1, col: range.from.col + colNum - 1}};
            }
            // cell reference
            else if (H.isCellRef(range)) {
                range = range.ref;
                if (rowNum > 1 || colNum > 1)
                    throw FormulaError.REF;
                return {ref: {row: range.row + rowNum - 1, col: range.col + colNum - 1}};
            }
            // array constant
            else if (Array.isArray(range)) {
                if (range.length < rowNum || range[0].length < colNum)
                    throw FormulaError.REF;
                return range[rowNum - 1][colNum - 1];
            }
        }
    },

    MATCH: () => {

    },

    // Special
    ROW: (context, obj) => {
        if (obj == null) {
            if (context.position.row != null)
                return context.position.row;
            else
                throw Error('FormulaParser.parse is called without position parameter.')
        } else {
            if (typeof obj !== 'object' || Array.isArray(obj))
                throw FormulaError.VALUE;
            if (H.isCellRef(obj)) {
                return obj.ref.row;
            } else if (H.isRangeRef(obj)) {
                return obj.ref.from.row;
            } else {
                throw Error('ReferenceFunctions.ROW should not reach here.')
            }
        }
    },

    // Special
    ROWS: (context, obj) => {
        if (obj == null) {
            throw Error('ROWS requires one argument');
        }
        if (typeof obj != 'object' || Array.isArray(obj))
            throw FormulaError.VALUE;
        if (H.isCellRef(obj)) {
            return 1;
        } else if (H.isRangeRef(obj)) {
            return Math.abs(obj.ref.from.row - obj.ref.to.row) + 1;
        } else {
            throw Error('ReferenceFunctions.ROWS should not reach here.')
        }
    },

    TRANSPOSE: (array) => {
        array = H.accept(array, Types.ARRAY, undefined, false);
        // https://github.com/numbers/numbers.js/blob/master/lib/numbers/matrix.js#L171
        const result = [];

        for (let i = 0; i < array[0].length; i++) {
            result[i] = [];

            for (let j = 0; j < array.length; j++) {
                result[i][j] = array[j][i];
            }
        }

        return result;
    },

    VLOOKUP: (lookupValue, tableArray, colIndexNum, rangeLookup) => {
        // preserve type of lookupValue
        lookupValue = H.accept(lookupValue);
        try {
            tableArray = H.accept(tableArray, Types.ARRAY, undefined, false);
        } catch (e) {
            // catch #VALUE! and throw #N/A
            if (e instanceof FormulaError)
                throw FormulaError.NA;
            throw e;
        }
        colIndexNum = H.accept(colIndexNum, Types.NUMBER);
        rangeLookup = H.accept(rangeLookup, Types.BOOLEAN, true);

        // check if colIndexNum out of bound
        if (colIndexNum < 1)
            throw FormulaError.VALUE;
        if (tableArray[0][colIndexNum - 1] === undefined)
            throw FormulaError.REF;

        const lookupType = typeof lookupValue; // 'number', 'string', 'boolean'

        // approximate lookup (assume the array is sorted)
        if (rangeLookup) {
            let prevValue = lookupType === typeof tableArray[0][0] ? tableArray[0][0] : null;
            for (let i = 1; i < tableArray.length; i++) {
                const currRow = tableArray[i];
                const currValue = tableArray[i][0];
                const type = typeof currValue;
                // skip the value if type does not match
                if (type !== lookupType)
                    continue;
                // if the previous two values are greater than lookup value, throw #N/A
                if (prevValue > lookupValue && currValue > lookupValue) {
                    throw FormulaError.NA;
                }
                if (currValue === lookupValue)
                    return currRow[colIndexNum - 1];
                // if previous value <= lookup value and current value > lookup value
                if (prevValue != null && currValue > lookupValue && prevValue <= lookupValue) {
                    return tableArray[i - 1][colIndexNum - 1];
                }
                prevValue = currValue;
            }
            if (prevValue == null)
                throw FormulaError.NA;
            if (tableArray.length === 1) {
                return tableArray[0][colIndexNum - 1]
            }
            return prevValue;
        }
        // exact lookup with wildcard support
        else {
            let index = -1;
            if (WildCard.isWildCard(lookupValue)) {
                index = tableArray.findIndex(currRow => {
                    return WildCard.toRegex(lookupValue, 'i').test(currRow[0]);
                });
            } else {
                index = tableArray.findIndex(currRow => {
                    return currRow[0] === lookupValue;
                });
            }
            // the exact match is not found
            if (index === -1) throw FormulaError.NA;
            return tableArray[index][colIndexNum - 1];
        }
    },
    /***
     * @param lookup_value: the value we are looking for in our lookup_array
     * @param lookup_array: the array were we search for lookup_value
     * @param return_array: the array where our return value is
     * @param if_not_found: OPTIONAL default value if lookup_value is not found
     * @param match_mode: OPTIONAL:
     *                         0: If none found, return #N/A. This is the default
     *                         -1 - Exact match. If none found, return the next smaller item.
     *                          1 - Exact match. If none found, return the next larger item.
     *                          2 - A wildcard match where *, ?, and ~ have special meaning.
     * @param search_mode: OPTIONAL:
     *                          1 - Perform a search starting at the first item. This is the default.
     *                         -1 - Perform a reverse search starting at the last item.
     *                          2 - Perform a binary search that relies on lookup_array being sorted in ascending order. If not sorted, invalid results will be returned.
     *                         -2 - Perform a binary search that relies on lookup_array being sorted in descending order. If not sorted, invalid results will be returned.
     * Microsoft Link: https://support.microsoft.com/en-us/office/xlookup-function-b7fd680e-6d10-43e6-84f9-88eae8bf5929 
     ***/
    XLOOKUP: (lookup_value, lookup_array, return_array, if_not_found = null, match_mode = 0, search_mode = 1) => {
        console.log("New Stuff")
        console.log(if_not_found)
        if(lookup_array.length != return_array.length){
            throw FormulaError.NA;
        }
        //checks if the two arrays are one column each
        //TODO:
        
        try {
            lookup_array = H.accept(lookup_array, Types.ARRAY);
            return_array = H.accept(return_array, Types.ARRAY);
        }catch (e){
            if (e instanceof FormulaError){
                throw FormulaError.NA;
            }
            throw e;
        }
        //all comparisons can be done as strings
        lookup_value = H.accept(lookup_value, Types.STRING);
        search_mode = H.accept(search_mode, Types.NUMBER);
        match_mode = H.accept(match_mode, Types.NUMBER);
        if(if_not_found){
            if_not_found = H.accept(if_not_found)
        }
        
        //If search mode is 1 or -1, then we run a linear search on the input arrays
        if(Math.abs(search_mode) == 1){
            //transform is 0 if search mode is 1 (we want to go through the array in order)
            //transform is the last index if search_mode is -1 (we go through in reverse order)
            const transform = (search_mode == 1) ? 0 : lookup_array.length - 1;
            //minmax records the difference between our lookup_value and the next smallest and next largest numbers
            var minmax = [Number.MAX_VALUE, Number.MAX_VALUE];
            //minmaxIndex records the indexes of the next largest and smallest value
            var minmaxIndex = [-1, -1]


            for(var i = 0; i < lookup_array.length; i++){
                //curr index will go in order if searchmode is 1, and reverse order otherwise
                const currIndex = Math.abs(transform - i)
                const currValue = H.accept(lookup_array[currIndex], Types.STRING);
                const comparison = H.XLOOKUP_HELPER(lookup_value, currValue, match_mode != 2);

                console.log("round")
                if(comparison == 0){
                    return return_array[currIndex]
                }
                //updates minmax and minmaxIndex if currValue is closer to lookup_value than the current recorded value
                if(Math.abs(match_mode) == 1){
                    // updates smaller values
                    console.log("___________")
                    console.log(comparison)
                    console.log(currValue)
                    console.log(minmax[0])
                    console.log(minmax[1])
                    if(comparison < 0 && Math.abs(comparison) < minmax[0]){
                        console.log("currValue")
                        minmaxIndex[0] = currIndex;
                        minmax[0] = Math.abs(comparison);
                    } 
                    //updates larger value
                    if(comparison > 0 && comparison < minmax[1]){
                        console.log("Lookup")
                        minmaxIndex[1] = currIndex;
                        minmax[1] = comparison;
                    }
                }
                
            }
            //returns value based upon optional parameters
            if(if_not_found != null) {
                console.log(if_not_found)
                return if_not_found;
            }
            if(match_mode == -1){
                if(minmaxIndex[0] > 0){
                    return return_array[minmaxIndex[0]];
                }
            }
            if(match_mode == 1){
                if(minmaxIndex[1] > 0){
                    return return_array[minmaxIndex[1]];
                }
            }
            throw FormulaError.NA

        //in the case where search mode is 2 or -2, we run a binary search
        }else if(Math.abs(search_mode == 2)){
            //the lookup value has to be a number to do comparisons
            if(typeof lookup_value != Types.NUMBER){
                throw FormulaError.NA;
            }

            var front = 0;
            var back = lookup_array.length - 1;

            //ascending order of the arrays
            if(search_mode == 2){
                while(front < back - 1){
                    const middle = Math.floor((front + back) / 2);
                    const currValue = H.accept(lookup_array[middle], Types.STRING);
                    const comparison = H.XLOOKUP_HELPER(lookup_value, currValue, match_mode != 2);
                    //updates the binary search
                    if(comparison == 0){
                        return return_array[middle];
                        
                    }else if(comparison < 0){
                        if(search_mode == 2){
                            front = middle;
                        }else{
                            back = middle;
                        }
                        
                    }else {
                        if(search_mode == 2) {
                            back = middle;
                        }else{
                            front = middle;
                        }  
                    }
                }
                if(if_not_found){
                    return if_not_found;
                }
                //returns next smaller number
                if(match_mode == -1){
                    return Math.min(return_array[front], return_array[back]);
                }
                //returns next larger number
                if (match_mode == 1){
                    return Math.max(return_array[front], return_array[back]);
                }
            }
        }
        throw FormulaError.NA;
    }
}

module.exports = ReferenceFunctions;

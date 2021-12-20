

class Helpers {
      /*
    * @param {*} multiArr : The Array that newArr's values will be put into
    * @param {*} inputArr : either an array of arrays, or an array with no sub arrays
    * 
    * Each sub array of either array represents a new line in a spreadsheet.
    * updateRow appends all of the inputArr's values to the end of multiArr sequentially,
    * such that the columns of multiArr and inputArr align
    *  
    * updateRow([[1], [3]], [[2], [3]])
    * becomes:
    * multiRow = [[1,2], [3,4]]
    * on the spread sheet:
    * 1 2
    * 3 4
    */
    static mergeArrays(multiArr, inputArr) {
        if(!Array.isArray(multiArr))
            throw "ERROR: multiArray is not array";
        if(!multiArr.every(Array.isArray))
            throw "ERROR: not all elements of multiArray are arrays"
        if(multiArr.length === 0)
            multiArr.push([])
        if(!Array.isArray(inputArr)){
            multiArr[0].push(inputArr)
            return;
        }

        inputArr.map((currVal, newArrIndex) => {
            if(!Array.isArray(currVal))
                throw "ERROR: not all values are SubArrays";

            while(multiArr.length <= newArrIndex){
                multiArr.push([]);
            }
            multiArr[newArrIndex].push(...currVal);
        });
    }
}

module.exports = Helpers
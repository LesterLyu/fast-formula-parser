const FormulaError = require('../../formulas/error');
const {FormulaParser} = require('../../grammar/hooks');
const json = require('./TESTS.json')
const expect = require('chai').expect;
const sinon = require('sinon')


const convertJSONArray = (array) => {
    if(Array.isArray(array)){
        array.forEach((row, rowIndex) => row.forEach((value, colIndex) => {
            if(value === "undefined")
                array[rowIndex][colIndex] = undefined
            if(FormulaError.errorMap.has(value))
                array[rowIndex][colIndex] = FormulaError.errorMap.get(value)
        }));
    }
}
const test = function(testName){
    const date = new Date(2000, 1, 1)
    let data = json[testName]["sheet"],
        formula = json[testName]["formula"],
        expected = json[testName]["expectedValue"]
        clock =  sinon.useFakeTimers(date.getTime());
    
    if(data)
        convertJSONArray(data)
    if(json[testName]["convertExpected"])
        convertJSONArray(expected)
    
    const parser = new FormulaParser({
        onCell: ref => {
            return data[ref.row - 1][ref.col - 1]
        },
        onRange: ref => {
            const arr = [];
            for (let row = ref.from.row - 1; row < ref.to.row; row++) {
                const innerArr = [];
                for (let col = ref.from.col - 1; col < ref.to.col; col++) {
                    innerArr.push(data[row][col])
                }
                arr.push(innerArr);
            }
            return arr;
        },
        onVariable: name => {
            return json[testName]["variables"][name]
        },
    });

    describe(testName, function () {
        it(formula, () => {  
            let result = parser.parse(formula, {row:1, col:1}, 'deep' in json[testName]);
            if (typeof result === "number" && typeof expected === "number") {
                expect(result, `${formula} should equal ${expected}\n`).to.closeTo(expected, 0.00000001);
            }else if (result.error)
                 expect(expected === result.error, `${formula} should equal ${expected.error}\n`).to.equal(true);
            else if('deep' in json[testName] && json[testName]["deep"] === true)
                expect(result, `${formula} should equal ${expected}\n`).to.deep.eq(expected)
            else
                expect(result, `${formula} should equal ${expected}\n`).to.equal(expected);
        })
    });
}

if(require.main !== module){
    Object.keys(json).map((testName) => test(testName))
}

const FormulaError = require('../error');
const {FormulaHelpers: H, Types} = require('../helpers');
const {DATEVALUE, YEARFRAC} = require('./date');

const FinancialFunctions = {
    /**
     * https://support.microsoft.com/en-us/office/accrint-function-fe45d089-6722-4fb3-9379-e1f911d8dc74
     */
    ACCRINT: (issue, firstInterest, settlement, rate, par, frequency, basis, calcMethod) => {
        issue = H.accept(issue);
        firstInterest = H.accept(firstInterest);
        settlement = H.accept(settlement);

        // Parse date string to serial
        if (typeof issue === "string") {
            firstInterest = DATEVALUE(firstInterest);
        }
        if (typeof issue === "string") {
            issue = DATEVALUE(issue);
        }
        if (typeof issue === "string") {
            settlement = DATEVALUE(settlement);
        }

        rate = H.accept(rate, Types.NUMBER);
        par = H.accept(par, Types.NUMBER);
        frequency = H.accept(frequency, Types.NUMBER);
        basis = H.accept(basis, Types.NUMBER, 0);
        calcMethod = H.accept(calcMethod, Types.BOOLEAN, true);

        // Issue, first_interest, settlement, frequency, and basis are truncated to integers
        issue = Math.trunc(issue);
        firstInterest = Math.trunc(firstInterest);
        settlement = Math.trunc(settlement);
        frequency = Math.trunc(frequency);
        basis = Math.trunc(basis);

        // If rate ≤ 0 or if par ≤ 0, ACCRINT returns the #NUM! error value.
        if (rate <= 0 || par <= 0 )
            return FormulaError.NUM;

        // If frequency is any number other than 1, 2, or 4, ACCRINT returns the #NUM! error value.
        if (frequency !== 1 && frequency !== 2 && frequency !== 4)
            return FormulaError.NUM;

        // If basis < 0 or if basis > 4, ACCRINT returns the #NUM! error value.
        if (basis < 0 || basis > 4)
            return FormulaError.NUM;

        // If issue ≥ settlement, ACCRINT returns the #NUM! error value.
        if (issue >= settlement)
            return FormulaError.NUM;

        


    }
};

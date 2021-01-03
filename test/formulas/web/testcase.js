const {default: FormulaError} = require('../../../formulas/error');
module.exports = {
    ENCODEURL: {
        'ENCODEURL("http://contoso.sharepoint.com/teams/Finance/Documents/April Reports/Profit and Loss Statement.xlsx")':
            'http%3A%2F%2Fcontoso.sharepoint.com%2Fteams%2FFinance%2FDocuments%2FApril%20Reports%2FProfit%20and%20Loss%20Statement.xlsx'
    },
    WEBSERVICE: {
        'WEBSERVICE("www.google.ca")': FormulaError.ERROR()
    },


};

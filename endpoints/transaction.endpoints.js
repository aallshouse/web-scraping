const transactionsService = require("../services/transactions.service");
const jade = require("pug");

const mapEndpoints = function (app, db, tableNames) {
    app.get('/transactions/view', (req, res) => {
        let page = req.query.page || 0;
        let transactionPromise = transactionsService.getTransactions({
            count: req.query.count,
            page: page
        }, db, tableNames);

        let bankBalancePromise = transactionsService.getBankBalance(db, tableNames);
        let availableBalancePromise = transactionsService.getAvailableBalance(db, tableNames);
        let pendingBankBalance = transactionsService.getPendingBalance(db, tableNames);

        //resolve promises and return data with html
        Promise.all([transactionPromise, bankBalancePromise, availableBalancePromise, pendingBankBalance])
            .then(result => {
                const html = jade.renderFile('./templates/viewTransactions.jade', {
                    pageTitle: 'View Transactions',
                    transactions: result[0],
                    page: page,
                    balance: {
                        bank: result[1][0].sum,
                        available: result[2][0].sum,
                        pending: result[3][0].sum
                    }
                });
                res.send(html);
            });
    });
};

module.exports = {
    mapEndpoints
};

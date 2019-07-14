const express = require('express');
const app = express();
const articles = [{ title: 'Example' }];
var jade = require('jade');
var bodyParser = require('body-parser');

const tableNames = {
    transactions: 'transactions',
    creditCards: 'creditcards'
};

const knex = require('knex');
const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        port: 5432,
        user: 'postgres',
        password: 'postgres',
        database: 'postgres'
    }
});

var dataIsValid = function(data) {
    if(!data) {
        console.log('data is null');
        return false;
    }

    if(!data.description) {
        console.log('data.description is null');
        return false;
    }

    if(!data.amount) {
        console.log('data.amount is null');
        return false;
    }

    if(!data.date) {
        console.log('data.date is null');
        return false;
    }

    return true;
};

var getTransactions = function(data) {
    console.log('executing getTransactions()');

    var page = data.page;
    if(page > 0) {
        page = page - 1;
    }
    
    var count = data.count || 20;
    return transactionPromise = db(tableNames.transactions)
        .orderByRaw("date_part('year', transactiondate) desc, date_part('month', transactiondate) desc, date_part('day', transactiondate) desc")
        .select(knex.raw("id, description, amount, category, notprocessed, to_char(transactiondate, 'MM/DD/YYYY') as transactiondate"))
        .limit(count).offset(page*count);
};

var insertTransaction = function(data) {
    if(!dataIsValid(data)) {
        console.log('error reading data for insert');
        return;
    }

    db(tableNames.transactions).where({
        description: data.description,
        amount: data.amount,
        transactiondate: data.date,
        category: data.category,
        isbill: data.isbill
    }).select().first().then(t => {
        if(!t || data.allowDuplicate === 1) {
            db(tableNames.transactions).insert([
                {
                    description: data.description,
                    amount: data.amount,
                    transactiondate: data.date,
                    category: data.category,
                    isbill: data.isbill,
                    notprocessed: data.notprocessed
                }
            ]).then(result => {
                console.log('transaction inserted');
            });
        }
    });
};

var updateTransaction = function(data) {
    if(!dataIsValid(data)) {
        console.log('error reading data for update');
        return;
    }
    if(!data.id) {
        console.log('error reading data.id for update');
        return;
    }

    db(tableNames.transactions).where({ id: data.id })
        .update({
            description: data.description,
            amount: data.amount,
            transactiondate: data.date,
            category: data.category,
            isbill: data.isbill,
            notprocessed: data.notprocessed
        }).then(result => {
            console.log('transaction updated');
        });
};

var deleteTransaction = function(id) {
    if(!id) {
        console.log('error reading id for delete');
        return;
    }

    db(tableNames.transactions).where({ id: id }).del()
        .then(result => {
            console.log('transaction deleted');
        });
};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
    '/fonts',
    express.static('bower_components/bootstrap/dist/fonts')
);
app.use(
    '/css/bootstrap.min.css',
    express.static('bower_components/bootstrap/dist/css/bootstrap.min.css')
);
app.use(
    '/css/bootstrap-theme.min.css',
    express.static('bower_components/bootstrap/dist/css/bootstrap-theme.min.css')
);
app.use(
    '/css/styles.css',
    express.static('css/styles.css')
);
app.use(
    '/js/bootstrap.min.js',
    express.static('bower_components/bootstrap/dist/js/bootstrap.min.js')
);
app.use(
    '/js/jquery.min.js',
    express.static('bower_components/jquery/dist/jquery.min.js')
);
app.use(
    '/js/deleteTransaction.js',
    express.static('js/deleteTransaction.js')
);
app.use(
    '/js/findTransaction.js',
    express.static('js/findTransaction.js')
);
app.use(
    '/js/creditCardStatus.js',
    express.static('js/creditCardStatus.js')
);

app.get('/', (req, res, next) => {
    var html = jade.renderFile('./templates/index.jade', {
        pageTitle: 'Jade Test Page'
    });
    res.send(html);
});

app.get('/articles', (req, res) => {
    res.send(articles);
});

app.post('/articles', (req, res) => {
    res.send('OK');
});

app.get('/transactions/view', (req, res) => {
    var page  = req.query.page || 0;
    var transactionPromise = getTransactions({
        count: req.query.count,
        page: page
    });

    var bankBalancePromise = getBankBalance();
    var availableBalancePromise = getAvailableBalance();

    //resolve promises and return data with html
    Promise.all([transactionPromise, bankBalancePromise, availableBalancePromise])
        .then(result => {
            var html = jade.renderFile('./templates/viewTransactions.jade', {
                pageTitle: 'View Transactions',
                transactions: result[0],
                page: page,
                balance: {
                    bank: result[1][0].sum,
                    available: result[2][0].sum
                }
            });
            res.send(html);
    });
});

var getBankBalance = function() {
    return db(tableNames.transactions).where({ notprocessed: 'f' })
        .select(knex.raw("sum(to_number(amount, 'S9999999.99'))"));
};

var getAvailableBalance = function() {
    return db(tableNames.transactions)
        .select(knex.raw("sum(to_number(amount, 'S9999999.99'))"));
};

app.get('/transactions', (req, res) => {
    var html = jade.renderFile('./templates/editTransaction.jade', {
        pageTitle: 'Edit Transaction'
    });
    res.send(html);
});

app.post('/transactions', (req, res) => {
    //console.log('NotProcessed: ' + req.body.notprocessed);
    var notProcessed = req.body.notprocessed === 'on' ? true : false;

    if(req.body.id) {
        updateTransaction({
            description: req.body.description,
            amount: req.body.amount,
            date: req.body.date,
            category: req.body.category,
            isbill: req.body.isbill,
            notprocessed: notProcessed,
            id: req.body.id
        });
    } else {
        insertTransaction({
            description: req.body.description,
            amount: req.body.amount,
            date: req.body.date,
            category: req.body.category,
            isbill: req.body.isbill,
            notprocessed: notProcessed,
            allowDuplicate: req.body.allowDuplicate || 0
        });
    }

    //res.send('OK');
    //TODO: redirect needs to send the updated data
    var page = req.body.page || 1;
    res.redirect('/transactions/view?page=' + page);
});

app.delete('/transactions/:id', (req, res) => {
    console.log('delete transaction id ' + req.params.id);
    deleteTransaction(req.params.id);
    res.end();
});

app.get('/transactions/search', (req, res) => {
    //console.log('made it to server call /transactions/search');
    var html = jade.renderFile('./templates/searchTransactions.jade', {
        pageTitle: 'Search Transactions'
    });
    res.send(html);
});

app.get('/transactions/:id', (req, res) => {
    var transactionPromise = getTransaction(req.params.id);
    var page = req.query.page || 1;
    transactionPromise.then(result => {
        console.log(result);
        var html = jade.renderFile('./templates/editTransaction.jade', {
            pageTitle: 'Update Transaction',
            transaction: result,
            page: page
        });
        res.send(html);
    })
});

app.get('/transactions/find/:id', (req, res) => {
    console.log(req.params.id);
    var transactionPromise = getTransaction(req.params.id);
    transactionPromise.then(result => {
        res.send(result);
    })
});

app.get('/transactions/description/:desc', (req, res) => {
    var description = req.params.desc;
    //console.log('Description: ' + description);
    var transactionPromise = getTransactionByDescription(description);
    transactionPromise.then(result => {
        //console.log(result);
        res.send(result);
    });
});

app.get('/transactions/notprocessed/:searchvalue', (req, res) => {
    var searchValue = req.params.searchvalue;
    var transactionPromise = getTransactionByNotProcessed(searchValue);
    transactionPromise.then(result => {
        //console.log(result);
        res.send(result);
    });
});

app.get('/credit/find/:id', (req, res) => {
    var creditCardStatusId = req.params.id;
    var creditCardPromise = db(tableNames.creditCards)
        .whereRaw('id = ?', creditCardStatusId)
        .select().first();
    creditCardPromise.then(result => {
        //console.log(result);
        res.send(result);
    });
});

app.get('/credit', (req, res) => {
    var html = jade.renderFile('./templates/creditCardStatus.jade', {
        pageTitle: 'Credit Card Status'
    });
    res.send(html);
});

app.post('/credit', (req, res) => {
    let data = req.body;
    //console.log(`data: ${data}`);
    let currentDate = new Date();
    //let dateEntered = currentDate.toISOString().split('T')[0];
    //console.log(`dateEntered: ${dateEntered}`);
    db(tableNames.creditCards).insert(
        {
            //id: 51, //TODO: ID needs updated on each insert
            companyname: data.companyname,
            availablecredit: data.availablecredit,
            balance: data.balance,
            nextduedate: data.nextduedate === "" ? null : data.nextduedate,
            dateentered: data.dateentered === "" ? currentDate.toISOString() : data.dateentered
        }
    ).then(result => {
        console.log(result);
        console.log('credit card status inserted');
    });
    //res.end();
    res.redirect('/credit');
});

var getTransactionByNotProcessed = function(searchValue) {
    return transactionPromise = db(tableNames.transactions)
        .whereRaw('notprocessed = ?', searchValue)
        .orderByRaw("date_part('year', transactiondate) desc, date_part('month', transactiondate) desc, date_part('day', transactiondate) desc")
        .select(knex.raw("id, description, amount, category, isbill, to_char(transactiondate, 'MM/DD/YYYY') as transactiondate"));
};

var getTransactionByDescription = function(desc) {
    return transactionPromise = db(tableNames.transactions)
        .whereRaw('description ilike ?', '%' + desc + '%')
        .orderByRaw("date_part('year', transactiondate) desc, date_part('month', transactiondate) desc, date_part('day', transactiondate) desc")
        .select(knex.raw("id, description, amount, category, isbill, to_char(transactiondate, 'MM/DD/YYYY') as transactiondate"));
};

var getTransaction = function(id) {
    return transactionPromise = db(tableNames.transactions)
        .where({ id: id })
        .select(knex.raw("id, description, amount, category, isbill, notprocessed, to_char(transactiondate, 'MM/DD/YYYY') as transactiondate"))
        .first();
};

app.put('/transactions/:id', (req, res) => {
    console.log('Param id: ' + req.params.id);
    console.log('QueryString: ' + JSON.stringify(req.query));
    console.log('Body: ' + JSON.stringify(req.body));
    res.send('OK');
});

app.listen(3000);

module.exports = app;
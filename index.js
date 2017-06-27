const express = require('express');
const app = express();
const articles = [{ title: 'Example' }];
var jade = require('jade');
var bodyParser = require('body-parser');

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
    var page = data.page;
    if(page > 0) {
        page = page - 1;
    }
    
    var count = data.count || 10;
    return transactionPromise = db('transactions')
        .orderBy('transactiondate', 'desc')
        .orderBy('id', 'desc')
        .select(knex.raw("id, description, amount, to_char(transactiondate, 'MM/DD/YYYY') as transactiondate"))
        .limit(count).offset(page*count);
};

var insertTransaction = function(data) {
    if(!dataIsValid(data)) {
        console.log('error reading data for insert');
        return;
    }

    db('transactions').where({
        description: data.description,
        amount: data.amount,
        transactiondate: data.date
    }).select().first().then(t => {
        if(!t || data.allowDuplicate === 1) {
            db('transactions').insert([
                {
                    description: data.description,
                    amount: data.amount,
                    transactiondate: data.date
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

    db('transactions').where({ id: data.id })
        .update({
            description: data.description,
            amount: data.amount,
            transactiondate: data.date
        }).then(result => {
            console.log('transaction updated');
        });
};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//app.set('view engine', 'jade');

app.use(
    '/css/bootstrap.min.css',
    express.static('bower_components/bootstrap/dist/css/bootstrap.min.css')
);
app.use(
    '/css/bootstrap-theme.min.css',
    express.static('bower_components/bootstrap/dist/css/bootstrap-theme.min.css')
);
app.use(
    '/js/bootstrap.min.js',
    express.static('bower_components/bootstrap/dist/js/bootstrap.min.js')
);
app.use(
    '/js/jquery.min.js',
    express.static('bower_components/jquery/dist/jquery.min.js')
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

    //resolve promise and return data with html
    transactionPromise.then(result => {
        var html = jade.renderFile('./templates/viewTransactions.jade', {
            pageTitle: 'View Transactions',
            transactions: result,
            page: page
        });
        res.send(html);
    });
});

app.get('/transactions', (req, res) => {
    var html = jade.renderFile('./templates/editTransaction.jade', {
        pageTitle: 'Edit Transaction'
    });
    res.send(html);
});

app.post('/transactions', (req, res) => {
    if(req.body.id) {
        updateTransaction({
            description: req.body.description,
            amount: req.body.amount,
            date: req.body.date,
            id: req.body.id
        });
    } else {
        insertTransaction({
            description: req.body.description,
            amount: req.body.amount,
            date: req.body.date,
            allowDuplicate: req.body.allowDuplicate || 0
        });
    }

    //res.send('OK');
    //TODO: redirect needs to send the updated data
    var page = req.body.page || 1;
    res.redirect('/transactions/view?page=' + page);
});

app.post('/transactions/delete', (req, res) => {
    console.log('delete transaction id ' + req.body.id);
    res.end();
});

app.get('/transactions/:id', (req, res) => {
    var transactionPromise = getTransaction(req.params.id);
    var page = req.query.page || 1;
    transactionPromise.then(result => {
        var html = jade.renderFile('./templates/editTransaction.jade', {
            pageTitle: 'Update Transaction',
            transaction: result,
            page: page
        });
        res.send(html);
    })
});

var getTransaction = function(id) {
    return transactionPromise = db('transactions')
        .where({ id: id })
        .select(knex.raw("id, description, amount, to_char(transactiondate, 'MM/DD/YYYY') as transactiondate"))
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
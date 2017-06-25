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
        if(!t) {
            db('transactions').insert([
                {
                    description: data.description,
                    amount: data.amount,
                    transactiondate: data.date
                }
            ]).then(result => {
                console.log('inserted');
            });
        }
    });
};

app.use(bodyParser.json());

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

app.post('/transactions', (req, res) => {
    console.log(req.body.date);
    insertTransaction({
        description: req.body.description,
        amount: req.body.amount,
        transactiondate: req.body.date
    });

    res.send('OK');
});

app.put('/transactions/:id', (req, res) => {
    console.log('Param id: ' + req.params.id);
    console.log('QueryString: ' + JSON.stringify(req.query));
    console.log('Body: ' + JSON.stringify(req.body));
    res.send('OK');
});

app.listen(3000);

module.exports = app;
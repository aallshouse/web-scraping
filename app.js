var csv = require('csv-parser');
var fs = require('fs');

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

var transactionTable = 'transactions';

//probably need a .then() call after below to get it to execute the promise
// db.schema.createTableIfNotExists(transactionTable, table => {
//     table.increments('id').primary();
//     table.string('description');
//     table.string('amount');
//     table.date('transactiondate');
// }).then(result => {
//     console.log(result);
// });

// db('articles').insert([
//     { title: 'Winds of Winter' }
// ]).then(result => {
//     console.log(result);
// });

// db('articles').select('title').first().then(t => {
//     console.log(t.title);
// });

fs.createReadStream('export-8.csv')
    .pipe(csv())
    .on('data', function (data) {
        var description = data.Description === 'Check'
            ? data.Description + ' ' + data.No : data.Description;
        var amount = data.Debit === '' ? data.Credit : data.Debit;

        db(transactionTable).where({
            description: description,
            amount: amount,
            transactiondate: data.Date
        }).select().first().then(t => {
            if(!t) {
                db(transactionTable).insert([
                    {
                        description: description,
                        amount: amount,
                        transactiondate: data.Date,
                        notprocessed: false
                    }
                ]).then(result => {
                    console.log('inserted');
                });
            }
        });
    });

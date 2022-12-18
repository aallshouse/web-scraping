var csv = require('csv-parser');
var fs = require('fs');

const knex = require('knex');
//FOR Deployment
// const db = knex({
//     client: 'pg',
//     connection: {
//         host: 'db-postgresql-nyc1-21436-do-user-2409945-0.a.db.ondigitalocean.com',
//         port: 25060,
//         user: 'doadmin',
//         password: 'nhjcvwd11tgidqdm',
//         database: 'defaultdb',
//         ssl: true
//     }
// });
//FOR Local
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

let x = 0;
fs.createReadStream('./data-files/export-53.csv')
    .pipe(csv())
    .on('data', function (data) {
        var description = data.Description === 'Check'
            ? data.Description + ' ' + data.No : data.Description;
        var amount = data.Debit === '' ? data.Credit : data.Debit;

        db(transactionTable).where({
            description: description,
            amount: amount,
            transactiondate: data.Date
        }).select('id', 'description', 'amount', 'transactiondate').first().then(t => {
            if(!t) {
                db(transactionTable).insert([
                    {
                        description: description,
                        amount: amount,
                        transactiondate: data.Date,
                        notprocessed: false
                    }
                ]).then(result => {
                    x++;
                    console.log('inserted');
                });
            }
        });
    });
//TODO: move this within the above promise, after the select then
//console.log(`${x} rows inserted`);
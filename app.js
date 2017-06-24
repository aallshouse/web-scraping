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

//probably need a .then() call after below to get it to execute the promise
// db.schema.createTableIfNotExists('articles', table => {
//     table.increments('id').primary();
//     table.string('title');
// });

// db('articles').insert([
//     { title: 'Winds of Winter' }
// ]).then(result => {
//     console.log(result);
// });

// db('articles').select('title').first().then(t => {
//     console.log(t.title);
// });

// fs.createReadStream('transactions-export-2017.csv')
//     .pipe(csv())
//     .on('data', function (data) {
//         //console.log(data);
//         var description = data.Description === 'Check'
//             ? data.Description + ' ' + data.No : data.Description;
//         var amount = data.Debit === '' ? data.Credit : data.Debit;
//         console.log('Date: %s; Description: %s; Amount: %s', data.Date, description, amount);
//     });

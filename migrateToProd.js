const startDate = '2020-08-01';
const endDate = '2020-08-31';

const knex = require('knex');
//FOR Deployment
const dbProd = knex({
    client: 'pg',
    connection: {
        host: 'db-postgresql-nyc1-21436-do-user-2409945-0.a.db.ondigitalocean.com',
        port: 25060,
        user: 'doadmin',
        password: 'nhjcvwd11tgidqdm',
        database: 'defaultdb',
        ssl: true
    }
});
//FOR Local
const dbLocal = knex({
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

dbLocal(transactionTable).whereBetween('transactiondate', [ startDate, endDate ])
    .select().then(t => {
        //console.log(t);

        if(t.length > 0) {
            // console.log('received an array');
            for(var i = 0; i < t.length; i++) {
                let row = t[0];
                //TODO: to make this script safer, check if the row exists in the destination db first
                //console.log(`${row.description} | ${row.amount} | ${row.transactiondate}`);
                dbProd(transactionTable).insert([
                    {
                        description: row.description,
                        amount: row.amount,
                        transactiondate: row.transactiondate,
                        notprocessed: row.notprocessed,
                        category: row.category,
                        isbill: row.isbill,
                        pending: row.pending
                    }
                ]).then(result => {
                    console.log(result);
                    console.log('inserted');
                });
            }
        }
});

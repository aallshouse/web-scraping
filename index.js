var dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();
const articles = [{ title: 'Example' }];
var jade = require('pug');
var bodyParser = require('body-parser');
var jwtExpress = require('express-jwt');
var cookieParser = require('cookie-parser');

const tableNames = {
    transactions: 'transactions',
    creditCards: 'creditcards'
};

//TODO: move below knex info into env file
const knex = require('knex');
const db = knex({
    client: 'pg',
    connection: {
        host: process.env.PROD_DB_HOST,
        port: process.env.PROD_DB_PORT,
        user: process.env.PROD_DB_USER,
        password: process.env.PROD_DB_PASSWORD,
        database: process.env.PROD_DB_DATABASE,
        ssl: true
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
        .orderByRaw("date_part('year', transactiondate) desc, date_part('month', transactiondate) desc, date_part('day', transactiondate) desc, description")
        .select(knex.raw("id, description, amount, category, notprocessed, pending, to_char(transactiondate, 'MM/DD/YYYY') as transactiondate"))
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
                    notprocessed: data.notprocessed,
                    pending: data.pending
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
            notprocessed: data.notprocessed,
            pending: data.pending
        }).then(result => {
            console.log('transaction updated');
        });
};

var updateNotProcessed = function(id) {
    if(!id) {
        console.log('error reading id for update');
        return;
    }

    db(tableNames.transactions).where({ id: id })
        .update({
            notprocessed: 'f'
        })
        .then(result => {
            console.log('transaction updated');
            //TODO: refresh bank balance
        });
};

var updatePending = function(id) {
    if(!id) {
        console.log('error reading id for update');
        return;
    }

    db(tableNames.transactions).where({ id: id })
        .update({
            pending: 'f'
        })
        .then(result => {
            console.log('transaction updated');
            //TODO: refresh bank balance
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
    '/css/bootstrap.min.css',
    express.static('static/bootstrap.min.css')
);
app.use(
    '/css/bootstrap-theme.min.css',
    express.static('static/bootstrap-theme.min.css')
);
app.use(
    '/css/styles.css',
    express.static('css/styles.css')
);
app.use(
    '/js/bootstrap.min.js',
    express.static('node_modules/bootstrap/dist/js/bootstrap.min.js')
);
app.use(
    '/js/jquery.min.js',
    express.static('node_modules/jquery/dist/jquery.min.js')
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
app.use(
    '/js/notProcessed.js',
    express.static('js/notProcessed.js')
);

app.use(
    '/js/jquery-ui.min.js',
    express.static('js/jquery-ui.min.js')
);

app.use(
    '/css/jquery-ui.min.css',
    express.static('css/jquery-ui.min.css')
);

app.use(
    '/css/jquery-ui.min.css',
    express.static('css/jquery-ui.min.css')
);

app.use(
    '/css/autocomplete.min.css',
    express.static('css/autocomplete.min.css')
);

app.use(
    '/js/autocomplete.min.js',
    express.static('js/autocomplete.min.js')
);

app.use(
    '/js/admin.js',
    express.static('js/admin.js')
);

app.use(
    '/js/login.js',
    express.static('js/login.js')
);

const getTokenFromHeader = (req) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    } else if(req.cookies.token) {
      return req.cookies.token;
    }
  };

app.use(cookieParser());

app.use(
    jwtExpress({
        secret: process.env.JWT_SECRET,
        userProperty: 'token',
        getToken: getTokenFromHeader,
        algorithms: ['HS256']
    }).unless({path: ['/', '/admin/user/verify']})
);

app.use(function (err, req, res, next) {
    console.log(err.name, err);
    if (err.name === 'UnauthorizedError') {
        //res.redirect('/');
        res.status(401).send('invalid token...');
    }
  });

app.get('/', (req, res, next) => {
    var html = jade.renderFile('./templates/login.jade', {
        pageTitle: 'Login'
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
    var pendingBankBalance = getPendingBalance();

    //resolve promises and return data with html
    Promise.all([transactionPromise, bankBalancePromise, availableBalancePromise, pendingBankBalance])
        .then(result => {
            var html = jade.renderFile('./templates/viewTransactions.jade', {
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

var getBankBalance = function() {
    return db(tableNames.transactions).where({ notprocessed: 'f', pending: 'f' })
        .select(knex.raw("sum(to_number(amount, 'S9999999.99'))"));
};

var getAvailableBalance = function() {
    return db(tableNames.transactions)
        .select(knex.raw("sum(to_number(amount, 'S9999999.99'))"));
};

var getPendingBalance = function() {
    return db(tableNames.transactions).where({ pending: 't' }).orWhere({ notprocessed: 'f', pending: 'f' })
        .select(knex.raw("sum(to_number(amount, 'S9999999.99'))"));
};

app.get('/admin', (req, res) => {
    var html = jade.renderFile('./templates/admin.jade', {
        pageTitle: 'Admin'
    });
    res.send(html);
});

var argon2 = require('argon2');
app.post('/admin/user/create', async (req, res) => {
    var hashedPassword = await argon2.hash(req.body.userPassword);
    db('users')
        .insert({
            name: req.body.userName,
            email: req.body.userEmail,
            password: hashedPassword
        }).then(result => {
            console.log(result);
            console.log('user inserted');
        });

    res.redirect('/admin');
});

app.post('/admin/user/verify', async (req, res) => {
    console.log('admin verify', req.body);
    db('users')
        .where({ email: req.body.loginEmail })
        .select('name', 'email', 'password').first()
        .then(async result => {
            console.log(result);
            if(!result) {
                return res.status(404).send('User not found');
            }

            var userRecord = result;
            var verified = await argon2.verify(userRecord.password, req.body.loginPassword);
            console.log('verified', verified);
            res.cookie('token', generateToken(userRecord));
            return res.json({
                user: {
                  email: userRecord.email,
                  name: userRecord.name
                }
              })
              .status(200);

            // res.redirect('/admin');
        })
        .catch(e => {
            console.log(e);
            return res.status(500).send('an error returned when querying for user');
        });
});

const jwt = require('jsonwebtoken');
generateToken = function(user) {
    const data = {
        _id: user.id,
        name: user.name,
        email: user.email
    };
    const signature = process.env.JWT_SECRET;
    const expiration = '6h';
    return jwt.sign({ data }, signature, { expiresIn: expiration });
};

app.post('/test/protected', (req, res) => {
    console.log('made it to the test protected route');
    return res.status(200).send('Ok');
});

app.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/admin');
});

app.get('/transactions', (req, res) => {
    var html = jade.renderFile('./templates/editTransaction.jade', {
        pageTitle: 'Edit Transaction'
    });
    res.send(html);
});

app.post('/transactions', (req, res) => {
    //console.log('NotProcessed: ' + req.body.notprocessed);
    // console.log('req.body', req.body);
    var notprocessed = req.body.notprocessed === 'on' ? true : false;
    var pending = req.body.pending === 'on' ? true : false;
    var isbill = req.body.isbill === 'on' ? true : false;
    console.log('req.body.pending', req.body.pending);
    console.log('pending', pending);

    if(req.body.id) {
        updateTransaction({
            description: req.body.description,
            amount: req.body.amount,
            date: req.body.date,
            category: req.body.category,
            isbill: isbill,
            notprocessed: notprocessed,
            id: req.body.id,
            pending: pending
        });
    } else {
        insertTransaction({
            description: req.body.description,
            amount: req.body.amount,
            date: req.body.date,
            category: req.body.category,
            isbill: isbill,
            notprocessed: notprocessed,
            pending: pending,
            allowDuplicate: req.body.allowDuplicate || 0
        });
    }

    //res.send('OK');
    //TODO: redirect needs to send the updated data
    var page = req.body.page || 1;
    res.redirect('/transactions/view?page=' + page);
});

app.post('/transactions/processed/:id', (req, res) => {
    console.log(`id ${req.params.id} has been processed by bank`);
    updateNotProcessed(req.params.id);
    res.end();
});

app.post('/transactions/pending/:id', (req, res) => {
    console.log(`id ${req.params.id} has been processed (was pending) by bank`);
    updatePending(req.params.id);
    res.end();
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

app.get('/transactions/pending/:searchvalue', (req, res) => {
    var searchValue = req.params.searchvalue;
    var transactionPromise = getTransactionByPending(searchValue);
    transactionPromise.then(result => {
        //console.log(result);
        res.send(result);
    });
});

app.get('/transactions/category/:searchvalue', (req, res) => {
    var searchValue = req.params.searchvalue;
    var transactionPromise = getTransactionByCategory(searchValue);
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

var getTransactionByCategory = function(searchValue) {
    if(searchValue === 'all') {
        return transactionPromise = db(tableNames.transactions)
            .orderByRaw("category")
            .distinct("category");
    }

    return transactionPromise = db(tableNames.transactions)
        .whereRaw('category ilike ?', `%${searchValue}%`)
        .orderByRaw("category")
        .distinct("category");
};

var getTransactionByNotProcessed = function(searchValue) {
    return transactionPromise = db(tableNames.transactions)
        .whereRaw('notprocessed = ?', searchValue)
        .orderByRaw("date_part('year', transactiondate) desc, date_part('month', transactiondate) desc, date_part('day', transactiondate) desc")
        .select(knex.raw("id, description, amount, category, isbill, pending, notprocessed, to_char(transactiondate, 'MM/DD/YYYY') as transactiondate"));
};

var getTransactionByPending = function(searchValue) {
    return transactionPromise = db(tableNames.transactions)
        .whereRaw('pending = ?', searchValue)
        .orderByRaw("date_part('year', transactiondate) desc, date_part('month', transactiondate) desc, date_part('day', transactiondate) desc")
        .select(knex.raw("id, description, amount, category, isbill, pending, to_char(transactiondate, 'MM/DD/YYYY') as transactiondate"));
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
        .select(knex.raw("id, description, amount, category, isbill, notprocessed, pending, to_char(transactiondate, 'MM/DD/YYYY') as transactiondate"))
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

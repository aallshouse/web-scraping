const express = require('express');
const app = express();
const articles = [{ title: 'Example' }];
var jade = require('jade');
var bodyParser = require('body-parser');

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
    //console.log(req.params);
    console.log(req.body);
    res.send('OK');
});

app.listen(3000);

module.exports = app;
import Express from 'express';
import Nunjucks from 'nunjucks';
import DB_config from './config/db';
global.DB = require('knex')({ client: 'pg', connection: DB_config, debug: false });


import Search from './scripts/search';
import Users from './scripts/users';
import Operators from './scripts/operators';


const express = Express();

express.use(Express.json());
express.use(Express.urlencoded({ extended: true }));

express.use('/media', Express.static(__dirname + '/client'));

Nunjucks.configure('views', {
    autoescape: true,
    express: express
});

express.get('/', function(req, res) {
    res.render('body.html');
});

new Users(express);
new Operators(express);
new Search(express);

express.listen(3000, () => console.log('Server run on port 3000!'));




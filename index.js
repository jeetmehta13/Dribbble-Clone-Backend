require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const models = require('./models');
const redisStore = require('./config/redis')(session);
const routes = require('./routes');
const responseFormat = require('./utils/response');

const app = express();

app.use(cookieParser('secret'));
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(responseFormat);

app.use(
    session({
        resave: false,
        saveUninitialized: false,
        secret: process.env.SESSION_SECRET,
        store: redisStore,
        cookie: { maxAge: 365 * 24 * 60 * 60 * 1000 }
    })
);

app.use('/', routes);

const port = 3000;

models.sequelize.sync().then(
    () => {
        app.listen(port, () => {
            console.log('Success! Use port ' + port);
        });
    },
    err => {
        console.log('Error in syncing DB: ' + err);
    } 
)
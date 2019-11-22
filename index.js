const winston = require('winston');
const appDebugger = require('debug')('app:startup');
const morgan = require('morgan');
const express = require('express');
const app = express();


require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();
require('./startup/prod')(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));

if (app.get('env') === 'development') {
   app.use(morgan('tiny'));
   appDebugger('morgan enables..');
};

const port = process.env.PORT || 4000;
const server = app.listen(port, () => winston.info(`Listening on port ${port}...`));
module.exports = server;

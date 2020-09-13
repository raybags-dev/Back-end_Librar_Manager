const winston = require('winston');

module.exports = function (err, req, res, next) {
   winston.error(err.message, err)
   res.status(500).send('Server Error: Connection Failed !!!')

}

/*
Logging levels (methords) include;
-error
-warn/warning
-info
-verbose
-debug
-silly
*/
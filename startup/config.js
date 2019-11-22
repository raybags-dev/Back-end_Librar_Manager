const config = require('config');

module.exports = function () {
   if (!config.get('jwtPrivateKey')) {
      throw new Error('FATAL ERROR: jwtPrivateKey is not defined');
   };
   console.log('Developer:', config.get('app.developer'));
   console.log('Application Name:', config.get('app.App-name'));
   console.log('Mail-server-name:', config.get('mail.host'));
   console.log('Mail-password:', '**', config.get('mail.password'), '**');
   console.log('jwtPrivateKey:', '**', config.get('jwtPrivateKey'), '**');

};
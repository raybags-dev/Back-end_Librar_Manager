module.exports = (password) => {
   var passwordIsGood = [false, false];

   for (var i = 0; i < password.length; i++) {
      var character = password[i];

      if (character >= 'A' && character <= 'Z') {
         passwordIsGood[0] = true;

      }
      if (character >= '0' && character <= '9') {
         passwordIsGood[1] = true;

      }
   }

   var goodPassword = true;
   for (var i = 0; i < passwordIsGood.length; i++) {
      goodPassword = goodPassword && passwordIsGood[i];
   }
   return goodPassword;
}
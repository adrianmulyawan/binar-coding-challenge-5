const passport = require('../lib/passport-jwt');

const isAuthenticated = passport.authenticate('jwt', {
  session: false
});

module.exports = {
  isAuthenticated,
};
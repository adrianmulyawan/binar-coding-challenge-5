const passport = require('passport');
const LocalStrategy = require('passport-local');
const { AuthController } = require('../controllers/web/auth.controller');
const loginProcess = AuthController.loginProcess;
const User = require('../models').User;

// Fungsi untuk authorization 
async function authenticate(username, password, done) {
  try {
    // > Panggil method loginProcess 
    // => dari folder (controllers/controller-local/auth.controller.js)
    const user = await loginProcess(username, password);

    // > Jika berhasil
    return done(null, user);
  } catch (error) {
    return done(null, false, {
      message: error.message
    });
  }
}

passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password'
}, authenticate));

// Serialize dan Deserialize
// => Cara untuk membuat sesi dan menghapus sesi
passport.serializeUser(
  (user, done) => done(null, user.dataValues.id)
);
passport.deserializeUser(
  async (id, done) => done(null, await User.findByPk(id))
);

module.exports = passport;

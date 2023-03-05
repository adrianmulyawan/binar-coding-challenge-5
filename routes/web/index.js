const router = require('express').Router();
const passport = require('../../lib/passport-local');

// > Middleware 
const CheckUsername = require('../../middlewares/web/checkDuplicate.middleware'); 
// CheckUsername => Middleware pengecekan apakah username sudah digunakan / belum
const CheckAuthenticated = require('../../middlewares/web/checkAuthenticated.middleware'); 
// CheckAuthenticated => Middleware pengecekan apakah user sudah terautentikasi (login) / belum (memiliki session)

// > Controller
const { HomeController } = require('../../controllers/web/home.controller');
const { AuthController } = require('../../controllers/web/auth.controller');

// > Route: Home dan Game Page
router.get('/', HomeController.getHomePage);
router.get('/game', HomeController.getGamePage);

// > Route: Authentication
// => Register
router.get('/register', AuthController.pageRegister);
router.post('/register', [
  CheckUsername.checkUsername
], AuthController.userRegister);
// => Login
router.get('/login', AuthController.pageLogin);
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));

// > Route: Profile User
router.get('/profile-user', [
  CheckAuthenticated.isAuthenticated
], AuthController.whoAmI);

// > Route: Logout
router.get('/logout', AuthController.logout);

module.exports = router;
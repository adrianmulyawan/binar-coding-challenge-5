const router = require('express').Router();
const passport = require('../../lib/passport-local');

// > Middleware 
const CheckUsername = require('../../middlewares/web/checkDuplicate.middleware'); 
// CheckUsername => Middleware pengecekan apakah username sudah digunakan / belum
const CheckAuthenticated = require('../../middlewares/web/checkAuthenticated.middleware'); 
// CheckAuthenticated => Middleware pengecekan apakah user sudah terautentikasi (login) / belum (memiliki session)
const CheckLogin = require('../../middlewares/web/checkLogin.middleware');
// CheckLogin => Middleware pengecekan apakah user sudah login atau belum jika belum login maka user bisa akses tujuan
// jika telah login akan di direct kehalaman utama
const CheckRole = require('../../middlewares/web/checkRole.middleware');
// => CheckRole => Middleware pengecekan user yang login

// > Controller
const { HomeController } = require('../../controllers/web/home.controller');
const { AuthController } = require('../../controllers/web/auth.controller');

// > Route: Home dan Game Page
router.get('/', [CheckAuthenticated.isAuthenticated], HomeController.getHomePage);
router.get('/game', [CheckAuthenticated.isAuthenticated], HomeController.getGamePage);

// > Route: Authentication
// => Register
router.get('/register', [CheckLogin.isLogin], AuthController.pageRegister);
router.post('/register', [
  CheckUsername.checkUsername
], AuthController.userRegister);
// => Login
router.get('/login', [CheckLogin.isLogin], AuthController.pageLogin);
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
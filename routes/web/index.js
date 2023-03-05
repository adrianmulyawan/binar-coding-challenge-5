const router = require('express').Router();

// > Middleware 
const CheckUsername = require('../../middlewares/web/checkDuplicate.middleware');

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

module.exports = router;
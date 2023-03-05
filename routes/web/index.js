const router = require('express').Router();

// > Middleware 
// > Controller
const { HomeController } = require('../../controllers/web/home.controller');

// > Route: Home dan Game Page
router.get('/', HomeController.getHomePage);
router.get('/game', HomeController.getGamePage);

module.exports = router;
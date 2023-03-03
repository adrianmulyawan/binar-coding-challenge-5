const router = require('express').Router();

// > Controller 
const { AuthController } = require('../../controllers/api/auth.controller');

// > Middleware 
const CheckDuplicate = require('../../middlewares/checkDuplicate.middleware');

// ========================================================================

// > Route: Route Hello
router.get('/api/v1/hello', (req, res) => {
  return res.status(200).json({
    status: 'Success',
    statusCode: 200,
    message: 'Hello Deck!'
  });
});

// > Route: Authtentication
router.post('/api/v1/register', [
  CheckDuplicate.checkUsername
], AuthController.userRegister);
router.post('/api/v1/login', AuthController.loginWithJWT);

module.exports = router;
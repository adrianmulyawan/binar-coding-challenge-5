const router = require('express').Router();

// > Controller 
const { AuthController } = require('../../controllers/api/auth.controller');

// > Middleware 
const CheckDuplicate = require('../../middlewares/checkDuplicate.middleware');

router.get('/api/v1/hello', (req, res) => {
  return res.status(200).json({
    status: 'Success',
    statusCode: 200,
    message: 'Hello Deck!'
  });
});

router.post('/api/v1/register', [
  CheckDuplicate.checkUsername
], AuthController.userRegister);

module.exports = router;
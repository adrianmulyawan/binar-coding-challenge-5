const router = require('express').Router();

router.get('/api/v1/hello', (req, res) => {
  return res.status(200).json({
    status: 'Success',
    statusCode: 200,
    message: 'Hello Deck!'
  });
});

module.exports = router;
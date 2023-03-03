const models = require('../models');
const User = models.User;

const checkUsername = async (req, res, next) => {
  const username = await User.findOne({
    username: req.body.username
  });

  if (username) {
    return res.status(400).json({
      status: 'Failed',
      statusCode: 400,
      message: 'Sorry, Username is Already Exists!'
    });
  }

  next();
};

module.exports = {
  checkUsername
};
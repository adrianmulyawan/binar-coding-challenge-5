const models = require('../models');
const User = models.User;

const checkUsername = async (req, res, next) => {
  try {
    const checkUsername = await User.findOne({
      where: {
        username: req.body.username
      }
    });

    if (checkUsername) {
      return res.status(400).json({
        status: 'Failed',
        statusCode: 400,
        message: 'Sorry! Username is Already Exists'
      });
    }

    next();
  } catch (error) {
    return res.status(400).json({
      status: 'Failed',
      statusCode: 400,
      message: 'Something Error!',
      error: error
    });
  }
};

module.exports = {
  checkUsername
};
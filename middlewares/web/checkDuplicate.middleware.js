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
      console.info('Username is Already Exists')
    }

    next();
  } catch (error) {
    console.info(error);
  }
};

module.exports = {
  checkUsername
};
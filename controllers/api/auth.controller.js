require('dotenv').config();
const models = require('../../models')
const User = models.User;
const bcrypt = require('bcrypt');
const saltRounds = +process.env.SALT_ROUND;
const jwt = require('jsonwebtoken');

class AuthController {
  // Function Handle Register Process
  static userRegister = async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // > bcrypt password
      const bcryptPassword = await bcrypt.hash(password, saltRounds);

      // > Create User With Profile
      const createUser = await User.create({
        username,
        password: bcryptPassword,
        profile: req.body.profile
      }, {
        include: ['profile']
      });

      // > Return data
      return res.status(201).json({
        status: 'Success',
        statusCode: 201,
        message: 'Register is Success!',
        data: createUser
      });
    } catch (error) {
      return res.status(400).json({
        status: 'Failed',
        statusCode: 400,
        message: 'Something Error!',
        error: error
      });
    }
  };
};

module.exports = {
  AuthController,
};
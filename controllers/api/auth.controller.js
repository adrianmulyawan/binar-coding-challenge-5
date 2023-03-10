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

  // Function Generate JWT Token
  static generateToken = (id, username, role) => {
    // > Tangkap id, username, dan role untuk dijadikan payload
    const payload = {
      id, username, role
    };

    // > SECRET_KEY Dari .env file 
    const SECRET_KEY = process.env.SECRET_KEY;

    // > Buat token
    // => JWT akan expired dalam 24 jam
    const token = jwt.sign(payload, SECRET_KEY, {
      expiresIn: 86400
    });

    return token;
  }

  static userLogin = async (username, password) => {
    try {
      const userDatabase = await User.findOne({
        where: {
          username
        }
      });

      if (!userDatabase) {
        return Promise.reject('Check Again Your Login Data!');
      }

      const checkPassword = await bcrypt.compare(password, userDatabase.password);

      if (!checkPassword) {
        return Promise.reject('Check Again Your Login Data!');
      }

      return Promise.resolve(userDatabase);
    } catch (error) {
      return res.status(400).json({
        status: 'Failed',
        statusCode: 400,
        message: 'Something Error!',
        error: error
      });
    }
  };

  static loginWithJWT = async (req, res) => {
    try {
      // > Tangkap Username dan Password = 
      const { username, password } = req.body;

      // > Check Username dan Password 
      // => Apakah username atau password sama dengan db
      const checkLogin = await AuthController.userLogin(username, password);

      // > Simpan id, username, dan role user
      const idUser = checkLogin.dataValues.id;
      const usernameUser = checkLogin.dataValues.username;
      const roleUser = checkLogin.dataValues.role;

      // > Generate token 
      const generateToken = AuthController.generateToken(idUser, usernameUser, roleUser);

      return res.status(200).json({
        status: 'Success',
        statusCode: 200,
        message: 'Success Login!',
        accessToken: generateToken
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

  static whoAmI = (req, res) => {
    const {id, username, role} = req.user;
    return res.status(200).json({
      status: 'Success',
      statusCode: 200,
      message: `Hello ${username}`,
      user: {
        id,
        username,
        role
      }
    });
  };
};

module.exports = {
  AuthController,
};
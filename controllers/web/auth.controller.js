require('dotenv').config();
const models = require('../../models')
const User = models.User;
const bcrypt = require('bcrypt');
const saltRounds = +process.env.SALT_ROUND;
const jwt = require('jsonwebtoken');

class AuthController {
  // Function handle method render view register
  static pageRegister = (req, res) => {
    return res.render('pages/register', {
      layout: 'layouts/auth-layouts',
      title: 'Register',
      // message: req.flash('message')
    });
  };

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
        profile: {
          fullname: 'Nama Belum Diatur',
          email: 'Email Belum Diatur',
          address: 'Alamat Belum Diatur',
          phone_number: 'No Ponsel Belum diatur'
        }
      }, { include: ['profile'] });

      // > Return to /login route
      return res.redirect('/login');
    } catch (error) {
      console.info(error);
    }
  };

  // Function handle method rander view login
  static pageLogin = (req, res) => {
    return res.render('pages/login', {
      layout: 'layouts/auth-layouts',
      title: 'Login',
      // message: req.flash('message'),
      // success: req.flash('success')
    });
  };

  // Function handle login user
  static loginProcess = async (username, password) => {
    try {
      const userDatabase = await User.findOne({
        where: {
          username
        }
      });

      if (!userDatabase) {
        console.info('Check Your Login Data Again!');
        return Promise.reject('Check Your Login Data Again!');
      }

      const checkPassword = await bcrypt.compare(password, userDatabase.password);

      if (!checkPassword) {
        console.info('Password Wrong!');
        return Promise.reject('Password Wrong!');
      }

      return Promise.resolve(userDatabase);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  static whoAmI = async (req, res) => {
    const {id} = req.user.dataValues;
    const profile = await User.findOne({
      where: {
        id
      }
    });

    res.render('profile', {
      profile
    });
  };
};

module.exports = {
  AuthController,
};
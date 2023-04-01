require('dotenv').config();
const models = require('../../models')
const User = models.User;
const bcrypt = require('bcrypt');
const saltRounds = +process.env.SALT_ROUND;
const jwt = require('jsonwebtoken');

class AuthController {
  // > Function Handle Register Process
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

  // >  Function Generate JWT Token 
  // => Fungsi ini menghandle token yang akan diberikan bila user berhasil login
  static generateToken = (id, username, role) => {
    // > Tangkap id, username, dan role untuk dijadikan payload
    // => Didalam payload ini akan terdapat id, username dan role milik user yang login
    const payload = {
      id, username, role
    };

    // > SECRET_KEY Dari .env file 
    const SECRET_KEY = process.env.SECRET_KEY;

    // > Buat token'
    // => Membuat tokennya menggunakan package json web token
    // => JWT akan expired dalam 24 jam (dari expiresIn)
    const token = jwt.sign(payload, SECRET_KEY, {
      expiresIn: 86400
    });

    return token;
  }

  // > Fungsi login
  static userLogin = async (username, password) => {
    try {
      // > Cari apakah username ada didalam database
      // => kembaliannya adalah object user
      const userDatabase = await User.findOne({
        where: {
          username
        }
      });

      // > Apabila username tidak ditemukan
      // => return dengan promise reject
      if (!userDatabase) {
        return Promise.reject('Check Again Your Login Data!');
      }

      // > Bila username ditemukan
      // => Check password dari user tersebut
      // => Apakah hasol compare bcrypt password yang diinputkan user di form login === password hasil compare di database
      // => Hasil dari compare ini true = jika password benar, false = jika password salah
      const checkPassword = await bcrypt.compare(password, userDatabase.password);

      // > Apabila password tidak sama
      // => return dengan promise reject
      if (!checkPassword) {
        return Promise.reject('Check Again Your Login Data!');
      }

      // > Apabila berhasil return dengan promise resolve
      // => Dengan membawa data user yang login
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

  // > Fungsi login dengan JWT (JSON Web Token)
  // => Fungsi ini akan melakukan:
  // 1.) Pengecekan user didalam db (datanya akan kita gunakan untuk buat token)
  // 2.) Generate token user
  static loginWithJWT = async (req, res) => {
    try {
      // > Tangkap Username dan Password
      const { username, password } = req.body;

      // > Check Username dan Password (dari method userLogin)
      // => Apakah USER terdaftar didalam sitem (username dan password ada)
      // => Hasilnya berupa object user yang berhasil login
      const checkLogin = await AuthController.userLogin(username, password);

      // > Simpan id, username, dan role user
      // => Data ini diambil dari variable 'checkLogin'
      const idUser = checkLogin.dataValues.id;
      const usernameUser = checkLogin.dataValues.username;
      const roleUser = checkLogin.dataValues.role;

      // > Generate token 
      // => menggunakan method generateToken()
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
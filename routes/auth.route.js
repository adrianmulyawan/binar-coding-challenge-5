const express = require('express');
const router = express.Router();
const {
  login,
  loginProcess,
  register,
  logout,
  registerProcess
} = require('../controllers/auth.controller');
const { body, validationResult, check } = require('express-validator');

const models = require('../models');
const Users = models.User;

router.route('/login')
  .get(login)
  .post(loginProcess);

router.get('/logout', logout);

router.route('/register')
  .get(register)
  .post([
    body('username').custom(async (value) => {
      const duplicate = await Users.findOne({
        where: {
          username: value
        }
      });
      if (duplicate) {
        throw new Error('Username is Registered!');
      }
      return true;
    }),
    body('email').custom(async (value) => {
      const duplicate = await Users.findOne({
        where: {
          email: value
        }
      });
      if (duplicate) {
        throw new Error('Email is Registered!');
      }
      return true;
    }),
    check('password', 'Minimum 6 Character Password').isLength({
      min: 6
    })
  ], registerProcess);

module.exports = router;
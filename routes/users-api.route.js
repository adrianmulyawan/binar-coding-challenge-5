const express = require('express');
const router = express.Router();
const { body, validationResult, check } = require('express-validator');
const models = require('../models');
let Users = models.User;
const { 
  login, 
  getAllDataUsers, 
  register,
  getDetailUser,
  update,
  deleteDataUser
} = require('../controllers/users-api.controller')

router.get('/api/v1/users', getAllDataUsers);

router.get('/api/v1/users/:uuid', getDetailUser);

router.post('/api/v1/users/login', login);

router.post('/api/v1/users/register', [
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
], register);

router.put('/api/v1/users/update/:uuid', update);

router.delete('/api/v1/users/delete/:uuid', deleteDataUser);

module.exports = router;
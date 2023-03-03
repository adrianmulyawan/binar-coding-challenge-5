const express = require('express');
const { body, validationResult, check } = require('express-validator');
const router = express.Router();
const { 
  dashboardAdmin,
  recentPlaysUsers,
  showAllUsers,
  detailUser,
  addUser,
  addUserProcess,
  updateUser,
  updateUserProcess,
  deleteUser,
} = require('../controllers/dashboard-admin.controller');

const models = require('../models');
const Users = models.User;

router.get('/dashboard-admin', dashboardAdmin);
router.get('/dashboard-admin/recent-plays', recentPlaysUsers);
router.get('/dashboard-admin/users', showAllUsers);
router.get('/dashboard-admin/users/detail/:uuid', detailUser);
router.get('/dashboard-admin/users/add', addUser);
router.post('/dashboard-admin/users/add', [
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
], addUserProcess);
router.get('/dashboard-admin/users/update/:uuid', updateUser);
router.put('/dashboard-admin/users/update', updateUserProcess);
router.get('/dashboard-admin/users/delete/:uuid', deleteUser);

module.exports = router;
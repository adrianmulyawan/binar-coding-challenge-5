const models = require('../models');
const User = models.User;
const UserBiodata = models.UserBiodata;
const UserGameHistory = models.UserGameHistory;
const { validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const dashboardAdmin = async (req, res) => {
  const countUser =  await User.count({
    where: {
      role: 'USER'
    }
  });

  const countAdmin = await User.count({
    where: {
      role: 'ADMIN'
    }
  });

  const users = await User.findAll({
    include: ['biodata', 'histories'],
    order: [
      ['id', 'DESC']
    ],
    limit: 5,
  });

  const histories = await UserGameHistory.findAll({
    include: ['user'],
    order: [
      ['id', 'DESC']
    ],
    limit: 5,
  });

  // console.info(histories);

  res.render('pages/dashboard-admin/dashboard', {
    layout: 'layouts/dashboard-admin-layouts',
    title: 'Dashboard Admin',
    countUser: countUser,
    countAdmin: countAdmin,
    users: users,
    histories: histories,
    username: req.session.username,
  });
};

const recentPlaysUsers = async (req, res) => {
  const histories = await UserGameHistory.findAll({
    include: ['user'],
    order: [
      ['id', 'DESC']
    ]
  });

  res.render('pages/dashboard-admin/dashboard-recents', {
    layout: 'layouts/dashboard-admin-layouts',
    title: 'Dashboard: Hasil Pertandingan',
    histories: histories,
    username: req.session.username,
  });
};

const showAllUsers = async (req, res) => {
  const users = await User.findAll({
    include: ['biodata', 'histories'],
    order: [
      ['id', 'DESC']
    ],
    where: {
      role: 'USER'
    },
    limit: 10
  });

  res.render('pages/dashboard-admin/dashboard-users', {
    layout: 'layouts/dashboard-admin-layouts',
    title: 'Dashboard: Users',
    users: users,
    success: req.flash('success'),
    successUpdate: req.flash('successUpdate'),
    failedUpdate: req.flash('failedUpdate'),
    username: req.session.username,
  });
};

const detailUser = async (req, res) => {
  const idUser = req.params.uuid;

  try {
    const data = await User.findOne({
      where: {
        uuid: idUser
      }
    });
  
    res.render('pages/dashboard-admin/dashboard-users-detail', {
      layout: 'layouts/dashboard-admin-layouts',
      title: 'Dashboard: Detail User',
      data: data,
      username: req.session.username,
    });
  } catch(err) {
    res.render('pages/notfound', {
      layout: 'layouts/error-handling-layouts',
      title: 'Not Found!'
    });
  }
};

const addUser = async (req, res) => {
  res.render('pages/dashboard-admin/dashboard-users-add', {
    layout: 'layouts/dashboard-admin-layouts',
    title: 'Dashboard: Tambah User',
    username: req.session.username,
  });
};

const addUserProcess = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.render('pages/dashboard-admin/dashboard-users-add', {
      layout: 'layouts/dashboard-admin-layouts',
      title: 'Dashboard: Tambah User',
      errors: errors.array()
    });
  } else {
    const {full_name, username, email, password} = req.body;
    const bcryptPassword = await bcrypt.hash(password, saltRounds);

    await User.create({
      uuid: uuidv4(),
      full_name: full_name,
      username: username,
      email: email,
      password: bcryptPassword,
      biodata: {
        uuid: uuidv4(),
        full_name: full_name,
        username: username,
        email: email,
        phone_number: 'No Handphone Belum Diatur',
        address: 'Alamat Belum Diatur'
      }
    }, { include: ['biodata'] });

    req.flash('success', 'Berhasil Menambahkan Data User Baru!');
    res.redirect('/dashboard-admin/users');
  }
};

const updateUser = async (req, res) => {
  const idUser = req.params.uuid;

  try {
    const data = await User.findOne({
      where: {
        uuid: idUser
      },
      include: ['biodata']
    });
  
    res.render('pages/dashboard-admin/dashboard-users-update', {
      layout: 'layouts/dashboard-admin-layouts',
      title: 'Dashboard: Update User',
      data: data,
      username: req.session.username,
    });
  } catch(err) {
    res.render('pages/notfound', {
      layout: 'layouts/error-handling-layouts',
      title: 'Not Found!'
    });
  }
};

const updateUserProcess = async (req, res) => {
  try {
    const {full_name, username, email} = req.body;

    await User.update({
      full_name: full_name,
      email: email,
      username: username,
    }, { where: { id: req.body.id } });

    await UserBiodata.update({
      full_name: full_name,
      email: email,
      username: username
    }, { where: { user_id: req.body.id } });

    req.flash('successUpdate', 'Berhasil Update Data User!');
    res.redirect('/dashboard-admin/users');
  } catch (error) {
    req.flash('failedUpdate', 'Gagal Melakukan Update Data User');
    res.redirect('/dashboard-admin/users')
  }
};

const deleteUser = async (req, res) => {
  const idUser = req.params.uuid;
  // console.info(`Hasil idUser = ${idUser}`);

  try {
    const findUser = await User.findOne({
      where: {
        uuid: idUser
      }
    });

    // console.info(`Hasil findUser = ${findUser}`);

    await UserBiodata.destroy({
      where: {
        user_id: findUser.id
      }
    });

    await User.destroy({
      where: {
        uuid: idUser
      }
    });
  
    req.flash('successUpdate', 'Berhasil Hapus Data User!');
    res.redirect('/dashboard-admin/users');
  } catch(err) {
    console.info(err);
  }
};

module.exports = {
  dashboardAdmin,
  recentPlaysUsers,
  showAllUsers,
  detailUser,
  addUser,
  addUserProcess,
  updateUser,
  updateUserProcess,
  deleteUser,
};
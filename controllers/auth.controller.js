const { validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const models = require('../models');
const User = models.User;

let session;

const login = (req, res) => {
  res.render('pages/login', {
    layout: 'layouts/auth-layouts',
    title: 'Login',
    message: req.flash('message'),
    success: req.flash('success')
  });
};

const loginProcess = async (req, res) => {
  // > Catch User Email and Password
  const {username, password} = req.body;
  
  // > Search in db Users 'username' is it the same as the one sent in the form by the user 
  const person = await User.findOne({
    where: {
      username: username
    }
  });

  // > Check username is match
  if (person) {
    // > Check password user (from body) is same in db?
    const checkPassword = await bcrypt.compare(password, person.password)

    // > if password match
    if (checkPassword) {
      session = req.session;
      session.userid = person.id;
      session.uuid = person.uuid;
      session.username = username;
      session.role = person.role;
      console.info(session);
      res.redirect('/');
    }
    // > if email and password dont match
    else {
      req.flash('message', 'Wrong Password!')
      res.redirect('/login');
    }
  } else {
    req.flash('message', 'Username / Password False');
    res.redirect('/login');
  }
};

const register = (req, res) => {
  res.render('pages/register', {
    layout: 'layouts/auth-layouts',
    title: 'Register',
    message: req.flash('message')
  });
};

const registerProcess = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.render('pages/register', {
      layout: 'layouts/auth-layouts',
      title: 'Register',
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

    req.flash('success', 'Success Register Your Account!');
    res.redirect('/login');
  }
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/login');
};

module.exports = {
  login,
  loginProcess,
  register,
  registerProcess,
  logout
}
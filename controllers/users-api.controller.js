const { validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const models = require('../models');
let Users = models.User;
let UserBiodata = models.UserBiodata;

const bcrypt = require('bcrypt');
const saltRounds = 10;

const getAllDataUsers = async (req, res) => {
  try {
    const data = await Users.findAll({
      order: [
        ['id', 'DESC']
      ],
      include: ['biodata', 'histories']
    });

    res.status(200).json({
      status: 'Success',
      statusCode: 200,
      message: 'Data Users Found!',
      data: data.length < 1 ? 'Data User Masih Kosong!' : data
    });

  } catch (err) {
    res.status(400).json({
      status: 'Failed',
      statusCode: 400,
      message: err
    });
  }
};

const getDetailUser = async (req, res) => {
  const userUUID = req.params.uuid;

  let data;

  try {
    data = await Users.findOne({
      where: {
        uuid: userUUID
      },
      include: ['biodata', 'histories']
    });

    res.status(200).json({
      status: 'Success',
      statusCode: 200,
      message: 'Data User Found!',
      data: data
    });

  } catch (err) {
    res.status(400).json({
      status: 'Failed',
      statusCode: 400,
      message: err
    });
  }

  
};

const login = async (req, res) => {
  const {username, password} = req.body;

  const person = await Users.findOne({
    where: {
      username: username
    }
  });

  if (person) {
    const checkPassword = await bcrypt.compare(password, person.password)
    if (checkPassword) {
      res.status(200).json({
        status: 'Success',
        statusCode: 200,
        message: `Hello ${person.username}, login successfully!`
      });
    } else {
      res.status(401).json({
        status: 'Failed',
        statusCode: 401,
        message: 'Wrong Password!'
      });
    }
  } else {
    res.status(400).json({
      status: 'Failed',
      statusCode: 400,
      message: err
    });
  }
};

const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      status: 'Failed',
      statusCode: 400,
      message: 'Oops! something error',
      errors: errors.array()
    });
  } else {
    const {full_name, username, email, password} = req.body;
    const bcryptPassword = await bcrypt.hash(password, saltRounds);

    try {
      await Users.create({
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

      res.status(201).json({
        status: 'Success',
        statusCode: 201,
        message: 'Success Add New User!'
      });
    } catch (err) {
      res.status(400).json({
        status: 'Failed',
        statusCode: 400,
        message: err
      });
    }
  }
};

const update = async (req, res) => {
  let data;

  try {
    data = await Users.findOne({
      where: {
        uuid: req.params.uuid
      }
    });
  } catch {
    res.status(404).json({
      status: 'Failed',
      statusCode: 404,
      message: 'User Not Found!'
    });
  }

  try {
    const {full_name, username, email, password} = req.body;
    const bcryptPassword = await bcrypt.hash(password, saltRounds);

    await Users.update({
      full_name: full_name || data.full_name,
      email: email || data.email,
      username: username || data.username,
      password: bcryptPassword || data.password
    }, { where: { id: data.id } });

    await UserBiodata.update({
      full_name: full_name || data.full_name,
      email: email || data.email,
      username: username || data.username
    }, { where: { user_id: data.id } });

    res.status(201).json({
      status: 'Success',
      statusCode: 200,

    });
  } catch (error) {
    res.status(400).json({
      status: 'Failed',
      statusCode: 400,
      message: err
    });
  }
};

const deleteDataUser = async (req, res) => {
  const userUUID = req.params.uuid
  let data;

  try {
    data = await Users.findOne({
      where: {
        uuid: userUUID
      }
    });
  } catch {
    res.status(404).json({
      status: 'Failed',
      statusCode: 404,
      message: 'User Not Found!'
    });
  }

  try {
    await UserBiodata.destroy({
      where: {
        user_id: data.id
      }
    });

    await Users.destroy({
      where: {
        uuid: userUUID
      }
    });

    res.status(204).json({
      status: 'Success',
      statusCode: 204,
      message: 'Success Delete Data User!'
    });
  } catch(err) {
    res.status(400).json({
      status: 'Failed',
      statusCode: 400,
      message: err
    });
  }
};

module.exports = {
  login,
  getAllDataUsers,
  register,
  getDetailUser,
  update,
  deleteDataUser,
};
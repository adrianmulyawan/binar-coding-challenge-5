require('dotenv').config();
const models = require('../../../models');
const User = models.User;
const Room = models.Room;
const bcrypt = require('bcrypt');
const saltRounds = +process.env.SALT_ROUND;

class DashboardAdminController {
    static dashboardAdmin = async (req, res) => {
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
          include: ['profile'],
          order: [
            ['id', 'DESC']
          ],
          limit: 5,
        });
      
        const histories = await Room.findAll({
          include: ['userId1', 'userId2'],
          limit: 5,
        });
      
        console.info(histories, '=> hasilnya gesss');
      
        return res.render('pages/dashboard-admin/dashboard', {
          layout: 'layouts/dashboard-admin-layouts',
          title: 'Dashboard Admin',
          countUser: countUser,
          countAdmin: countAdmin,
          users: users,
          histories: histories,
          username: req.user.dataValues.username,
        });
    };

    static recentPlays = async (req, res) => {
        const histories = await Room.findAll({
            include: ['userId1', 'userId2'],
        });
        
        return res.render('pages/dashboard-admin/dashboard-recents', {
            layout: 'layouts/dashboard-admin-layouts',
            title: 'Dashboard: Hasil Pertandingan',
            histories: histories,
            username: req.user.dataValues.username,
        });
    };

    static showAllUsers = async (req, res) => {
      const items = await User.findAll({
        include: ['profile'],
        order: [
          ['createdAt', 'DESC']
        ]
      });

      console.info(items, '==> Hasil usernya');

      return res.render('pages/dashboard-admin/dashboard-users', {
        layout: 'layouts/dashboard-admin-layouts',
        title: 'Dashboard: Users',
        users: items,
        username: req.user.dataValues.username,
      });
    };

    static detailUser = async (req, res) => {
      const username = req.params.username;
    
      try {
        const data = await User.findOne({
          where: {
            username
          },
          include: ['profile']
        });
      
        res.render('pages/dashboard-admin/dashboard-users-detail', {
          layout: 'layouts/dashboard-admin-layouts',
          title: 'Dashboard: Detail User',
          data: data,
          username: req.user.dataValues.username,
        });
      } catch(err) {
        res.render('pages/notfound', {
          layout: 'layouts/error-handling-layouts',
          title: 'Not Found!'
        });
      }
    };

    static addUser = async (req, res) => {
      res.render('pages/dashboard-admin/dashboard-users-add', {
        layout: 'layouts/dashboard-admin-layouts',
        title: 'Dashboard: Tambah User',
        username: req.session.username,
      });
    };

    static addUserProcess = async (req, res) => {
      try {
        const {username, password} = req.body;
        const bcryptPassword = await bcrypt.hash(password, saltRounds);
    
        await User.create({
          username, 
          password: bcryptPassword,
          profile: {
            fullname: 'Nama Lengkap Belum Diatur',
            email: 'Email Belum Diatur',
            address: 'Alamat Belum Diatur',
            phone_number: 'Nomor Handphone Belum Diatur',
          }
        }, { include: ['profile'] });
        return res.redirect('/dashboard-admin/users');
      } catch (error) {
        console.info(error);
      }
    };
};

module.exports = {
  DashboardAdminController,   
};
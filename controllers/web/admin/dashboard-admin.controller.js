const models = require('../../../models');
const User = models.User;
const Room = models.Room;

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
};

module.exports = {
  DashboardAdminController,   
};
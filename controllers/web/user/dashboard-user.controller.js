const models = require('../../../models');
const Room = models.Room;
const { Op } = require("sequelize");

class DashboardUserController {
    static dashboardAdmin = async (req, res) => {  
        const histories = await Room.findAll({
          include: ['userId1', 'userId2'],
          limit: 10,
          where: {
            [Op.or]: [{ user_id_1: req.user.dataValues.id }, { user_id_2: req.user.dataValues.id }]
          }
        });
      
        console.info(histories, '=> hasilnya gesss');
      
        return res.render('pages/dashboard-user/dashboard', {
          layout: 'layouts/dashboard-user-layouts',
          title: 'Dashboard User',
          histories: histories,
          username: req.user.dataValues.username,
        });
    };
};

module.exports = {
    DashboardUserController,
};
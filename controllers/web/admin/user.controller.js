const models = require('../../../models');
const User = models.User;

class UserController {
  static findAllUser = async (req, res) => {
    try {
      const items = await User.findAll({
        where: {
          role: 'USER'
        },
        order: [
          ['createdAt', 'DESC']
        ],
        include: ['profile', 'rooms1', 'rooms2']
      });

      return res.status(200).json({
        status: 'Success',
        statusCode: 200,
        message: 'Data Users Found!',
        data: items.length < 1 ? 'Sorry, Data User is Empty!' : items
      });
    } catch (error) {
      return res.status(400).json({
        status: 'Failed',
        statusCode: 400,
        message: 'Error Found!',
        error: error
      });
    }
  };

  static findUserById = async (req, res) => {
    try {
      const data = await User.findByPk(req.params.id, {
        include: ['profile']
      });

      if (!data) {
        return res.status(404).json({
          status: 'Failed',
          statusCode: 404,
          message: 'Sorry User is Not Found!'
        });
      }

      return res.status(200).json({
        status: 'Success',
        statusCode: 200,
        message: 'Data User Found!',
        data: data
      });
    } catch (error) {
      return res.status(400).json({
        status: 'Failed',
        statusCode: 400,
        message: 'Error Found!',
        error: error
      });
    }
  };
};

module.exports = {
  UserController
}
const models = require('../../../models');
const User = models.User;

class UserController {
  static findAllUser = async (req, res) => {
    try {
      const items = await User.findAll({
        order: [
          ['createdAt', 'DESC']
        ],
        include: ['rooms1', 'rooms2']
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
  }
};

module.exports = {
  UserController
}
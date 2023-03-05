const models = require('../../../models');
const Room = models.Room;

class RoomAdminController {
  static getAllRooms = async (req, res) => {
    try {
      const items = await Room.findAll({
        order: [
          ['createdAt', 'DESC']
        ],
        include: ['userId1', 'userId2', 'roomfights']
      });

      return res.status(200).json({
        status: 'Success',
        statusCode: 200,
        message: 'Data Rooms Found!',
        data: items.length < 1 ? 'Sorry, Data Rooms is Empty!' : items
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

  static getDetailRoom = async (req, res) => {
    try {
      const room_code = req.params.room_code;
      const data = await Room.findOne({
        where: {
          room_code
        }, 
        include: ['userId1', 'userId2', 'roomfights']
      });

      if (!data) {
        return res.status(404).json({
          status: 'Failed',
          statusCode: 404,
          message: 'Sorry Room is Not Found!'
        });
      }

      return res.status(200).json({
        status: 'Success',
        statusCode: 200,
        message: 'Data Room Found!',
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
  RoomAdminController
};
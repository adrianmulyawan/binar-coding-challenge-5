const models = require('../../models');
const Room = models.Room;
const crypto = require('crypto');

class RoomController {
  static createRoom = async (req, res) => {
    try {
      const random_num = Math.floor(Math.random() * 100);
      const random_string = crypto.randomBytes(2).toString('hex');
      
      const room_code = `binar-${random_string}-${random_num}`;

      const createRoom = await Room.create({
        room_code: room_code,
        user_id_1: req.user.id,
        user_id_2: null,
        start_fight: null,
        finish_fight: null,
        winner_user_id: null
      });

      return res.status(201).json({
        status: 'Success!',
        statusCode: 201,
        message: 'Success Create New Room!',
        data: createRoom
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
  RoomController
};
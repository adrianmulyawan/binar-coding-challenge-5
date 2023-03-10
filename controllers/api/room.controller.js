const models = require('../../models');
const Room = models.Room;
const RoomFight = models.RoomFight;
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

  static inviteFriend = async (req, res) => {
    try {
      const room_code = req.params.room_code
      const findRoom = await Room.findOne({
        where: {
          room_code
        }
      });

      if (!findRoom) {
        return res.status(404).json({
          status: 'Failed',
          statusCode: 404,
          message: 'Sorry Room is Not Found!'
        });
      }

      const updateRoom = await findRoom.update({
        user_id_2: req.body.user_id_2
      });

      return res.status(201).json({
        status: 'Success',
        statusCode: 201,
        message: 'Success Invite Friend!',
        data: updateRoom
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

  static startFight = async (req, res) => {
    try {
      // > Cari room
      const room_code = req.params.room_code
      const findRoom = await Room.findOne({
        where: {
          room_code
        }
      });
      // > Jika room tidak ditemukan
      if (!findRoom) {
        return res.status(404).json({
          status: 'Failed',
          statusCode: 404,
          message: 'Sorry Room is Not Found!'
        });
      }

      // > Hitung jumlah permain
      const countFightRoom = await RoomFight.count({
        where: {
          room_id: findRoom.id
        }
      });
      // > Jika suit = 0 kita update start_fight pada tabel room
      if (countFightRoom === 0) {
        await findRoom.update({
          start_fight: new Date()
        });
      }
      // > Jika suit > 3x round makan return kesalahan
      if (countFightRoom > 3) {
        return res.status(400).json({
          status: 'Failed',
          statusCode: 400,
          message: 'You Have Played More than 3 Times'
        });
      }
      
      // > Tangkap pilihan user 1 dan user 2, dan result
      const { pil_user_1, pil_user_2 } = req.body;
      let result = null;

      if (pil_user_1.toUpperCase() !== 'GUNTING' && pil_user_1.toUpperCase() !== 'BATU' && pil_user_1.toUpperCase() !== 'KERTAS') {
        return res.status(400).json({
          status: 'Success',
          statusCode: 400,
          message: 'Player 1 Input is Wrong!'
        });
      }

      if (pil_user_2.toUpperCase() !== 'GUNTING' && pil_user_2.toUpperCase() !== 'BATU' && pil_user_2.toUpperCase() !== 'KERTAS') {
        return res.status(400).json({
          status: 'Success',
          statusCode: 400,
          message: 'Player 2 Input is Wrong!'
        });
      }

      if (pil_user_1.toUpperCase() === pil_user_2.toUpperCase()) {
        return res.status(200).json({
          message: 'PERTANDINGAN SERI'
        })
      } else if (pil_user_1.toUpperCase() === 'BATU') {
        result = (pil_user_2.toUpperCase() === 'GUNTING') ? 1 : 2
      } else if (pil_user_1.toUpperCase() === 'GUNTING') {
        result = (pil_user_2.toUpperCase() === 'KERTAS') ? 1 : 2
      } else if (pil_user_1.toUpperCase() === 'KERTAS') {
        result = (pil_user_2.toUpperCase() === 'BATU') ? 1 : 2
      }

      // > Buat variable untuk simpan data kedalam tabel table RoomFights
      const createResultFight = await RoomFight.create({
        room_id: findRoom.id,
        pil_user_1,
        pil_user_2,
        winner_user: result
      });

      // > Jika suit = 3 kita update finish_fight dan winner_user_id pada tabel room
      if (countFightRoom === 2) {
        // > Cari Pemenang Tiap Round
        const resultFight = await RoomFight.findAll({
          where: {
            room_id: findRoom.id
          }
        });

        let user1 = 0;
        let user2 = 0;
        resultFight.forEach(row => {
          if (row.winner_user === 1) {
            user1++;
          } else if (row.winner_user === 2) {
            user2++;
          }
        });

        const winner = (user1 > user2) ? findRoom.user_id_1 : findRoom.user_id_2;

        const winnerNumber = (user1 > user2) ? 1 : 2;

        const point = (user1 > user2) ? user1 : user2;

        // > Update data tabel room
        await findRoom.update({
          finish_fight: new Date(),
          winner_user_id: winner
        });

        return res.status(200).json({
          status: 'Success',
          statusCode: 200,
          message: `Pemenang ronde ini adalah player ${result} dan pemenang akhir pada game ini adalah player ${winnerNumber} dengan jumlah point ${point}`
        });
      }

      // > Return pemenang ronde
      return res.status(200).json({
        status: 'Success',
        statusCode: 200,
        message: `Pemenang ronde ini adalah player ${result}`
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
  RoomController
};
const models = require('../../models');
const Room = models.Room;
const RoomFight = models.RoomFight;
const crypto = require('crypto');

class RoomController {
  // > Method untuk membuat room pertandingan game suwit jepang
  static createRoom = async (req, res) => {
    try {
      // > 2 variable ini digunakan untuk generate random number
      const random_num = Math.floor(Math.random() * 100);
      const random_string = crypto.randomBytes(2).toString('hex');
      
      // > Rangkai 2 variable diatas untuk menjadi room code 
      // => room code ini akan dicari oleh player 2 untuk bermain game
      const room_code = `binar-${random_string}-${random_num}`;

      // > Buat room permainannya
      const createRoom = await Room.create({
        room_code: room_code, // diambil dari variable room_code
        user_id_1: req.user.id, // diambil dari user yang login
        user_id_2: null, // kita buat null, karena belum ada user dan permainan belum dimulai
        start_fight: null, // kita buat null, karena belum ada user dan permainan belum dimulai
        finish_fight: null, // kita buat null, karena belum ada user dan permainan belum dimulai
        winner_user_id: null // kita buat null, karena belum ada user dan permainan belum dimulai
      });

      // > Beri respon jika room berhasil dibuat
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

  // > Method untuk handle proses invite musuh
  static inviteFriend = async (req, res) => {
    try {
      // > Tangkap dulu params yang dikirimkan
      const room_code = req.params.room_code

      // > Cek apakah terdapat room_code yang ada di db = room code yang dikirimkan sebagai parameter
      const findRoom = await Room.findOne({
        where: {
          room_code
        }
      });

      // > Bila room tidak ditemukan
      // => return 404
      if (!findRoom) {
        return res.status(404).json({
          status: 'Failed',
          statusCode: 404,
          message: 'Sorry Room is Not Found!'
        });
      }

      // > Room ditemukan (update table room)
      // # Update user_id_2 dengan user yang dikirimkan melalui body
      const updateRoom = await findRoom.update({
        user_id_2: req.body.user_id_2
      });

      // > Return 201 (success update)
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

  // > Logic untuk pertandingan suwit
  static startFight = async (req, res) => {
    try {
      // > Cari room
      // => Tangkap room codenya 
      const room_code = req.params.room_code
      // => Cari didalam db apakah ada data dikolom room_code tabel 'Rooms' 
      // => Yang room_code = room_code (dari params)
      const findRoom = await Room.findOne({
        where: {
          room_code
        }
      });

      console.info(findRoom, '==> room ditemukan gak?');

      // > Jika room tidak ditemukan
      if (!findRoom) {
        return res.status(404).json({
          status: 'Failed',
          statusCode: 404,
          message: 'Sorry Room is Not Found!'
        });
      }

      // > Hitung jumlah permain untuk room_code ini (room_id berapa jumlah putaran permainan)
      // => yang nantinya akan dihitung didalam tabel RoomFights (maksimal 3x suit)
      // => perhitungan (count) dilakukan berdasarkan room_id dari tabel 'RoomFights' === id dari tabel 'Rooms'
      const countFightRoom = await RoomFight.count({
        // > Cari 'room_id' = id dari variable 'findRoom'
        where: {
          room_id: findRoom.id
        }
      });

      console.info(countFightRoom, 'ini count fight room');

      // > Jika suit = 0 (pertama kali suit) kita update start_fight pada tabel rooms
      // => Index dimulai dari 0
      if (countFightRoom === 0) {
        await findRoom.update({
          start_fight: new Date()
        });
      }
      // > Jika suit > 3x round makan return kesalahan (return sudah bermain lebih dari 3x)
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

      // > Cek inputan user (player 1)
      if (pil_user_1.toUpperCase() !== 'GUNTING' && pil_user_1.toUpperCase() !== 'BATU' && pil_user_1.toUpperCase() !== 'KERTAS') {
        // => Jika inputan bukan gunting, batu atau kertas (return pesan kesalahan)
        return res.status(400).json({
          status: 'Failed',
          statusCode: 400,
          message: 'Player 1 Input is Wrong!'
        });
      }

      // > Cek inputan user (player 2)
      if (pil_user_2.toUpperCase() !== 'GUNTING' && pil_user_2.toUpperCase() !== 'BATU' && pil_user_2.toUpperCase() !== 'KERTAS') {
        // => Jika inputan bukan gunting, batu atau kertas (return pesan kesalahan)
        return res.status(400).json({
          status: 'Failed',
          statusCode: 400,
          message: 'Player 2 Input is Wrong!'
        });
      }

      // > Logic suwit
      // => akan memberikan id user yang menang pada kolom winner_user di table RoomFights
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

      // > Jika suit = 3x kita update finish_fight dan winner_user_id pada tabel room
      if (countFightRoom === 2) {
        // > Cari Pemenang Tiap Round
        const resultFight = await RoomFight.findAll({
          // => Pencarian berdasarkan room_id (ada apa tidak room_id ini)
          where: {
            room_id: findRoom.id
          }
        });

        console.info(resultFight, 'hasil dari result fight');

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
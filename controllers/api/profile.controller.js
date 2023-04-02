const models = require('../../models');
const Profile = models.Profile;

class ProfileController {
  // > Function to Show Profile User Login
  static showProfile = async (req, res) => {
    try {
      // console.info(req.user);

      // > Destructuring id berdasarkan user yang login 
      const { id } = req.user;

      // > Cari profile dengan user_id = id user yang login
      const profile = await Profile.findOne({
        where: {
          user_id: id
        }
      });

      // > Bila data tidak ditemukan
      if (!profile) {
        return res.status(404).json({
          status: 'Failed',
          statusCode: 404,
          message: 'Profile Not Found!'
        });
      }

      // > Bila data ditemukan
      return res.status(200).json({
        status: 'Success',
        statusCode: 200,
        message: 'Data Profile Found!',
        data: profile
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

  // > Function to Edit Profile User Login
  static editProfile = async (req, res) => {
    try {
      // > Destructuring id dari user yang sedang login
      const { id } = req.user;

      // > Cari profile user (user_id) berdasarkan id user yang login
      const profile = await Profile.findOne({
        where: {
          user_id: id
        }
      });
      
      // > Bila profile tidak ditemukan
      if (!profile) {
        return res.status(404).json({
          status: 'Failed',
          statusCode: 404,
          message: 'Profile Not Found!'
        });
      }

      // > Update profile
      const updateProfile = await profile.update({
        // => terdapat 2 kondisi
        // # req.body.namaBody : apabila user mengisikan data form yang akan diedit
        // # profile.namaBody : apabila user tidak isi formnya, maka akan digunakan nilai lamanya (yang diambil dari db)
        fullname: req.body.fullname || profile.fullname, 
        email: req.body.email || profile.email,
        address: req.body.address || profile.address,
        phone_number: req.body.phone_number || profile.phone_number,
      });

      // > Sukses update data profile user
      return res.status(201).json({
        status: 'Success',
        statusCode: 201,
        message: `Success Update Data Profile ${req.user.username}`,
        data: updateProfile
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
  ProfileController,
};
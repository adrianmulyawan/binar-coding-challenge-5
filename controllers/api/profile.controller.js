const models = require('../../models');
const Profile = models.Profile;

class ProfileController {
  // > Function to Show Profile User Login
  static showProfile = async (req, res) => {
    try {
      console.info(req.user);

      const profile = await Profile.findOne({
        where: {
          user_id: req.user.id
        }
      });

      if (!profile) {
        return res.status(404).json({
          status: 'Failed',
          statusCode: 404,
          message: 'Profile Not Found!'
        });
      }

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
      const profile = await Profile.findOne({
        where: {
          user_id: req.user.id
        }
      });

      if (!profile) {
        return res.status(404).json({
          status: 'Failed',
          statusCode: 404,
          message: 'Profile Not Found!'
        });
      }

      const updateProfile = await profile.update({
        fullname: req.body.fullname || profile.fullname,
        email: req.body.email || profile.email,
        address: req.body.address || profile.address,
        phone_number: req.body.phone_number || profile.phone_number,
      });

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
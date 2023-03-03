const models = require('../../models');
const Profile = models.Profile;

class ProfileController {
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
};

module.exports = {
  ProfileController,
};
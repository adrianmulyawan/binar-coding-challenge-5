const router = require('express').Router();

// > Controller 
const { AuthController } = require('../../controllers/api/auth.controller');
const { ProfileController } = require('../../controllers/api/profile.controller');
const { RoomController } = require('../../controllers/api/room.controller');

// > Middleware 
const CheckDuplicate = require('../../middlewares/checkDuplicate.middleware');
const CheckTokenAuth = require('../../middlewares/jwtRestrict.middleware');

// ========================================================================

// > Route: Route Hello
router.get('/api/v1/hello', (req, res) => {
  return res.status(200).json({
    status: 'Success',
    statusCode: 200,
    message: 'Hello Deck!'
  });
});

// > Route: Authtentication
router.post('/api/v1/register', [
  CheckDuplicate.checkUsername
], AuthController.userRegister);
router.post('/api/v1/login', AuthController.loginWithJWT);

// > Route: Check User Login
router.get('/api/v1/user-login', [
  CheckTokenAuth.isAuthenticated
], AuthController.whoAmI);

// > Route: Check Profile User dan Edit Profile User
router.get('/api/v1/user/profile', [
  CheckTokenAuth.isAuthenticated
], ProfileController.showProfile);
router.put('/api/v1/user/profile-edit', [
  CheckTokenAuth.isAuthenticated
], ProfileController.editProfile);

// > Route: Room
// > Route: Generate new room
router.post('/api/v1/room/create', [
  CheckTokenAuth.isAuthenticated
], RoomController.createRoom);
// > Route: Add friend to room
router.put('/api/v1/room/invite/:room_code', [
  CheckTokenAuth.isAuthenticated
], RoomController.inviteFriend);
// > Route: Start Fight
router.post('/api/v1/room/fight/:room_code', [
  CheckTokenAuth.isAuthenticated
], RoomController.startFight);

module.exports = router;
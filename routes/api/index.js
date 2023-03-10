const router = require('express').Router();

// > Controller 
const { AuthController } = require('../../controllers/api/auth.controller');
const { ProfileController } = require('../../controllers/api/profile.controller');
const { RoomController } = require('../../controllers/api/room.controller');
// > Controller Admin
const { UserController } = require('../../controllers/api/admin/user.controller');
const { RoomAdminController } = require('../../controllers/api/admin/room.controller');

// > Middleware 
const CheckDuplicate = require('../../middlewares/checkDuplicate.middleware');
const CheckTokenAuth = require('../../middlewares/jwtRestrict.middleware');
const CheckRole = require('../../middlewares/checkRole.middleware');

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
  CheckTokenAuth.isAuthenticated,
  CheckRole.isUser
], RoomController.createRoom);
// > Route: Add friend to room
router.put('/api/v1/room/invite/:room_code', [
  CheckTokenAuth.isAuthenticated,
  CheckRole.isUser
], RoomController.inviteFriend);
// > Route: Start Fight
router.post('/api/v1/room/fight/:room_code', [
  CheckTokenAuth.isAuthenticated,
  CheckRole.isUser
], RoomController.startFight);

// ========================================================================

// > Admin Route
// => User
router.get('/api/v1/user/find', [
  CheckTokenAuth.isAuthenticated,
  CheckRole.isAdmin
], UserController.findAllUser);
router.get('/api/v1/user/find/:id', [
  CheckTokenAuth.isAuthenticated,
  CheckRole.isAdmin
], UserController.findUserById);

// => Room
router.get('/api/v1/room/find', [
  CheckTokenAuth.isAuthenticated,
  CheckRole.isAdmin
], RoomAdminController.getAllRooms);
router.get('/api/v1/room/find/:room_code', [
  CheckTokenAuth.isAuthenticated,
  CheckRole.isAdmin
], RoomAdminController.getDetailRoom);

module.exports = router;
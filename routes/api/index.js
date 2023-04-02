const router = require('express').Router();

// > Controller 
// => Controller to handle logic login and register
const { AuthController } = require('../../controllers/api/auth.controller');
const { ProfileController } = require('../../controllers/api/profile.controller');
const { RoomController } = require('../../controllers/api/room.controller');
// > Controller Admin
const { UserController } = require('../../controllers/api/admin/user.controller');
const { RoomAdminController } = require('../../controllers/api/admin/room.controller');

// > Middleware 
// => Check duplicate username when register process
const CheckDuplicate = require('../../middlewares/checkDuplicate.middleware');
// => Check token jwt user login
const CheckAuthenticated = require('../../middlewares/jwtRestrict.middleware');
// => Check user role (masing-masing role memiliki batasan akses masing-masing)
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
// => Register
// # Terdapat 1 middleware untuk check apakah username yang diinputkan sudah terdaftar atau belum
router.post('/api/v1/register', [
  CheckDuplicate.checkUsername
], AuthController.userRegister);
// => Login
// # Tapi kita perlu autentikasi dahulu dengan middleware untuk cek apakah request user yang dikirim valid apa tidak
// # Atau mengecek user mengirimkan token yang valid atau tidak 
// # Middleware ini kita simpan didalam ./lib/passport-jwt.js dan kita panggil di server-jwt.js
router.post('/api/v1/login', AuthController.loginWithJWT);

// > Route: Check User Login
// => Terdapat middleware untuk check user memiliki token yang valid / tidak
router.get('/api/v1/user-login', [
  CheckAuthenticated.isAuthenticated
], AuthController.whoAmI);

// > Route: Check Profile User dan Edit Profile User
router.get('/api/v1/user/profile', [
  CheckAuthenticated.isAuthenticated
], ProfileController.showProfile);
router.put('/api/v1/user/profile-edit', [
  CheckAuthenticated.isAuthenticated
], ProfileController.editProfile);

// > Route: Room
// => Route: Generate new room
// # Di route ini hanya user dengan role = user player yang dapat buat room
// # Terdapat pengecekan juga harus user yang telah login / token valid yang bisa buat room
router.post('/api/v1/room/create', [
  CheckAuthenticated.isAuthenticated,
  CheckRole.isUser
], RoomController.createRoom);
// => Route: Add friend to room
// # Di route ini hanya user dengan role = user player yang dapat di invite
// # Terdapat pengecekan token user
router.put('/api/v1/room/invite/:room_code', [
  CheckAuthenticated.isAuthenticated,
  CheckRole.isUser
], RoomController.inviteFriend);
// > Route: Start Fight
// # Di route ini hanya user dengan role = user player yang dapat di invite
// # Terdapat pengecekan token user
router.post('/api/v1/room/fight/:room_code', [
  CheckAuthenticated.isAuthenticated,
  CheckRole.isUser
], RoomController.startFight);

// ========================================================================

// > Admin Route
// => User (Menampilkan seluruh data user yang role = user player)
router.get('/api/v1/user/find', [
  CheckAuthenticated.isAuthenticated,
  CheckRole.isAdmin
], UserController.findAllUser);
// => Menampilkan detail player yang role = user player
router.get('/api/v1/user/find/:id', [
  CheckAuthenticated.isAuthenticated,
  CheckRole.isAdmin
], UserController.findUserById);

// => Room
router.get('/api/v1/room/find', [
  CheckAuthenticated.isAuthenticated,
  CheckRole.isAdmin
], RoomAdminController.getAllRooms);
router.get('/api/v1/room/find/:room_code', [
  CheckAuthenticated.isAuthenticated,
  CheckRole.isAdmin
], RoomAdminController.getDetailRoom);

module.exports = router;
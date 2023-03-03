require('dotenv').config();
const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const User = require('../models').User;

// > Verify JWT
const options = {
  // > Untuk mengekstrak JWT, dan ambil token dari header (authorization)
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),

  // > Secret Key
  secretOrKey: process.env.SECRET_KEY
};

passport.use(new JwtStrategy(options, async (payload, done) => {
  // > Payload adalah hasil terjemahan JWT, sesuai dengan apa yang kita masukan di parameter pertama dari JWT
  User.findByPk(payload.id)
    .then(user => done(null, user))
    .catch(error => done(error, false));
}));

module.exports = passport;
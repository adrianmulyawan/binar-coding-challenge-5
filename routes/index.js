const express = require('express');
const sessions = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const router = express.Router();
const authRouter = require('./auth.route');
const mainRouter = require('./main.route');
const usersAPIRouter = require('./users-api.route');
const adminDashboardRouter = require('./dashboard-admin.route');

// > Set Cookies (using express-session)
// # Set session age
const oneDay = 1000 * 60 * 60 * 24;
// # Create session
router.use(sessions({
  secret: 'thisismysecretkeyfhrgfgrfrty84fwir767',
  saveUninitialized: true,
  cookie: {
    maxAge: oneDay
  },
  resave: false
}));

// > User Package method-override
router.use(methodOverride('_method'));

// > Set Cookie Parser
router.use(cookieParser());

// > Use Connect Flash
router.use(flash());

// > Route user api
router.use(usersAPIRouter);

// > Built in middleware (check user login access login or register)
router.use((req, res, next) => {
  if (req.session.userid) {
    if (req.url === '/login' || req.url === '/register') {
      res.redirect('/');
    } else {
      next();
    }
  } else {
    next();
  }
});

// > Route authentication
router.use(authRouter);

// > Built in middleware (check if user login or not)
router.use((req, res, next) => {
  // if user have session
  if (req.session.userid) {
    // user can access index and game
    next();
  }
  // if user dont login
  else {
    // user redirect to login page
    res.redirect('/login');
  }
});

// > Route main (index and game)
router.use(mainRouter);

// > Middelare to check user admin or not
router.use((req, res, next) => {
  if (req.session.role === 'ADMIN') {
    next();
  } else {
    res.redirect('/login');
  }
});

// > Route dashboard admin
router.use(adminDashboardRouter);

module.exports = router;
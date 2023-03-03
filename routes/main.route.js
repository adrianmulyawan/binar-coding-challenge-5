const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  // console.log(req.session);
  res.render('pages/index', {
    layout: 'layouts/main-layouts',
    title: 'Temple Run',
    username: req.session.username,
    checkRole: req.session.role
  });
});

router.get('/game', (req, res) => {
  res.render('pages/game', {
    layout: 'layouts/game-layouts',
    title: 'ROCK, PAPER, SCISSORS GAME',
    checkRole: req.session.role
  });
});

module.exports = router;
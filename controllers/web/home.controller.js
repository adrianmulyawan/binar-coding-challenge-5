class HomeController {
  // > Method Handle Halaman Utama
  static getHomePage = (req, res) => {
    // console.log(req.session);
    res.render('pages/index', {
      layout: 'layouts/main-layouts',
      title: 'Temple Run',
      username: req.session.username,
      checkRole: req.session.role
    });
  };

  // > Method Handle Halaman Game
  static getGamePage = (req, res) => {
    res.render('pages/game', {
      layout: 'layouts/game-layouts',
      title: 'ROCK, PAPER, SCISSORS GAME',
      checkRole: req.session.role
    });
  };
};

module.exports = {
  HomeController,
};
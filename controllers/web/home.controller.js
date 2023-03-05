class HomeController {
  // > Method Handle Halaman Utama
  static getHomePage = (req, res) => {
    // console.log(req.session);
    res.render('pages/index', {
      layout: 'layouts/main-layouts',
      title: 'Temple Run',
      username: req.user.username,
      checkRole: req.user.role
    });
  };

  // > Method Handle Halaman Game
  static getGamePage = (req, res) => {
    res.render('pages/game', {
      layout: 'layouts/game-layouts',
      title: 'ROCK, PAPER, SCISSORS GAME',
      checkRole: req.user.role
    });
  };
};

module.exports = {
  HomeController,
};
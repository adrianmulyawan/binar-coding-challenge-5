class HomeController {
  // > Method Handle Halaman Utama
  static getHomePage = (req, res) => {
    // console.log(req.session);
    return res.render('pages/index', {
      layout: 'layouts/main-layouts',
      title: 'Temple Run',
      username: req.user.dataValues.username,
      checkRole: req.user.dataValues.role
    });
  };

  // > Method Handle Halaman Game
  static getGamePage = (req, res) => {
    return res.render('pages/game', {
      layout: 'layouts/game-layouts',
      title: 'ROCK, PAPER, SCISSORS GAME',
      checkRole: req.user.dataValues.role
    });
  };
};

module.exports = {
  HomeController,
};
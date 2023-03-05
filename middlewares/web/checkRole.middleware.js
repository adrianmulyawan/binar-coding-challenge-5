const isAdmin = async (req, res, next) => {
  if (req.user.dataValues.role !== 'ADMIN') {
    res.status(404).render('pages/unauthorized', {
        layout: 'layouts/error-handling-layouts',
        title: 'Not Found!'
    });
  }

  next();
};

const isUser = async (req, res, next) => {
  if (req.user.dataValues.role !== 'USER') {
    res.status(404).render('pages/unauthorized', {
        layout: 'layouts/error-handling-layouts',
        title: 'Not Found!'
    });
  }

  next();
};

module.exports = {
  isAdmin,
  isUser
};
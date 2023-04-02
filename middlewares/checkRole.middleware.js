const isAdmin = async (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(401).json({
      status: 'Failed',
      statusCode: 401,
      message: 'Require User Admin Role!'
    });
  }

  next();
};

const isUser = async (req, res, next) => {
  if (req.user.role !== 'USER') {
    return res.status(401).json({
      status: 'Failed',
      statusCode: 401,
      message: 'Require User Player Role!'
    });
  }

  next();
};

module.exports = {
  isAdmin,
  isUser
};
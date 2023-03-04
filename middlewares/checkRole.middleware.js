const isAdmin = async (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({
      status: 'Failed',
      statusCode: 403,
      message: 'Require Admin Role!'
    });
  }

  next();
};

const isUser = async (req, res, next) => {
  if (req.user.role !== 'USER') {
    return res.status(403).json({
      status: 'Failed',
      statusCode: 403,
      message: 'Require User Role!'
    });
  }

  next();
};

module.exports = {
  isAdmin,
  isUser
};
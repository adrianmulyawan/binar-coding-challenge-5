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

module.exports = {
  isAdmin
};
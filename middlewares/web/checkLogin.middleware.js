const isLogin = (req, res, next) => {
  // req.user => didapat dari user yang telah berhasil login
  console.info(req.user);
  if (req.user) {
    // > Jika user telah login makan direct kehalaman ('/')
    return res.redirect('/');
  }

  return next();
};

module.exports = {
  isLogin,
};
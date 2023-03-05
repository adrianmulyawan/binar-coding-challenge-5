const isAuthenticated = (req, res, next) => {
  // > isAuthenticated(): merupakan method dari passport
  // => Jika user telah terautentikasi, maka user dapat lanjut ke handler berikutnya
  if (req.isAuthenticated()) {
    return next();
  }

  // > Bila belum terautentikasi maka user akan dialihkan kehalaman login
  return res.redirect('/login');
};

module.exports = {
  isAuthenticated,
};

require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const expressLayouts = require('express-ejs-layouts');
const passport = require('./lib/passport-jwt');
const router = require('./routes/web');

const app = express();
const port = +process.env.PORT;

// > Set ejs to view engine
app.set('view engine', 'ejs');
// > Set express-ejs-layouts
app.use(expressLayouts);

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));

// > Use passport jwt to http server
app.use(passport.initialize());

app.use(router);

// > Error Handling Middleware
// # When error = 500 (Internal Server Error)
app.use((err, req, res, next) => {
  res.status(500).render('pages/internal-server-error', {
    layout: 'layouts/error-handling-layouts',
    title: 'Something Error!'
  })
});
// # When error = 404 (Not Found)
app.use((req, res, next) => {
  res.status(404).render('pages/notfound', {
    layout: 'layouts/error-handling-layouts',
    title: 'Not Found!'
  });
});

app.listen(port, () => {
  console.info(`${new Date()} | Express run in port ${port}`);
});
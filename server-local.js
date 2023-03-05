require('dotenv').config();
const express = require('express');
const session = require('express-session');
const flash = require('express-flash');
const morgan = require('morgan');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
const router = require('./routes/web');

const app = express();
const port = +process.env.PORT;

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(express.static('public'));

app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false
}));

// > User Package method-override
router.use(methodOverride('_method'));

// > Set ejs to view engine
app.set('view engine', 'ejs');
// > Set express-ejs-layouts
app.use(expressLayouts);

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
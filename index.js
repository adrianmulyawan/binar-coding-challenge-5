// > Import module
const express = require('express');
const morgan = require('morgan');
const expressLayouts = require('express-ejs-layouts');
const router = require('./routes/index');

// > Instance express and create port
const app = express();
const port = 3000;

// > Set ejs to view engine
app.set('view engine', 'ejs');
// > Set express-ejs-layouts
app.use(expressLayouts);

// > Built in middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// > Third party middleware
app.use(morgan('dev'));

// > Routes
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

// > Run express
app.listen(port, () => {
  console.info(`Express run in port ${port}`);
});
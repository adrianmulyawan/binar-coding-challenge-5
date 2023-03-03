require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const router = require('./routes/api');

const app = express();
const port = +process.env.PORT;

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));

app.use(router);

// > Error Handling Middleware
// # When error = 500 (Internal Server Error)
app.use((err, req, res, next) => {
  res.status(500).json({
    status: 'Failed',
    statusCode: 500,
    message: 'Oops! Something Error!'
  })
});
// # When error = 404 (Not Found)
app.use((req, res, next) => {
  res.status(404).json({
    status: 'Failed',
    statusCode: 404,
    message: 'Sorry, End Point is Not Found!'
  });
});

app.listen(port, () => {
  console.info(`${new Date()} | Express run in port ${port}`);
});
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

app.listen(port, () => {
  console.info(`${new Date()} | Express run in port ${port}`);
});
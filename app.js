const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;
const { ERROR_NOT_FOUND } = require('./utils/errors');

const users = require('./routes/users');
const cards = require('./routes/cards');

const app = express();

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '62e4facf385cb3fe69b99b62',
  };
  next();
});
app.use(users);
app.use(cards);

app.use('*', (req, res) => {
  res.status(ERROR_NOT_FOUND).send({ message: 'Неверный путь' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

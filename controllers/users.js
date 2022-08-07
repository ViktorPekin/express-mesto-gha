const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { ERROR_NOT_FOUND, ERROR_BAD_REQUEST, ERROR_INTERNAL_SERVER } = require('../utils/errors');

const errors = (err, res, messageErrors) => {
  if (err === 'CastError') {
    return res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден.' });
  }
  if (err === 'ValidationError') {
    return res.status(ERROR_BAD_REQUEST).send({ message: messageErrors });
  }
  return res.status(ERROR_INTERNAL_SERVER).send({ message: 'Произошла ошибка' });
};

exports.checkId = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (user === null) {
        errors('CastError', res, 'Пользователя с данным _id не существует');
        return;
      }
      next();
    });
};

exports.checkValidId = (req, res, next) => {
  if (req.params.id.length !== 24) {
    errors('ValidationError', res, 'Передан некорректный _id');
    return;
  }
  next();
};

exports.getUsers = (req, res) => {
  User.find({}).then((user) => res.send({ user }))
    .catch((err) => errors(err.name, res));
};

exports.getUserById = (req, res) => {
  User.findById(req.params.id)
    .then((user) => res.send({ user }))
    .catch((err) => errors(err.name, res));
};

exports.createUser = (req, res) => {
  const { email } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create(
      {
        email,
        password: hash,
      },
    ))
    .then((user) => res.send({ user }))
    .catch((err) => errors(err.name, res, 'Переданы некорректные данные при добавления профиля.'));
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};

exports.patchUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: true,
    },
  )
    .then((user) => res.send({ user }))
    .catch((err) => errors(err.name, res, 'Переданы некорректные данные при обновлении профиля.'));
};

exports.patchAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: true,
    },
  )
    .then((user) => res.send({ user }))
    .catch((err) => errors(err.name, res, 'Переданы некорректные данные при обновлении аватара.'));
};

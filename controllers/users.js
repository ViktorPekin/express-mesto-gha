const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const BadRequestError = require('../utils/BadRequestError');
const RepetitionError = require('../utils/RepetitionError');
const NotFoundError = require('../utils/NotFoundError');

exports.getUserMe = (req, res, next) => {
  User.findById(req.user._id).then((user) => res.send({ user }))
    .catch(next);
};

exports.getUsers = (req, res, next) => {
  User.find({}).then((user) => res.send({ user }))
    .catch(next);
};

exports.getUserById = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователя с данный Id не существует');
      } else {
        res.send({ user });
      }
    })
    .catch(next);
};

exports.createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create(
      {
        email: req.body.email,
        password: hash,
        name,
        about,
        avatar,
      },
    ))
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.code === 11000) {
        throw new RepetitionError('Пользователь с таким Email уже существует');
      } else {
        throw new BadRequestError('Переданы некорректные данные при регистрации.');
      }
    })
    .catch(next);
};

exports.login = (req, res, next) => {
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
    .catch(next);
};

exports.patchUser = (req, res, next) => {
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
    .catch(() => {
      throw new BadRequestError('Переданы некорректные данные при обновлении профиля.');
    })
    .catch(next);
};

exports.patchAvatar = (req, res, next) => {
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
    .catch(() => {
      throw new BadRequestError('Переданы некорректные данные при обновлении аватара.');
    })
    .catch(next);
};

const User = require('../models/user');

const errors = (err, res, messageErrors) => {
  if (err === 'CastError') {
    return res.status(404).send({ message: 'Пользователь с указанным _id не найден.' });
  }
  if (err.name === 'ValidationError') {
    return res.status(400).send({ message: messageErrors });
  }
  return res.status(500).send({ message: 'Произошла ошибка' });
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

exports.postUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ user }))
    .catch((err) => errors(err.name, res, 'Переданы некорректные данные при добавления профиля.'));
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

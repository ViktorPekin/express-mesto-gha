const Card = require('../models/card');

const errors = (err, res, messageErrors) => {
  if (err.name === 'CastError') {
    return res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
  }
  if (err.name === 'ValidationError') {
    return res.status(400).send({ message: messageErrors });
  }
  return res.status(500).send({ message: 'Произошла ошибка' });
};

exports.getCards = (req, res) => {
  Card.find({}).then((card) => res.send({ card }))
    .catch((err) => errors(err, res));
};

exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.send({ card }))
    .catch((err) => errors(err, res));
};

exports.postCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ card }))
    .catch((err) => errors(err, res, 'Переданы некорректные данные при создании карточки'));
};

exports.putLikes = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send({ card }))
    .catch((err) => errors(err, res, 'Переданы некорректные данные для постановки лайка.'));
};

exports.deleteLikes = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send({ card }))
    .catch((err) => errors(err, res, 'Переданы некорректные данные для снятия лайка.'));
};

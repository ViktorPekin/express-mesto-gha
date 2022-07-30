const Card = require('../models/card');
const { ERROR_NOT_FOUND, ERROR_BAD_REQUEST, ERROR_INTERNAL_SERVER } = require('../utils/errors');

const errors = (err, res, messageErrors) => {
  if (err === 'CastError') {
    return res.status(ERROR_NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена.' });
  }
  if (err === 'ValidationError') {
    return res.status(ERROR_BAD_REQUEST).send({ message: messageErrors });
  }
  return res.status(ERROR_INTERNAL_SERVER).send({ message: 'Произошла ошибка' });
};

exports.checkValidId = (req, res, next) => {
  if (req.params.cardId.length !== 24) {
    errors('ValidationError', res, 'Передан некорректный _id');
    return;
  }
  next();
};

exports.checkId = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (card === null) {
        errors('CastError', res, 'Карточки с данным _id не существует');
        return;
      }
      next();
    });
};

exports.getCards = (req, res) => {
  Card.find({}).then((card) => res.send({ card }))
    .catch((err) => errors(err.name, res));
};

exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.send({ card }))
    .catch((err) => errors(err.name, res));
};

exports.postCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ card }))
    .catch((err) => errors(err.name, res, 'Переданы некорректные данные при создании карточки'));
};

exports.putLikes = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send({ card }))
    .catch((err) => errors(err.name, res, 'Переданы некорректные данные для постановки лайка.'));
};

exports.deleteLikes = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send({ card }))
    .catch((err) => errors(err.name, res, 'Переданы некорректные данные для снятия лайка.'));
};

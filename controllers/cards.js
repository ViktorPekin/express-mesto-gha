const Card = require('../models/card');
const NotFoundError = require('../utils/NotFoundError');
const BadRequestError = require('../utils/BadRequestError');

exports.checkValidId = (req, res, next) => {
  if (req.params.cardId.length !== 24) {
    const err = new BadRequestError('Передан некорректный _id');
    next(err);
  } else {
    next();
  }
};

exports.checkId = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (card === null) {
        throw new NotFoundError('Карточки с данным _id не существует');
      }
      next();
    }).catch(next);
};

exports.getCards = (req, res, next) => {
  Card.find({}).then((card) => res.send({ card }))
    .catch(next);
};

exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.send({ card }))
    .catch(next);
};

exports.postCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ card }))
    .catch(() => {
      throw new BadRequestError('Переданы некорректные данные при создании карточки');
    })
    .catch(next);
};

exports.putLikes = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send({ card }))
    .catch(() => {
      throw new BadRequestError('Переданы некорректные данные для постановки лайка.');
    })
    .catch(next);
};

exports.deleteLikes = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send({ card }))
    .catch(() => {
      throw new BadRequestError('Переданы некорректные данные для снятия лайка.');
    })
    .catch(next);
};

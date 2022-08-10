const cardRoutes = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const cardControllers = require('../controllers/cards');

cardRoutes.get('/cards', cardControllers.getCards);
cardRoutes.post(
  '/cards',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().min(2),
    }),
  }),
  cardControllers.postCard,
);

/* cardRoutes.delete('/cards/:cardId', cardControllers.checkValidId); */
cardRoutes.delete('/cards/:cardId', cardControllers.checkId);
cardRoutes.delete('/cards/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().alphanum().length(24),
    }),
  }),
  cardControllers.deleteCard,
);

/* cardRoutes.put('/cards/:cardId/likes', cardControllers.checkValidId); */
cardRoutes.put('/cards/:cardId/likes', cardControllers.checkId);
cardRoutes.put('/cards/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().alphanum().length(24),
    }),
  }),
  cardControllers.putLikes,
);

/* cardRoutes.delete('/cards/:cardId/likes', cardControllers.checkValidId); */
cardRoutes.delete('/cards/:cardId/likes', cardControllers.checkId);
cardRoutes.delete('/cards/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().alphanum().length(24),
    }),
  }),
  cardControllers.deleteLikes,
);

module.exports = cardRoutes;

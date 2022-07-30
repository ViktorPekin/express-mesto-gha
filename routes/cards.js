const cardRoutes = require('express').Router();
const cardControllers = require('../controllers/cards');

cardRoutes.get('/cards', cardControllers.getCards);
cardRoutes.post('/cards', cardControllers.postCard);

cardRoutes.delete('/cards/:cardId', cardControllers.checkValidId);
cardRoutes.delete('/cards/:cardId', cardControllers.checkId);
cardRoutes.delete('/cards/:cardId', cardControllers.deleteCard);

cardRoutes.put('/cards/:cardId/likes', cardControllers.checkValidId);
cardRoutes.put('/cards/:cardId/likes', cardControllers.checkId);
cardRoutes.put('/cards/:cardId/likes', cardControllers.putLikes);

cardRoutes.delete('/cards/:cardId/likes', cardControllers.checkValidId);
cardRoutes.delete('/cards/:cardId/likes', cardControllers.checkId);
cardRoutes.delete('/cards/:cardId/likes', cardControllers.deleteLikes);

module.exports = cardRoutes;

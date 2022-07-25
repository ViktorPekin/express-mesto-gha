const cardRoutes = require('express').Router();
const cardControllers = require('../controllers/cards');

cardRoutes.get('/cards', cardControllers.getCards);
cardRoutes.delete('/cards/:cardId', cardControllers.deleteCard);
cardRoutes.post('/cards', cardControllers.postCard);
cardRoutes.put('/cards/:cardId/likes', cardControllers.putLikes);
cardRoutes.delete('/cards/:cardId/likes', cardControllers.deleteLikes);

module.exports = cardRoutes;

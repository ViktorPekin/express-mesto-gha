const userRoutes = require('express').Router();
const userControllers = require('../controllers/users');

userRoutes.get('/users/me', userControllers.getUser);
userRoutes.patch('/users/me', userControllers.patchUser);
userRoutes.patch('/users/me/avatar', userControllers.patchAvatar);

module.exports = userRoutes;

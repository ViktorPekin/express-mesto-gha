const userRoutes = require('express').Router();
const userControllers = require('../controllers/users');

userRoutes.get('/users', userControllers.getUsers);
userRoutes.get('/users/:id', userControllers.checkValidId);
userRoutes.get('/users/:id', userControllers.checkId);
userRoutes.get('/users/:id', userControllers.getUserById);
userRoutes.post('/users', userControllers.postUser);
userRoutes.patch('/users/me', userControllers.patchUser);
userRoutes.patch('/users/me/avatar', userControllers.patchAvatar);

module.exports = userRoutes;

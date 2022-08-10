const userRoutes = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const userControllers = require('../controllers/users');

userRoutes.get('/users', userControllers.getUsers);
userRoutes.get('/users/me', userControllers.getUserMe);

userRoutes.get(
  '/users/:id',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().alphanum().length(24),
    }),
  }),
  userControllers.getUserById,
);

userRoutes.patch(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  userControllers.patchUser,
);
userRoutes.patch(
  '/users/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required().pattern(/^((ftp|http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9\-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-\/])*)?/),
    }),
  }),
  userControllers.patchAvatar,
);

module.exports = userRoutes;

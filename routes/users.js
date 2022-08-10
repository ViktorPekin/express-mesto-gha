const userRoutes = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const userControllers = require('../controllers/users');

userRoutes.get('/users', userControllers.getUsers);
userRoutes.get('/users/me', userControllers.getUserMe);
userRoutes.get('/users/:id',
  celebrate({
    params: Joi.object().keys({
      postId: Joi.string().alphanum().length(24),
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
      avatar: Joi.string().required().min(2),
    }),
  }),
  userControllers.patchAvatar,
);

module.exports = userRoutes;

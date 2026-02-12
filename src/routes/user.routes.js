const express = require('express');
const router = express.Router();

const controller = require('../controllers/user.controller');
const auth = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');

const {
  idParamSchema,
  registerUserSchema,
  updateUserSchema,
} = require('../validators/user.schema');

router.get(
  '/usuarios',
  auth,
  authorize('ADMIN'),
  controller.getAllUsers
);

router.get(
  '/usuarios/:id',
  auth,
  validate(idParamSchema, 'params'),
  controller.getUserById
);

router.put(
  '/usuarios/:id',
  auth,
  validate(idParamSchema, 'params'),
  validate(updateUserSchema),
  controller.updateUser
);

router.delete(
  '/usuarios/:id',
  auth,
  authorize('ADMIN'),
  validate(idParamSchema, 'params'),
  controller.deleteUser
);

router.post(
  '/usuarios',
  validate(registerUserSchema),
  controller.registerUser
);

module.exports = router;

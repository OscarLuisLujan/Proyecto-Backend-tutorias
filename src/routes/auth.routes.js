const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const validate = require('../middlewares/validate.middleware');
const { refreshLimiter, loginLimiter } = require('../middlewares/rateLimit.middleware');
const {
  loginSchema,
    refreshSchema,
    logoutSchema
} = require('../validators/auth.schema');

router.post(
  '/login',
  loginLimiter,
  validate(loginSchema),
  authController.login
);
router.post('/logout', validate(logoutSchema), authController.logout);


router.post(
  '/refresh',
  refreshLimiter,
  validate(refreshSchema),
  authController.refreshToken
);

module.exports = router;

const rateLimit = require('express-rate-limit');

// Limiter para refresh
const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 20, // máximo 20 requests por IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Demasiadas solicitudes de refresh, inténtelo más tarde.',
  },
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 7, // máximo 5 intentos
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Demasiados intentos de login. Intente más tarde.',
  },
});


module.exports = {
  refreshLimiter,
  loginLimiter
};

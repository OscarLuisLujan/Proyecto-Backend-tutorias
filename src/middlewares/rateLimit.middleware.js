const rateLimit = require('express-rate-limit');


const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 20, 
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Demasiadas solicitudes de refresh, inténtelo más tarde.',
  },
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 7, 
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

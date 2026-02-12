const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');
const { pool } = require('../config/db');
const refreshTokenModel = require('../models/refreshToken.model');
const ms = require('ms');


const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        message: 'Refresh token requerido',
      });
    }

    const revoked = await refreshTokenModel.revokeToken(refreshToken);
    if (!revoked) {
      console.log('Token no encontrado o ya revocado');
    }
    
    await refreshTokenModel.cleanupExpiredTokens();
    
    res
      .clearCookie('accessToken')
      .clearCookie('refreshToken')
      .json({
        message: 'Sesión cerrada correctamente',
    });

  } catch (error) {
    next(error);
  }
};


const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email y contraseña son obligatorios',
      });
    }

    
    const user = await userModel.findUserByEmail(email);

    if (!user || !user.activo) {
      return res.status(401).json({
        message: 'Credenciales inválidas',
      });
    }

    
    const validPassword = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!validPassword) {
      return res.status(401).json({
        message: 'Credenciales inválidas',
      });
    }

    
    const rolesResult = await pool.query(
      `SELECT r.nombre
       FROM rol r
       JOIN tiene t ON r.id_rol = t.id_rol
       WHERE t.id_usuario = $1`,
      [user.id_usuario]
    );

    const roles = rolesResult.rows.map(r => r.nombre);

    
    const accessToken = jwt.sign(
      {
        id: user.id_usuario,
        email: user.email,
        roles,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
      { id: user.id_usuario },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
    );

    
    const refreshHash = await bcrypt.hash(refreshToken, 10);

    const refreshExpiresMs = ms(process.env.JWT_REFRESH_EXPIRES_IN);

    const expiresAt = new Date(Date.now() + refreshExpiresMs);

    await pool.query(
      `INSERT INTO refresh_token (id_usuario, token_hash, expires_at)
      VALUES ($1, $2, $3)`,
      [user.id_usuario, refreshHash, expiresAt]
    );

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, 
    })
    .cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    })
    .json({
      message: 'Login exitoso',
      user: {
        id: user.id_usuario,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        roles,
      },
    });


  } catch (error) {
    next(error);
  }
};

/**
 * REFRESH TOKEN
 */
const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      message: 'Refresh token requerido',
    });
  }

  try {
    
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    
    const tokensResult = await pool.query(
      `SELECT * FROM refresh_token
       WHERE id_usuario = $1
       AND revoked = false
       AND expires_at > NOW()`,
      [decoded.id]
    );

    let tokenValido = false;

    for (const token of tokensResult.rows) {
      const match = await bcrypt.compare(
        refreshToken,
        token.token_hash
      );
      if (match) {
        tokenValido = true;
        break;
      }
    }

    if (!tokenValido) {
      return res.status(403).json({
        message: 'Refresh token inválido',
      });
    }

    
    const newAccessToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res
    .cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    })
    .json({
      message: 'Token renovado',
    });


  } catch (error) {
    return res.status(403).json({
      message: 'Refresh token inválido o expirado',
    });
  }
};

module.exports = {
  login,
  refreshToken,
  logout,
};

const roleModel = require('../models/role.model');

const authorizeRoles = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const roles = await roleModel.getRolesByUserId(req.user.id);

      const hasPermission = roles.some(role =>
        allowedRoles.includes(role)
      );

      if (!hasPermission) {
        return res.status(403).json({
          message: 'No tienes permisos para esta acción',
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = authorizeRoles;

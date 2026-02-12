const { pool } = require('../config/db');

const getRolesByUserId = async (userId) => {
  const query = `
    SELECT r.nombre_rol
    FROM rol r
    JOIN tiene t ON r.id_rol = t.id_rol
    WHERE t.id_usuario = $1
      AND t.estado_rol = 'Activo'
  `;
  const { rows } = await pool.query(query, [userId]);
  return rows.map(r => r.nombre_rol);
};

module.exports = {
  getRolesByUserId,
};

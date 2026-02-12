const { pool } = require('../config/db');

const createUser = async ({ nombre, apellido, email, passwordHash }) => {
  const query = `
    INSERT INTO usuario (nombre, apellido, email, password_hash)
    VALUES ($1, $2, $3, $4)
    RETURNING id_usuario, nombre, apellido, email, activo, creado_en
  `;
  const { rows } = await pool.query(query, [
    nombre,
    apellido,
    email,
    passwordHash,
  ]);
  return rows[0];
};

const findUserByEmail = async (email) => {
  const { rows } = await pool.query(
    `SELECT * FROM usuario WHERE email = $1`,
    [email]
  );
  return rows[0];
};

const findUserById = async (id) => {
  const { rows } = await pool.query(
    `SELECT id_usuario, nombre, apellido, email, activo, creado_en
     FROM usuario WHERE id_usuario = $1`,
    [id]
  );
  return rows[0];
};

const findAllUsers = async () => {
  const { rows } = await pool.query(
    `SELECT id_usuario, nombre, apellido, email, activo, creado_en
     FROM usuario`
  );
  return rows;
};

const updateUser = async (id, { nombre, apellido, email }) => {
  const query = `
    UPDATE usuario
    SET nombre = $1,
        apellido = $2,
        email = $3
    WHERE id_usuario = $4
    RETURNING id_usuario, nombre, apellido, email, activo
  `;
  const { rows } = await pool.query(query, [
    nombre,
    apellido,
    email,
    id,
  ]);
  return rows[0];
};

const softDeleteUser = async (id) => {
  const { rows } = await pool.query(
    `UPDATE usuario
     SET activo = false
     WHERE id_usuario = $1
     RETURNING id_usuario, activo`,
    [id]
  );
  return rows[0];
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  findAllUsers,
  updateUser,
  softDeleteUser,
};

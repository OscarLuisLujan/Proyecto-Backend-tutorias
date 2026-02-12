const bcrypt = require('bcrypt');
const userModel = require('../models/user.model');

const registerUser = async (req, res, next) => {
  try {
    const { nombre, apellido, email, password } = req.body;

    if (!nombre || !apellido || !email || !password) {
      return res.status(400).json({ message: 'Datos incompletos' });
    }

    if (await userModel.findUserByEmail(email)) {
      return res.status(409).json({ message: 'Email ya registrado' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await userModel.createUser({
      nombre,
      apellido,
      email,
      passwordHash,
    });

    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await userModel.findUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await userModel.findAllUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { nombre, apellido, email } = req.body;

    const user = await userModel.updateUser(
      req.params.id,
      { nombre, apellido, email }
    );

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await userModel.softDeleteUser(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario desactivado', user });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  registerUser,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
};

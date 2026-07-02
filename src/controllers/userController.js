const userModel = require('../models/userModel');

async function getUsers(req, res) {
  try {
    const users = await userModel.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
}

async function getUserById(req, res) {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener usuario' });
  }
}

async function updateUser(req, res) {
  try {
    const user = await userModel.updateUser(req.params.id, req.body);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario actualizado correctamente', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar usuario' });
  }
}

async function deleteUser(req, res) {
  try {
    const deleted = await userModel.deleteUser(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar usuario' });
  }
}

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};

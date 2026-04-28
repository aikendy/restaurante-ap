import express from 'express';
import userController from '../controllers/userController.js';

const router = express.Router();

// Rutas públicas
router.post('/register', userController.create);    // Registrar nuevo usuario

// Rutas para administración
router.get('/', userController.getAll);             // Obtener todos los usuarios
router.get('/:id', userController.getOne);          // Obtener un usuario por ID
router.put('/:id', userController.update);          // Actualizar usuario
router.delete('/:id', userController.delete);       // Eliminar usuario

export default router;
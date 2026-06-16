import express from 'express';
import orderController from '../controllers/orderController.js';

const router = express.Router();

// Rutas principales
router.post('/', orderController.create);                    // Crear pedido
router.get('/', orderController.getAll);                     // Obtener todos los pedidos
router.get('/:id', orderController.getOne);                  // Obtener un pedido
router.put('/:id', orderController.update);                  // Actualizar pedido
router.delete('/:id', orderController.delete);               // Eliminar pedido

// Rutas específicas
router.get('/cliente/:clienteId', orderController.getByCliente);  // Pedidos por cliente
router.get('/estado/:estado', orderController.getByEstado);       // Pedidos por estado
router.put('/:id/estado', orderController.updateStatus);          // Actualizar estado

export default router;
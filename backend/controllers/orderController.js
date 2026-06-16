import orderModel from "../models/order.js";
import userModel from "../models/user.js";
import menuModel from "../models/menu.js";

class orderController {
    constructor() {}

    async create(req, res) {
        try {
            // Validar datos requeridos
            const { clienteId, items, metodoPago, direccionEntrega, telefonoContacto } = req.body;
            
            if (!clienteId || !items || items.length === 0) {
                return res.status(400).json({ 
                    message: 'Faltan datos: clienteId y items son requeridos' 
                });
            }
            
            // Verificar que el cliente exista
            const cliente = await userModel.getOne(clienteId);
            if (!cliente) {
                return res.status(404).json({ message: 'Cliente no encontrado' });
            }
            
            // Verificar que los items existen en el menú
            for (const item of items) {
                const menuItem = await menuModel.getOne(item.menuId);
                if (!menuItem) {
                    return res.status(404).json({ 
                        message: `El platillo con ID ${item.menuId} no existe` 
                    });
                }
                if (menuItem.disponible === false) {
                    return res.status(400).json({ 
                        message: `El platillo "${menuItem.nombre}" no está disponible` 
                    });
                }
            }
            
            const orderData = {
                clienteId,
                items,
                metodoPago,
                direccionEntrega,
                telefonoContacto,
                notaEspecial: req.body.notaEspecial || ''
            };
            
            const result = await orderModel.create(orderData);
            res.status(201).json({ 
                message: 'Pedido creado exitosamente',
                pedido: result
            });
        } catch (error) {
            res.status(500).json({ 
                message: 'Error al crear el pedido', 
                error: error.message 
            });
        }
    }

    async getAll(req, res) {
        try {
            const orders = await orderModel.getAll();
            res.status(200).json(orders);
        } catch (error) {
            res.status(500).json({ 
                message: 'Error al obtener los pedidos', 
                error: error.message 
            });
        }
    }

    async getOne(req, res) {
        try {
            const { id } = req.params;
            const order = await orderModel.getOne(id);
            
            if (!order) {
                return res.status(404).json({ message: 'Pedido no encontrado' });
            }
            
            res.status(200).json(order);
        } catch (error) {
            if (error.message === 'ID no válido') {
                return res.status(400).json({ message: 'ID no válido' });
            }
            res.status(500).json({ 
                message: 'Error al obtener el pedido', 
                error: error.message 
            });
        }
    }

    async getByCliente(req, res) {
        try {
            const { clienteId } = req.params;
            const orders = await orderModel.getByCliente(clienteId);
            res.status(200).json(orders);
        } catch (error) {
            res.status(500).json({ 
                message: 'Error al obtener pedidos del cliente', 
                error: error.message 
            });
        }
    }

    async getByEstado(req, res) {
        try {
            const { estado } = req.params;
            const estadosValidos = ['pendiente', 'confirmado', 'preparando', 'listo', 'entregado', 'cancelado'];
            
            if (!estadosValidos.includes(estado)) {
                return res.status(400).json({ message: 'Estado no válido' });
            }
            
            const orders = await orderModel.getByEstado(estado);
            res.status(200).json(orders);
        } catch (error) {
            res.status(500).json({ 
                message: 'Error al obtener pedidos por estado', 
                error: error.message 
            });
        }
    }

    async updateStatus(req, res) {
        try {
            const { id } = req.params;
            const { estado, nota } = req.body;
            
            if (!estado) {
                return res.status(400).json({ message: 'El estado es requerido' });
            }
            
            const order = await orderModel.getOne(id);
            if (!order) {
                return res.status(404).json({ message: 'Pedido no encontrado' });
            }
            
            const result = await orderModel.updateStatus(id, estado, nota || '');
            
            res.status(200).json({ 
                message: `Estado del pedido actualizado a: ${estado}`,
                data: result
            });
        } catch (error) {
            if (error.message === 'ID no válido') {
                return res.status(400).json({ message: 'ID no válido' });
            }
            res.status(500).json({ 
                message: 'Error al actualizar el estado', 
                error: error.message 
            });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            
            const order = await orderModel.getOne(id);
            if (!order) {
                return res.status(404).json({ message: 'Pedido no encontrado' });
            }
            
            const result = await orderModel.update(id, req.body);
            
            res.status(200).json({ 
                message: 'Pedido actualizado exitosamente',
                data: result
            });
        } catch (error) {
            if (error.message === 'ID no válido') {
                return res.status(400).json({ message: 'ID no válido' });
            }
            res.status(500).json({ 
                message: 'Error al actualizar el pedido', 
                error: error.message 
            });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            
            const order = await orderModel.getOne(id);
            if (!order) {
                return res.status(404).json({ message: 'Pedido no encontrado' });
            }
            
            const result = await orderModel.delete(id);
            
            res.status(200).json({ 
                message: 'Pedido eliminado exitosamente',
                data: result
            });
        } catch (error) {
            if (error.message === 'ID no válido') {
                return res.status(400).json({ message: 'ID no válido' });
            }
            res.status(500).json({ 
                message: 'Error al eliminar el pedido', 
                error: error.message 
            });
        }
    }
}

export default new orderController();
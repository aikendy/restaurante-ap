import { ObjectId } from "mongodb";
import dbClient from "../config/dbClient.js";

class orderModel {
    async create(orderData) {
        if (!dbClient.db) throw new Error('Base de datos no conectada');
        
        const colOrder = dbClient.db.collection('orders');
        
        // Calcular el total automáticamente
        let total = 0;
        orderData.items.forEach(item => {
            item.subtotal = item.cantidad * item.precioUnitario;
            total += item.subtotal;
        });
        
        // Agregar información automática del pedido
        const newOrder = {
            clienteId: new ObjectId(orderData.clienteId),
            items: orderData.items,
            total: total,
            estado: 'pendiente',  // pendiente, confirmado, preparando, listo, entregado, cancelado
            metodoPago: orderData.metodoPago || 'efectivo',
            notaEspecial: orderData.notaEspecial || '',
            direccionEntrega: orderData.direccionEntrega,
            telefonoContacto: orderData.telefonoContacto,
            createdAt: new Date(),
            updatedAt: new Date(),
            historialEstados: [
                { estado: 'pendiente', fecha: new Date(), nota: 'Pedido creado' }
            ]
        };
        
        const result = await colOrder.insertOne(newOrder);
        return { ...newOrder, _id: result.insertedId };
    }

    async getAll() {
        if (!dbClient.db) throw new Error('Base de datos no conectada');
        
        const colOrder = dbClient.db.collection('orders');
        const result = await colOrder.find({}).sort({ createdAt: -1 }).toArray();
        return result;
    }

    async getOne(id) {
        if (!dbClient.db) throw new Error('Base de datos no conectada');
        if (!ObjectId.isValid(id)) throw new Error('ID no válido');
        
        const colOrder = dbClient.db.collection('orders');
        const result = await colOrder.findOne({ _id: new ObjectId(id) });
        return result;
    }

    async getByCliente(clienteId) {
        if (!dbClient.db) throw new Error('Base de datos no conectada');
        if (!ObjectId.isValid(clienteId)) throw new Error('ID de cliente no válido');
        
        const colOrder = dbClient.db.collection('orders');
        const result = await colOrder.find({ clienteId: new ObjectId(clienteId) })
            .sort({ createdAt: -1 })
            .toArray();
        return result;
    }

    async getByEstado(estado) {
        if (!dbClient.db) throw new Error('Base de datos no conectada');
        
        const colOrder = dbClient.db.collection('orders');
        const result = await colOrder.find({ estado })
            .sort({ createdAt: -1 })
            .toArray();
        return result;
    }

    async updateStatus(id, nuevoEstado, nota = '') {
        if (!dbClient.db) throw new Error('Base de datos no conectada');
        if (!ObjectId.isValid(id)) throw new Error('ID no válido');
        
        const estadosValidos = ['pendiente', 'confirmado', 'preparando', 'listo', 'entregado', 'cancelado'];
        if (!estadosValidos.includes(nuevoEstado)) {
            throw new Error('Estado no válido');
        }
        
        const colOrder = dbClient.db.collection('orders');
        
        // Agregar al historial de estados
        const historialEntry = {
            estado: nuevoEstado,
            fecha: new Date(),
            nota: nota
        };
        
        const result = await colOrder.updateOne(
            { _id: new ObjectId(id) },
            { 
                $set: { 
                    estado: nuevoEstado,
                    updatedAt: new Date()
                },
                $push: { historialEstados: historialEntry }
            }
        );
        
        return result;
    }

    async update(id, orderData) {
        if (!dbClient.db) throw new Error('Base de datos no conectada');
        if (!ObjectId.isValid(id)) throw new Error('ID no válido');
        
        // No permitir actualizar ciertos campos
        delete orderData.createdAt;
        delete orderData.historialEstados;
        
        // Si se actualizan los items, recalcular total
        if (orderData.items) {
            let total = 0;
            orderData.items.forEach(item => {
                item.subtotal = item.cantidad * item.precioUnitario;
                total += item.subtotal;
            });
            orderData.total = total;
        }
        
        orderData.updatedAt = new Date();
        
        const colOrder = dbClient.db.collection('orders');
        const result = await colOrder.updateOne(
            { _id: new ObjectId(id) },
            { $set: orderData }
        );
        
        return result;
    }

    async delete(id) {
        if (!dbClient.db) throw new Error('Base de datos no conectada');
        if (!ObjectId.isValid(id)) throw new Error('ID no válido');
        
        const colOrder = dbClient.db.collection('orders');
        const result = await colOrder.deleteOne({ _id: new ObjectId(id) });
        return result;
    }
}

export default new orderModel();
import { ObjectId } from "mongodb";
import dbClient from "../config/dbClient.js";

class userModel {
    // Crear un nuevo usuario
    async create(userData) {
        if (!dbClient.db) throw new Error('Base de datos no conectada');
        
        const colUser = dbClient.db.collection('users');
        
        // Verificar si el email ya existe
        const existingUser = await colUser.findOne({ email: userData.email });
        if (existingUser) {
            throw new Error('El email ya está registrado');
        }
        
        // Agregar campos automáticos
        const newUser = {
            nombre: userData.nombre,
            email: userData.email,
            telefono: userData.telefono,
            direccion: userData.direccion,
            password: userData.password,  // Más adelante encriptaremos
            rol: userData.rol || 'cliente',
            activo: true,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        const result = await colUser.insertOne(newUser);
        return { ...newUser, _id: result.insertedId };
    }

    // Obtener todos los usuarios
    async getAll() {
        if (!dbClient.db) throw new Error('Base de datos no conectada');
        
        const colUser = dbClient.db.collection('users');
        // No devolver la contraseña por seguridad
        const result = await colUser.find({}).project({ password: 0 }).toArray();
        return result;
    }

    // Obtener un usuario por ID
    async getOne(id) {
        if (!dbClient.db) throw new Error('Base de datos no conectada');
        if (!ObjectId.isValid(id)) throw new Error('ID no válido');
        
        const colUser = dbClient.db.collection('users');
        const result = await colUser.findOne(
            { _id: new ObjectId(id) },
            { projection: { password: 0 } }
        );
        return result;
    }

    // Buscar usuario por email
    async findByEmail(email) {
        if (!dbClient.db) throw new Error('Base de datos no conectada');
        
        const colUser = dbClient.db.collection('users');
        const result = await colUser.findOne({ email });
        return result;
    }

    // Actualizar usuario
    async update(id, userData) {
        if (!dbClient.db) throw new Error('Base de datos no conectada');
        if (!ObjectId.isValid(id)) throw new Error('ID no válido');
        
        // No permitir actualizar campos sensibles
        delete userData.password;
        delete userData.createdAt;
        delete userData._id;
        
        userData.updatedAt = new Date();
        
        const colUser = dbClient.db.collection('users');
        const result = await colUser.updateOne(
            { _id: new ObjectId(id) },
            { $set: userData }
        );
        return result;
    }

    // Eliminar usuario
    async delete(id) {
        if (!dbClient.db) throw new Error('Base de datos no conectada');
        if (!ObjectId.isValid(id)) throw new Error('ID no válido');
        
        const colUser = dbClient.db.collection('users');
        const result = await colUser.deleteOne({ _id: new ObjectId(id) });
        return result;
    }
}

export default new userModel();
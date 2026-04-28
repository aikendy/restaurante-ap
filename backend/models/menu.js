import { ObjectId } from "mongodb";
import dbClient from "../config/dbClient.js";

class menuModelo {
    async create(menuData) {
        if (!dbClient.db) {
            throw new Error('Base de datos no conectada');
        }
        
        const colMenu = dbClient.db.collection('menu');
        const result = await colMenu.insertOne(menuData);
        return result;
    }

    async getAll() {
        if (!dbClient.db) {
            throw new Error('Base de datos no conectada');
        }
        
        const colMenu = dbClient.db.collection('menu');
        const result = await colMenu.find({}).toArray();
        return result;
    }

    async getOne(id) {
        if (!dbClient.db) {
            throw new Error('Base de datos no conectada');
        }
        
        // Validar que el ID sea válido antes de usarlo
        if (!ObjectId.isValid(id)) {
            throw new Error('ID no válido');
        }
        
        const colMenu = dbClient.db.collection('menu');
        const result = await colMenu.findOne({ _id: new ObjectId(id) });
        return result;
    }

    async update(id, menuData) {
        if (!dbClient.db) {
            throw new Error('Base de datos no conectada');
        }
        
        // Validar que el ID sea válido antes de usarlo
        if (!ObjectId.isValid(id)) {
            throw new Error('ID no válido');
        }
        
        const colMenu = dbClient.db.collection('menu');
        const result = await colMenu.updateOne(
            { _id: new ObjectId(id) },
            { $set: menuData }
        );
        return result;
    }

    async delete(id) {
        if (!dbClient.db) {
            throw new Error('Base de datos no conectada');
        }
        
        // Validar que el ID sea válido antes de usarlo
        if (!ObjectId.isValid(id)) {
            throw new Error('ID no válido');
        }
        
        const colMenu = dbClient.db.collection('menu');
        const result = await colMenu.deleteOne({ _id: new ObjectId(id) });
        return result;
    }
}

export default new menuModelo();
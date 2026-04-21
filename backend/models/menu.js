import dbClient from "../config/dbClient.js";

class menuModelo {
    async create(menuData) {
        // Esperar a que la conexión esté lista
        if (!dbClient.db) {
            throw new Error('Base de datos no conectada');
        }
        
        const colMenu = dbClient.db.collection('menu');
        // Insertar los datos que llegan, no un string 'menu'
        const result = await colMenu.insertOne(menuData);
        return result;
    }
}

export default new menuModelo();
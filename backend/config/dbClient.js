import { MongoClient } from "mongodb";
import dotenv from 'dotenv';

dotenv.config();

class dbClient {
    constructor() {
        const queryString = `mongodb://${process.env.USER_DB}:${process.env.PASSWORD_DB}@ac-rvlbqyg-shard-00-00.aivbqhg.mongodb.net:27017,ac-rvlbqyg-shard-00-01.aivbqhg.mongodb.net:27017,ac-rvlbqyg-shard-00-02.aivbqhg.mongodb.net:27017/?ssl=true&replicaSet=atlas-yz5kew-shard-0&authSource=admin&appName=Cluster0`;
        
        this.client = new MongoClient(queryString);
        this.conectarBD();
    }
    
    async conectarBD() {
        try {
            await this.client.connect();
            this.db = this.client.db('restaurante');
            console.log('✅ Conexión a MongoDB establecida correctamente');
        } catch (error) {
            console.error('❌ Error al conectar a MongoDB:', error);
        }
    }
}

export default new dbClient();
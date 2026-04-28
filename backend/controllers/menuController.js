import { ObjectId } from "mongodb";
import menuModel from "../models/menu.js";

class menuController {
    constructor() {

    }
    async create(req, res) {
        try {
            const data = await menuModel.create(req.body);
            res.status(201).json(data);
         }catch (error) {
            res.status(500).json({ message: 'Error al crear el elemento', error: error.message });
         }
    }
    async update(req, res) {
        try {
            const { id } = req.params;
            
            // Validar que el ID sea válido
            if (!ObjectId.isValid(id)) {
                return res.status(400).json({ message: 'ID no válido' });
            }
            
            const result = await menuModel.update(id, req.body);
            
            if (result.matchedCount === 0) {
                return res.status(404).json({ message: 'Elemento no encontrado' });
            }
            
            res.status(200).json({ message: 'Elemento actualizado exitosamente' });
         }catch (error) {
            res.status(500).json({ message: 'Error al actualizar el elemento', error: error.message });
         }
    }
    async delete(req, res) {
        try {
            const { id } = req.params;
            
            // Validar que el ID sea válido
            if (!ObjectId.isValid(id)) {
                return res.status(400).json({ message: 'ID no válido' });
            }
            
            const result = await menuModel.delete(id);
            
            if (result.deletedCount === 0) {
                return res.status(404).json({ message: 'Elemento no encontrado' });
            }
            
            res.status(200).json({ message: 'Elemento eliminado exitosamente' });
         }catch (error) {
            res.status(500).json({ message: 'Error al eliminar el elemento', error: error.message });
         }
    }

    async getAll(req, res) {
        try {
           const data = await menuModel.getAll();  
            res.status(200).json(data);
         }catch (error) {
            res.status(500).json({ message: 'Error al obtener los elementos', error: error.message });
         }
    }
    async getOne(req, res) {
        try {
            const { id } = req.params;
            
            // Validar que el ID sea válido
            if (!ObjectId.isValid(id)) {
                return res.status(400).json({ message: 'ID no válido. Debe ser un ObjectId de 24 caracteres hexadecimales' });
            }
            
            const data = await menuModel.getOne(id);
            
            if (!data) {
                return res.status(404).json({ message: 'Elemento no encontrado' });
            }
            
            res.status(200).json(data);
         }catch (error) {
            res.status(500).json({ message: 'Error al obtener el elemento', error: error.message });
         }
    }
}
export default new menuController();
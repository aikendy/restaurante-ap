import menuModel from "../models/menu.js";

class menuController {
    constructor() {

    }
    async create(req, res) {
        try {
            const data = await menuModel.create(req.body);  // ← Agregar AWAIT aquí
            res.status(201).json(data);
         }catch (error) {
            res.status(500).json({ message: 'Error al crear el elemento', error: error.message });
         }
    }
    async update(req, res) {
        try {
            res.status(200).json({ message: 'Elemento actualizado exitosamente' });  // ← 200 en lugar de 201
         }catch (error) {
            res.status(500).json({ message: 'Error al actualizar el elemento', error: error.message });
         }
    }
    async delete(req, res) {
        try {
            res.status(200).json({ message: 'Elemento eliminado exitosamente' });  // ← 200 en lugar de 201
         }catch (error) {
            res.status(500).json({ message: 'Error al eliminar el elemento', error: error.message });
         }
    }

    async getAll(req, res) {
        try {
            res.status(200).json({ message: 'Elementos obtenidos exitosamente' });  // ← 200 en lugar de 201
         }catch (error) {
            res.status(500).json({ message: 'Error al obtener los elementos', error: error.message });
         }
    }
    async getOne(req, res) {
        try {
            res.status(200).json({ message: 'Elemento obtenido exitosamente' });  // ← 200 en lugar de 201
         }catch (error) {
            res.status(500).json({ message: 'Error al obtener el elemento', error: error.message });
         }
    }
}
export default new menuController();
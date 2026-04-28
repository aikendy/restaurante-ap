import userModel from "../models/user.js";

class userController {
    constructor() {}

    // Crear usuario (registro)
    async create(req, res) {
        try {
            const { nombre, email, telefono, direccion, password, rol } = req.body;
            
            // Validar campos requeridos
            if (!nombre || !email || !telefono || !direccion || !password) {
                return res.status(400).json({ 
                    message: 'Faltan datos requeridos: nombre, email, telefono, direccion, password' 
                });
            }
            
            const userData = {
                nombre,
                email,
                telefono,
                direccion,
                password,
                rol: rol || 'cliente'
            };
            
            const result = await userModel.create(userData);
            
            // No devolver la contraseña
            const { password: _, ...userWithoutPassword } = result;
            
            res.status(201).json({ 
                message: 'Usuario creado exitosamente',
                usuario: userWithoutPassword
            });
        } catch (error) {
            res.status(500).json({ 
                message: 'Error al crear el usuario', 
                error: error.message 
            });
        }
    }

    // Obtener todos los usuarios
    async getAll(req, res) {
        try {
            const users = await userModel.getAll();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ 
                message: 'Error al obtener los usuarios', 
                error: error.message 
            });
        }
    }

    // Obtener un usuario por ID
    async getOne(req, res) {
        try {
            const { id } = req.params;
            const user = await userModel.getOne(id);
            
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
            
            res.status(200).json(user);
        } catch (error) {
            if (error.message === 'ID no válido') {
                return res.status(400).json({ message: 'ID de usuario no válido' });
            }
            res.status(500).json({ 
                message: 'Error al obtener el usuario', 
                error: error.message 
            });
        }
    }

    // Actualizar usuario
    async update(req, res) {
        try {
            const { id } = req.params;
            
            // Verificar si el usuario existe
            const existingUser = await userModel.getOne(id);
            if (!existingUser) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
            
            const result = await userModel.update(id, req.body);
            
            res.status(200).json({ 
                message: 'Usuario actualizado exitosamente',
                data: result
            });
        } catch (error) {
            if (error.message === 'ID no válido') {
                return res.status(400).json({ message: 'ID de usuario no válido' });
            }
            res.status(500).json({ 
                message: 'Error al actualizar el usuario', 
                error: error.message 
            });
        }
    }

    // Eliminar usuario
    async delete(req, res) {
        try {
            const { id } = req.params;
            
            // Verificar si el usuario existe
            const existingUser = await userModel.getOne(id);
            if (!existingUser) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
            
            const result = await userModel.delete(id);
            
            res.status(200).json({ 
                message: 'Usuario eliminado exitosamente',
                data: result
            });
        } catch (error) {
            if (error.message === 'ID no válido') {
                return res.status(400).json({ message: 'ID de usuario no válido' });
            }
            res.status(500).json({ 
                message: 'Error al eliminar el usuario', 
                error: error.message 
            });
        }
    }
}

export default new userController();
import express from 'express';
const route = express.Router();
import menuController from '../controllers/menuController.js';

route.post('/', menuController.create);
route.get('/:id', menuController.getOne);
route.get('/', menuController.getAll);
route.put('/:id', menuController.update);
route.delete('/:id', menuController.delete);

export default route;
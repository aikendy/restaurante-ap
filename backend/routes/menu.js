const express = require('express');
const router = express.Router();
const Menu = require('../models/menu');

router.get('/', async (req, res) => {
    try {
        const menu = await Menu.find();
        res.json(menu);
    } catch (error) {
         console.log(error);
        res.status(500).json({ error: 'Error al obtener el menú' });
    }
});

module.exports = router;
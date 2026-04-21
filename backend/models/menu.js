const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
    nombre: String,
    precio: Number
});

module.exports = mongoose.model('Menu', menuSchema);
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import routesMenu from './routes/menu.js';
import './config/dbClient.js';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/menu', routesMenu);

const PORT = process.env.PORT || 5100;
app.listen(PORT, () => 
    console.log(`Servidor en http://localhost:${PORT}`));


/*
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

async function connectToDB() {
  try {
    await mongoose.connect("mongodb://dsw123:champ1non@cluster0.aivbqhg.mongodb.net:27017/restaurante");
    console.log('✅ Conectado a MongoDB correctamente');
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error);
  }
}

connectToDB();

// rutas
const menuRoutes = require('./routes/menu');
app.use('/menu', menuRoutes);

// ruta de prueba
app.get('/', (req, res) => {
    res.send('API del restaurante funcionando');
});

// levantar servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor en http://localhost:${PORT}`);
});
*/
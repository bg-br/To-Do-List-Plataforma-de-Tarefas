// --- Importando 
const express = require('express');
const { Sequelize } = require('sequelize');
const cors = require('cors');
const sequelize = require('./database');

const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');

// --- Requerindo Modelos
// require('./models/User');
const User = require('./models/User');
require('./models/Task');

const App = express();

// --- Usuários
App.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true
}));
App.use(express.json());

// --- Rotas
App.use('/users', userRoutes);
App.use('/tasks', taskRoutes);

// --- Sincronizando com Database
sequelize.sync({ force: false })
    .then(() => { console.log("Banco de dados sincronizado."); })
    .catch(err => { console.error("Erro ao sincronizar banco:", err);});

module.exports = App;
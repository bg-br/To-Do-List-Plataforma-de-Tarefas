// --- Importando
const { Sequelize, DataTypes } = require('sequelize');

// --- Conexão com Database
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite',
    logging: false
});

module.exports = sequelize;

// --- Importando 
const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const bcrypt = require('bcrypt');


// --- Definindo valores de "User"
const User = sequelize.define('User', {
    id: { 
        type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true 
    },
    nome: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    email: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        unique: true 
    },
    senha: { 
        type: DataTypes.STRING, 
        allowNull: false 
    }
}, { 
    tableName: 'users', 
    timestamps: true,
});

// --- Criptografia
User.beforeCreate(async (user) => {
    const salt = await bcrypt.genSalt(10);
    user.senha = await bcrypt.hash(user.senha, salt);
});

User.prototype.checkPassword = async function(senha) {
    return await bcrypt.compare(senha, this.senha);
};

module.exports = User;
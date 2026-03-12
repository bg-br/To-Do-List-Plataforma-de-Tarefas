// --- Importando 
const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const User = require('./User');

// --- Definindo valores de "Task"
const Task = sequelize.define('Task', {
    id: { 
        type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true 
    },
    userId: { 
        type: DataTypes.INTEGER, 
        allowNull: false,
        references: { model: 'users', key: 'id' }
    },
    title: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    description: { 
        type: DataTypes.STRING, 
        allowNull: true 
    },
    completed: { 
        type: DataTypes.BOOLEAN, 
        defaultValue: false 
    }
}, { 
    timestamps: true 
});

// --- Relacionando
User.hasMany(Task, { foreignKey: 'userId' });
Task.belongsTo(User, { foreignKey: 'userId' });

module.exports = Task;
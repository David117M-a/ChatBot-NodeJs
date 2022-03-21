const { DataTypes } = require('sequelize');
const db = require('../db/connection');

const Comando = db.define('Comando', {
    idUsuario: {
        type: DataTypes.INTEGER
    },
    nombre: {
        type: DataTypes.STRING
    },
    activo: {
        type: DataTypes.BOOLEAN
    }
}, { timestamps: false });

module.exports = Comando;
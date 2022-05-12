const { DataTypes } = require('sequelize');
const db = require('../db/connection');

const Timer = db.define('timers', {
    idUsuario: {
        type: DataTypes.INTEGER
    },
    nombre: {
        type: DataTypes.STRING
    },
    intervalo: {
        type: DataTypes.INTEGER
    },
    activo: {
        type: DataTypes.BOOLEAN
    }
}, { timestamps: false });

module.exports = Timer;
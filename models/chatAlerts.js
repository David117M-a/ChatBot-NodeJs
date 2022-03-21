const { DataTypes } = require('sequelize');
const db = require('../db/connection');

const ChatAlerts = db.define('chat_alerts', {
    idUsuario: {
        type: DataTypes.INTEGER
    },
    accion: {
        type: DataTypes.STRING
    },
    activo: {
        type: DataTypes.BOOLEAN
    }
}, { timestamps: false });

module.exports = ChatAlerts;
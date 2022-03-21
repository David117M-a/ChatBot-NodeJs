const { DataTypes } = require('sequelize');
const db = require('../db/connection');

const MensajesChatAlerts = db.define('mensajes_chat_alerts', {
    idChatAlert: {
        type: DataTypes.INTEGER
    },
    mensaje: {
        type: DataTypes.STRING
    }
}, { timestamps: false });

module.exports = MensajesChatAlerts;
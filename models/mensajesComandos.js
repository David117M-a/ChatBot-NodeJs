const { DataTypes } = require('sequelize');
const db = require('../db/connection');

const MensajesComandos = db.define('mensajes_comandos', {
    idComando: {
        type: DataTypes.INTEGER
    },
    mensaje: {
        type: DataTypes.STRING
    }
}, { timestamps: false });

module.exports = MensajesComandos;
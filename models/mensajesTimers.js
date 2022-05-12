const { DataTypes } = require('sequelize');
const db = require('../db/connection');

const MensajesTimers = db.define('mensajes_timers', {
    idTimer: {
        type: DataTypes.INTEGER
    },
    mensaje: {
        type: DataTypes.STRING
    }
}, { timestamps: false });

module.exports = MensajesTimers;
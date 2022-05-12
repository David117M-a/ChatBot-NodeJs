const { DataTypes } = require('sequelize');
const db = require('../db/connection');

const ContadorMensajes = db.define('contador_comentarios', {
    id_streamer: {
        type: DataTypes.INTEGER
    },
    username: {
        type: DataTypes.STRING
    },
    no_comentarios: {
        type: DataTypes.INTEGER
    }
}, { timestamps: false });

module.exports = ContadorMensajes;
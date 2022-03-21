const { DataTypes } = require('sequelize');
const db = require('../db/connection');

const Usuario = db.define('Usuario', {
    nombre: {
        type: DataTypes.STRING
    },
    apellidos: {
        type: DataTypes.STRING
    },
    twitch_username: {
        type: DataTypes.STRING
    },
    twitch_password: {
        type: DataTypes.STRING
    },
    correo: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    },
    channel: {
        type: DataTypes.STRING
    }
}, { timestamps: false });

module.exports = Usuario;
const { DataTypes } = require('sequelize');
const db = require('../db/connection');

const CensuraDelChat = db.define('censura_del_chat', {
    idUsuario: {
        type: DataTypes.INTEGER
    },
    palabra: {
        type: DataTypes.STRING
    }
}, { timestamps: false, freezeTableName: true });

module.exports = CensuraDelChat;
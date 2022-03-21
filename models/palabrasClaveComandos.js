const { DataTypes } = require('sequelize');
const db = require('../db/connection');

const PalabrasClaveComandos = db.define('palabras_clave_comandos', {
    idComando: {
        type: DataTypes.INTEGER
    },
    palabra_clave: {
        type: DataTypes.STRING
    }
}, { timestamps: false });

module.exports = PalabrasClaveComandos;
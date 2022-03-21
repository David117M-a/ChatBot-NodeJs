require('dotenv').config();
const { Sequelize } = require('sequelize');

const db = new Sequelize(process.env.SQL_DATABASE, process.env.SQL_USERNAME, process.env.SQL_PASSWORD, {
    dialect: 'mssql',
    host: 'localhost'
});

module.exports = db;
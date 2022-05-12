const express = require('express');
const cors = require('cors');

const db = require('../db/connection');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            comandos: '/api/comandos',
            usuarios: '/api/usuarios',
            chatAlerts: '/api/chat_alerts',
            contadorComentarios: '/api/top-fans',
            timers: '/api/timers'
        }

        // Conectar a base de datos
        this.conectarDB();

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();
    }

    async conectarDB() {
        try {
            await db.authenticate();
            console.log('Base de datos online!');
        } catch (error) {
            console.log(error);
        }
        
    }


    middlewares() {

        // CORS
        this.app.use(cors());

        // Lectura y parseo del body
        this.app.use(express.json());

        // Directorio Público
        this.app.use(express.static('public'));

    }

    routes() {

        this.app.use(this.paths.comandos, require('../routes/comandos'));
        this.app.use(this.paths.usuarios, require('../routes/usuarios'));
        this.app.use(this.paths.chatAlerts, require('../routes/chatAlerts'));
        this.app.use(this.paths.contadorComentarios, require('../routes/contadorComentarios'));
        this.app.use(this.paths.timers, require('../routes/timers'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        });
    }

}

module.exports = Server;
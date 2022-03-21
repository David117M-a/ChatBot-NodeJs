const dotenv = require('dotenv').config();
const tmi = require('tmi.js');
const ChatAlerts = require('./chatAlerts');
const Comando = require('./comandos');
const MensajesChatAlerts = require('./mensajesChatAlerts');
const MensajesComandos = require('./mensajesComandos');
const PalabrasClaveComandos = require('./palabrasClaveComandos');

class Bot {
    constructor(twitch_username = '', twitch_password = '', channel = '', idUsuario) {
        this.idUsuario = idUsuario;
        this.channel = channel;
        this.client = new tmi.Client({
            options: {
                debug: true
            },
            connection: {
                reconnect: true
            },
            identity: {
                username: twitch_username,
                password: twitch_password
            },
            channels: [channel]
        });
    }

    async iniciar() {
        this.client.connect();
        this.client.on('connected', async (address, port) => {
            try {
                const chatAlert = await ChatAlerts.findOne({ where: { accion: 'conectarse', idUsuario: this.idUsuario } });
                if (!chatAlert || !chatAlert.activo) return;

                const mensajes = await MensajesChatAlerts.findAll({ where: { idChatAlert: chatAlert.id } });
                if (!mensajes) return;

                const mensaje = await this.obtenerMensaje(mensajes, {});
                return this.client.say(this.channel, mensaje);
            } catch (error) {
                console.log(error);
            }
        });

        this.client.on('chat', async (target, context, message, self) => {
            if (self) return;

            const commandName = message.trim();

            try {
                if (commandName.startsWith('!')) {
                    if(context.username != this.channel) return;

                    if (commandName.includes("!ban")) {
                        this.client.ban(this.channel, commandName.split(' ')[1], commandName.slice((commandName.split(' ')[0].length + commandName.split(' ')[1].length + 2))).catch(err => console.log(err));
                        return;
                    }

                    if (commandName.includes("!unban")) {
                        this.client.unban(this.channel, commandName.split(' ')[1]).catch(err => console.log(err));
                        return;
                    }

                    if (commandName.includes("!host")) {
                        this.client.host(this.channel, commandName.split(' ')[1]).catch(err => console.log(err));
                        return;
                    }

                    if (commandName.includes("!unhost")) {
                        this.client.say(target, 'The unhost command is not available now, you have to unhost manually');
                        return;
                    }

                    if (commandName.includes("!mod")) {
                        this.client.mod(this.channel, commandName.split(' ')[1]).catch(err => console.log(err));
                        return;
                    }

                    if (commandName.includes("!unmod")) {
                        this.client.unmod(this.channel, commandName.split(' ')[1]).catch(err => console.log(err));
                        return;
                    }

                    if (commandName.includes("!slowoff")) {
                        this.client.slowoff(this.channel);
                        return;
                    }

                    if (commandName.includes("!slow")) {
                        this.client.slow(this.channel, commandName.split(' ')[1]).catch(err => console.log(err));
                        return;
                    }

                    if (commandName.includes("!vip")) {
                        this.client.vip(this.channel, commandName.split(' ')[1]).catch(err => console.log(err));
                        return;
                    }

                    if (commandName.includes("!unvip")) {
                        this.client.unvip(this.channel, commandName.split(' ')[1]).catch(err => console.log(err));
                        return;
                    }

                    const comando = await Comando.findOne({ where: { nombre: commandName } });
                    if (!comando.activo) return;

                    const mensajes = await MensajesComandos.findAll({ where: { idComando: comando.id } });
                    if (!mensajes) return;

                    const mensaje = await this.obtenerMensaje(mensajes, context);
                    return this.client.say(target, mensaje);
                } else {
                    const palabraClave = await PalabrasClaveComandos.findOne({ where: { palabra_clave: commandName } });
                    if (palabraClave) {
                        const comando = await Comando.findByPk(palabraClave.idComando);
                        if (!comando.activo) return;

                        const mensajes = await MensajesComandos.findAll({ where: { idComando: palabraClave.idComando } });
                        if (!mensajes) return;

                        const mensaje = await this.obtenerMensaje(mensajes, context);
                        return this.client.say(target, mensaje);
                    }
                }

            } catch (error) {
                console.log(error);
            }
        });

        this.client.on('subscription', async (channel, username, method, message, userstate) => {
            try {
                const chatAlert = await ChatAlerts.findOne({ where: { accion: 'suscripcion', idUsuario: this.idUsuario } });
                if (!chatAlert || !chatAlert.activo) return;

                const mensajes = await MensajesChatAlerts.findAll({ where: { idChatAlert: chatAlert.id } });
                if (!mensajes) return;

                const mensaje = await this.obtenerMensaje(mensajes, { username });
                return this.client.say(this.channel, mensaje);
            } catch (error) {
                console.log(error);
            }
        });

        this.client.on('join', async (channel, username, self) => {
            if (self) return;
            try {
                const chatAlert = await ChatAlerts.findOne({ where: { accion: 'unirse', idUsuario: this.idUsuario } });
                if (!chatAlert || !chatAlert.activo) return;

                const mensajes = await MensajesChatAlerts.findAll({ where: { idChatAlert: chatAlert.id } });
                if (!mensajes) return;

                const mensaje = await this.obtenerMensaje(mensajes, { username });
                return this.client.say(this.channel, mensaje);
            } catch (error) {
                console.log(error);
            }
        });
    }

    async detener() {
        this.client.disconnect();
    }

    async obtenerMensaje(mensajes = [], context) {
        const { username } = context;
        const mensaje = mensajes[Math.floor(Math.random() * (((mensajes.length - 1) + 1) - 0)) + 0].mensaje.replace('{user}', username);
        return mensaje;
    }
}

module.exports = Bot;
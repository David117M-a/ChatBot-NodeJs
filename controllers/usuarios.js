const { request, response } = require("express");
const Usuario = require('../models/usuarios');
const bcryptjs = require('bcryptjs');
const Bot = require('../models/bot');
const CensuraDelChat = require("../models/censuraDelChat");

const bot = undefined;

const login = async (req = request, res = response) => {
    const { twitch_username, password } = req.body;

    const usuario = await Usuario.findOne({
        where: {
            twitch_username: twitch_username
        }
    });

    if (!usuario)
        return res.status(403).json({
            msg: 'Usuario o password no válidos'
        });

    const esPasswordValido = bcryptjs.compareSync(password, usuario.password);
    if (!esPasswordValido)
        return res.status(403).json({
            msg: 'Usuario o password no válidos'
        });

    return res.status(200).json({
        msg: "Logeado"
    });
}

const iniciarBot = async (req = request, res = response) => {
    const { idUsuario } = req.params;
    const usuario = await Usuario.findByPk(idUsuario);
    this.bot = new Bot(usuario.twitch_username, usuario.twitch_password, usuario.channel, idUsuario);
    this.bot.iniciar();
    return res.status(200).json({
        msg: 'Bot iniciado'
    });
}

const detenerBot = async (req = request, res = response) => {
    this.bot.detener();
    return res.status(200).json({
        msg: 'Bot detenido'
    });
}

const getUsuarios = async (req = request, res = response) => {
    const usuarios = await Usuario.findAll();
    return res.status(200).json(usuarios);
}

const getUsuarioById = async (req = request, res = response) => {
    const { id } = req.params;
    const usuario = await Usuario.findByPk(id);

    if (usuario)
        return res.status(200).json(usuario);
    else
        return res.status(404).json({
            msg: `No existe un usuario con el id: ${id}`
        });
}

const createUsuario = async (req = request, res = response) => {
    const { body } = req;

    try {
        // Validar existencia de username de Twitch
        const existeTwitchUsername = await Usuario.findOne({
            where: {
                twitch_username: body.twitch_username
            }
        });

        if (existeTwitchUsername)
            return res.status(400).json({
                msg: `El nombre de usuario de twitch (${body.twitch_username}) ya está registrado con otra cuenta`
            });

        // Validar existencia de email
        const existeEmail = await Usuario.findOne({
            where: {
                correo: body.correo
            }
        });

        if (existeEmail)
            return res.status(400).json({
                msg: `El correo (${body.correo}) ya está registrado con otra cuenta`
            });

        const usuario = new Usuario(body);

        // Encriptación de password
        const salt = bcryptjs.genSaltSync();
        usuario.password = bcryptjs.hashSync(body.password, salt);

        // Guardar nuevo usuario en db
        await usuario.save();

        // Conectar Bot
        const bot = new Bot(body.twitch_username, body.twitch_password, body.channel, usuario.id);
        bot.iniciar();

        return res.status(201).json({
            msg: 'Usuario registrado con éxito',
            usuario: usuario
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
}

const updateUsuario = async (req = resquest, res = response) => {
    const { body } = req;
    const { id } = req.params;

    try {
        const usuario = await Usuario.findByPk(id);
        if (!usuario)
            return res.status(400).json({
                msg: 'Usuario inválido'
            });

        if (body.twitch_username) {
            await Usuario.update({
                twitch_username: body.twitch_username
            }, { where: { id: id } });

            return res.status(200).json({
                msg: 'Username de bot actualizado'
            });
        }
        if (body.twitch_password) {
            await Usuario.update({
                twitch_password: body.twitch_password
            }, { where: { id: id } });

            return res.status(200).json({
                msg: 'Password de Twitch actualizado'
            });
        }
        if (body.password) {
            const salt = bcryptjs.genSaltSync();
            body.password = bcryptjs.hashSync(body.password, salt);

            await Usuario.update({
                password: body.password
            }, { where: { id: id } });

            return res.status(200).json({
                msg: 'Password actualizado'
            });
        }
        else {
            return res.status(400).json({
                msg: 'Información inválida, no se ha mandado nada a actualizar'
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
}

const getPalabrasCensuradas = async (req = request, res = response) => {
    const { idUsuario } = req.params;
    try {
        const palabras = await CensuraDelChat.findAll({
            where: {
                idUsuario: idUsuario
            }
        });

        return res.status(200).json({
            palabras
        });
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            palabras: []
        });
    }
}

const createPalabrasACensurar = async (req = request, res = response) => {
    const { body } = req;
    const { idUsuario } = req.params;

    try {
        if (!body.palabras || body.palabras.length <= 0) {
            return res.status(400).json({
                msg: 'No se encontró el body o no hay palabras en la petición'
            });
        }

        let response = await Promise.all(body.palabras.map(async p => {
            const palabraExiste = await CensuraDelChat.findOne({ where: { palabra: p } });
            if(palabraExiste) return false;
            const palabra = new CensuraDelChat({
                idUsuario,
                palabra: p
            });

            await palabra.save();
            return palabra;
        })).catch(console.log);

        return res.status(201).json({
            msg: 'Palabras a censurar guardadas con éxito',
            palabras: response
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
}

const deletePalabraCensurada = async (req = request, res = response) => {
    const { idPalabra } = req.params;

    try {
        await CensuraDelChat.destroy({
            where: {
                id: idPalabra
            }
        });

        res.status(200).json({
            msg: 'Palabra eliminada'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
}

module.exports = {
    login,
    getUsuarios,
    getUsuarioById,
    createUsuario,
    updateUsuario,
    iniciarBot,
    detenerBot,
    createPalabrasACensurar,
    getPalabrasCensuradas,
    deletePalabraCensurada
}
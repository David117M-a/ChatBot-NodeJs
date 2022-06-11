const { request, response } = require("express");
const ChatAlerts = require("../models/chatAlerts");
const MensajesChatAlerts = require("../models/mensajesChatAlerts");

const getChatAlerts = async (req = request, res = response) => {
    const { idUsuario } = req.params;
    const chatAlertsDB = await ChatAlerts.findAll({ where: { idUsuario: idUsuario } });

    const suscripcion = [];
    const unirse = [];
    const conectarse = [];
    await Promise.all(chatAlertsDB.map(async c => {
        const mensajes = await MensajesChatAlerts.findAll({ where: { idChatAlert: c.id } });
        if (c.accion === "suscripcion") {
            suscripcion.push({ "id": c.id, "idUsuario": c.idUsuario, "accion": c.accion, "activo": c.activo, mensajes });
        }
        if (c.accion === "unirse") {
            unirse.push({ "id": c.id, "idUsuario": c.idUsuario, "accion": c.accion, "activo": c.activo, mensajes });
        }
        if (c.accion === "conectarse") {
            conectarse.push({ "id": c.id, "idUsuario": c.idUsuario, "accion": c.accion, "activo": c.activo, mensajes });
        }
    }));

    return res.status(200).json({
        suscripcion,
        unirse,
        conectarse
    });
}

const createChatAlerts = async (req = request, res = response) => {
    const { idUsuario } = req.params;
    const { chatAlert } = req.body;
    const { mensajes } = req.body;
    if (!chatAlert) return res.status(400).json({ msg: 'Datos inválidos, no hay chat alert para guardar' });

    if (!mensajes) return res.status(400).json({ msg: 'Datos inválidos, no hay mensajes para guardar en chat alert' });

    const newChatAlert = new ChatAlerts(chatAlert);
    newChatAlert.idUsuario = idUsuario;
    await newChatAlert.save();

    await Promise.all(mensajes.map(async m => {
        const mensaje = new MensajesChatAlerts();
        mensaje.idChatAlert = newChatAlert.id;
        mensaje.mensaje = m;
        await mensaje.save();
    }));

    return res.status(200).json({
        newChatAlert
    });
}

const updateChatAlert = async (req = request, res = response) => {
    const { idChatAlert } = req.params;
    const { mensajes } = req.body;

    try {
        const chatAlert = await ChatAlerts.findByPk(idChatAlert);
        if (!chatAlert) return res.status(400).json({ msg: 'Chat Alert inválido' });

        await Promise.all(mensajes.map(async m => {
            await MensajesChatAlerts.update({
                mensaje: m.mensaje
            }, { where: { id: m.id } });
        }));

        return res.status(200).json({
            msg: 'Chat Alert actualizado'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
}

const createMensajesInChatAlert = async (req = request, res = response) => {
    const { userId } = req.params;
    const { mensajes, accion } = req.body;

    try {
        let chatAlert = await ChatAlerts.findOne({ where: { accion, idUsuario: userId } });
        if (!chatAlert) {
            chatAlert = new ChatAlerts({ accion });
            chatAlert.idUsuario = userId;
            await chatAlert.save();
        }

        await Promise.all(mensajes.map(async m => {
            const mensaje = new MensajesChatAlerts();
            mensaje.idChatAlert = chatAlert.id;
            mensaje.mensaje = m;
            await mensaje.save();
        }));

        return res.status(201).json({
            msg: 'Mensajes creados con éxito',
            mensajes
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
}

const deleteMensajesChatAlert = async (req = request, res = response) => {
    const { idChatAlert } = req.params;
    const { mensajes } = req.body;

    try {
        await Promise.all(mensajes.map(async m => {
            await MensajesChatAlerts.destroy({
                where: {
                    id: m
                }
            });
        }));

        return res.status(200).json({
            msg: 'Mensajes eliminados con éxito'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
}

const disableChatAlert = async (req = request, res = response) => {
    const { idChatAlert } = req.params;

    try {
        const chatAlert = await ChatAlerts.findByPk(idChatAlert);
        if (!chatAlert) return res.status(400).json({ msg: 'Chat Alert inválido' });

        await ChatAlerts.update({ activo: false }, { where: { id: idChatAlert } });

        return res.status(200).json({
            msg: 'Chat Alert desactivado'
        });
    } catch (error) {
        console.log(error);
    }
}

const enableChatAlert = async (req = request, res = response) => {
    const { idChatAlert } = req.params;

    try {
        const chatAlert = await ChatAlerts.findByPk(idChatAlert);
        if (!chatAlert) return res.status(400).json({ msg: 'Chat Alert inválido' });

        await ChatAlerts.update({ activo: true }, { where: { id: idChatAlert } });

        return res.status(200).json({
            msg: 'Chat Alert activado'
        });
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getChatAlerts,
    createChatAlerts,
    updateChatAlert,
    disableChatAlert,
    enableChatAlert,
    createMensajesInChatAlert,
    deleteMensajesChatAlert
}
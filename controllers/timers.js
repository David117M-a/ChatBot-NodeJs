const { response, request } = require("express");
const MensajesTimers = require("../models/mensajesTimers");
const Timer = require("../models/timers");

const getTimersByUserId = async (req = request, res = response) => {
    const { idUsuario } = req.params;

    try {
        const timers = await Timer.findAll({ where: { idUsuario: idUsuario } });
        const timersRes = await Promise.all(timers.map(async t => {
            const mensajes = await MensajesTimers.findAll({ where: { idTimer: t.id } });
            return {
                timer: t,
                mensajes: mensajes
            };
        }));
        return res.status(200).json(timersRes);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
};

const createTimers = async (req = request, res = response) => {
    const { idUsuario } = req.params;
    const { nombre, intervalo, mensajes } = req.body;

    try {
        if (!nombre || !intervalo || intervalo <= 0) return res.status(400).json({
            msg: 'Nombre o intervalo inválidos'
        });

        if (mensajes?.length <= 0) return res.status(400).json({
            msg: 'Configure uno o más mensajes'
        });

        const newTimer = new Timer({
            idUsuario,
            nombre,
            intervalo,
            activo: true
        });

        await newTimer.save();

        await Promise.all(mensajes.map(async m => {
            const newMensaje = new MensajesTimers({
                idTimer: newTimer.id,
                mensaje: m
            });

            await newMensaje.save();
        }));

        return res.status(201).json({
            msg: 'Timer registrado con éxito',
            timer: newTimer
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
};

const updateTimers = async (req = request, res = response) => {
    const { idTimer } = req.params;
    const { nombre, intervalo, mensajes } = req.body;

    try {
        if (nombre) {
            await Timer.update({
                nombre
            }, { where: { id: idTimer } });
        }

        if (intervalo) {
            await Timer.update({
                intervalo
            }, { where: { id: idTimer } });
        }

        if (mensajes?.length > 0) {
            await Promise.all(mensajes.map(async m => {
                await MensajesTimers.update({
                    mensaje: m.mensaje
                }, { where: { id: m.id } });
            }));
        }

        res.status(201).json({
            msg: 'Timer actualizado con éxito'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
};

const deleteTimer = async (req = request, res = response) => {
    const { idTimer } = req.params;

    try {
        await Timer.destroy({ where: { id: idTimer } });
        return res.status(200).json({
            msg: 'Timer eliminado'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
};

const createMensajes = async (req = request, res = response) => {
    const { idTimer } = req.params;
    const { mensajes } = req.body;

    try {
        if (mensajes?.length <= 0) return res.status(400).json({
            msg: 'Configure al menos uno o más mensajes'
        });

        const createdRes = await Promise.all(mensajes.map(async m => {
            const newMensaje = new MensajesTimers({
                idTimer,
                mensaje: m
            });

            await newMensaje.save();
            return newMensaje;
        }));

        res.status(201).json({
            msg: 'Mensajes creados con éxito',
            mensajes: createdRes
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
};

const deleteMensajes = async (req = request, res = response) => {
    const { mensajes } = req.body;

    try {
        if (mensajes?.length <= 0) return res.status(400).json({
            msg: 'Mensajes a eliminar no encontrados'
        });

        await Promise.all(mensajes.map(async id => {
            await MensajesTimers.destroy({ where: { id } });
        }));

        return res.status(200).json({
            msg: 'Mensajes eliminados'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
};

const enableTimer = async (req = request, res = response) => {
    const { idTimer } = req.params;

    try {
        await Timer.update({
            activo: true
        }, { where: { id: idTimer } });

        return res.status(200).json({
            msg: "Timer habilitado"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
};

const disableTimer = async (req = request, res = response) => {
    const { idTimer } = req.params;

    try {
        await Timer.update({
            activo: false
        }, { where: { id: idTimer } });

        return res.status(200).json({
            msg: "Timer deshabilitado"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
};

module.exports = {
    getTimersByUserId,
    createTimers,
    updateTimers,
    deleteTimer,
    createMensajes,
    deleteMensajes,
    enableTimer,
    disableTimer
}
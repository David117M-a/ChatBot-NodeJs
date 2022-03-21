const { request, response } = require("express");
const Comando = require("../models/comandos");
const MensajesComandos = require("../models/mensajesComandos");
const PalabrasClaveComandos = require("../models/palabrasClaveComandos");

const getComandos = async (req = request, res = response) => {
    const { idUsuario } = req.params;
    const comandosDb = await Comando.findAll({ where: { idUsuario: idUsuario } });
    if (!comandosDb)
        return res.status(200).json([]);

    const comandos = [];
    await Promise.all(comandosDb.map(async c => {
        const palabrasClave = await PalabrasClaveComandos.findAll({ where: { idComando: c.id } });
        const mensajes = await MensajesComandos.findAll({ where: { idComando: c.id } });
        comandos.push({ "id": c.id, "idUsuario": c.idUsuario, "nombre": c.nombre, "activo": c.activo, palabrasClave, mensajes });
    }));

    return res.status(200).json({ comandos });
}

const createComando = async (req = request, res = response) => {
    const { idUsuario } = req.params;
    const { body } = req;

    try {
        if (!body.comando)
            return res.status(400).json({
                msg: 'Información inválida, no hay comando para crear'
            });

        const newComando = new Comando(body.comando);
        newComando.idUsuario = idUsuario;

        const { palabrasClave } = body;
        if (!palabrasClave)
            return res.status(400).json({
                msg: 'Información inválida, no hay palabras clave'
            });

        const { mensajes } = body;
        if (!mensajes)
            return res.status(400).json({
                msg: 'Información inválida, no hay mensajes'
            });

        await newComando.save();

        await Promise.all(palabrasClave.map(async p => {
            let newPalabraClave = new PalabrasClaveComandos();
            newPalabraClave.idComando = newComando.id;
            newPalabraClave.palabra_clave = p;
            await newPalabraClave.save();
        }));

        await Promise.all(mensajes.map(async m => {
            let newMensaje = new MensajesComandos();
            newMensaje.idComando = newComando.id;
            newMensaje.mensaje = m;
            await newMensaje.save();
        }));

        return res.status(201).json(newComando);

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
}

const createPalabrasClave = async (req = request, res = response) => {
    const { idComando } = req.params;
    const { palabrasClave } = req.body;
    if (!palabrasClave)
        return res.status(400).json({
            msg: 'Datos inválidos, no hay palabras clave para crear'
        });

    try {
        await Promise.all(palabrasClave.map(async p => {
            let newPalabraClave = new PalabrasClaveComandos();
            newPalabraClave.idComando = idComando;
            newPalabraClave.palabra_clave = p;
            await newPalabraClave.save();
        }));

        return res.status(201).json({
            msg: 'Palabras clave creadas'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
}

const createMensajes = async (req = request, res = response) => {
    const { idComando } = req.params;
    const { mensajes } = req.body;
    if (!mensajes) {
        return res.status(400).json({
            msg: 'Datos inválidos, no hay mensajes para agregar'
        });
    }

    try {
        await Promise.all(mensajes.map(async m => {
            let newMensaje = new MensajesComandos();
            newMensaje.idComando = idComando;
            newMensaje.mensaje = m;
            await newMensaje.save();
        }));

        return res.status(201).json({
            msg: 'Mensajes creados'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
}

const updateComando = async (req = request, res = response) => {
    const { comando } = req.body;
    const { palabrasClave } = req.body;
    const { mensajes } = req.body;

    try {
        if (comando) {
            await Comando.update({
                nombre: comando.nombre
            }, { where: { id: comando.id } });
        }

        if (palabrasClave) {
            await Promise.all(palabrasClave.map(async p => {
                await PalabrasClaveComandos.update({
                    palabra_clave: p.palabra_clave
                }, { where: { id: p.id } });
            }));
        }

        if (mensajes) {
            await Promise.all(mensajes.map(async m => {
                await MensajesComandos.update({
                    mensaje: m.mensaje
                }, { where: { id: m.id } });
            }));
        }

        return res.status(200).json({
            msg: 'Comando actualizado'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
}

const disableComando = async (req = request, res = response) => {
    const { idComando } = req.params;

    try {
        await Comando.update({ activo: false }, { where: { id: idComando } });
        return res.status(200).json({ msg: 'Comando deshabilitado' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
}

const activateComando = async (req = request, res = response) => {
    const { idComando } = req.params;

    try {
        await Comando.update({ activo: true }, { where: { id: idComando } });
        return res.status(200).json({ msg: 'Comando activado' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
}

const deleteComando = async (req = request, res = response) => {
    const { idComando } = req.params;
    await Comando.destroy({ where: { id: idComando } });
    res.status(200).json({
        msg: 'Comando eliminado'
    });
}

const deletePalabrasClave = async (req = request, res = response) => {
    const { palabrasClave } = req.body;
    await Promise.all(palabrasClave.map(async p => {
        await PalabrasClaveComandos.destroy({ where: { id: p } });
    }));

    return res.status(200).json({
        msg: 'Palabras clave eliminadas'
    });
}

const deleteMensajes = async (req = request, res = response) => {
    const { mensajes } = req.body;
    await Promise.all(mensajes.map(async m => {
        await MensajesComandos.destroy({ where: { id: m } });
    }));

    return res.status(200).json({
        msg: 'Mensajes eliminados'
    });;
}

module.exports = {
    getComandos,
    createComando,
    updateComando,
    createPalabrasClave,
    createMensajes,
    disableComando,
    activateComando,
    deleteComando,
    deletePalabrasClave,
    deleteMensajes
}
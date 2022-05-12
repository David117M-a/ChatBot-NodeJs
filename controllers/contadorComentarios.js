const { response, request } = require("express");
const ContadorComentarios = require('../models/contadorComentarios');

const getTop10Fans = async (req = request, res = response) => {
    const { idUsuario } = req.params;
    try {
        const fans = await ContadorComentarios.findAll({ where: { id_streamer: idUsuario } });
        const top = fans.sort((a, b) => {
            if (a.no_comentarios < b.no_comentarios) {
                return 1;
            }
            if (a.no_comentarios > b.no_comentarios) {
                return -1;
            }
            return 0;
        });
        return res.status(200).json(top.slice(0, 10));
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
};

module.exports = {
    getTop10Fans
}
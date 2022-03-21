
const { Router } = require('express');
const { getComandos, createComando, updateComando, createPalabrasClave, createMensajes, disableComando, deleteComando, deletePalabrasClave, deleteMensajes, activateComando } = require('../controllers/comandos');

//const { validarCampos } = require('../middlewares');

//const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');

//const { usuariosGet } = require('../controllers/usuarios');

const router = Router();

router.get('/:idUsuario', getComandos);

router.post('/:idUsuario', createComando);

router.post('/palabras_clave/:idComando', createPalabrasClave);

router.post('/mensajes/:idComando', createMensajes);

router.put('/', updateComando);

router.delete('/palabras_clave', deletePalabrasClave);

router.delete('/mensajes', deleteMensajes);

router.delete('/deshabilitar/:idComando', disableComando);

router.post('/activar/:idComando', activateComando);

router.delete('/:idComando', deleteComando);

module.exports = router;
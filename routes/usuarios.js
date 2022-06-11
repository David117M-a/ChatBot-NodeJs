const { Router } = require('express');
const { getUsuarios, getUsuarioById, createUsuario, forgotPass, login, updateUsuario, iniciarBot, detenerBot, createPalabrasACensurar, getPalabrasCensuradas, deletePalabraCensurada } = require('../controllers/usuarios');
const router = Router();

router.post('/login', login);

router.post('/password', forgotPass);

router.get('/', getUsuarios);

router.get('/:id', getUsuarioById);

router.post('/', createUsuario);

router.post('/bot/:idUsuario', iniciarBot);

router.delete('/bot', detenerBot);

router.put('/:id', updateUsuario);

router.post('/censura/:idUsuario', createPalabrasACensurar);

router.get('/censura/:idUsuario', getPalabrasCensuradas);

router.delete('/censura/:idPalabra', deletePalabraCensurada);

module.exports = router;
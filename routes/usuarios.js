const { Router } = require('express');
const { getUsuarios, getUsuarioById, createUsuario, login, updateUsuario, iniciarBot, detenerBot } = require('../controllers/usuarios');
const router = Router();

router.post('/login', login);

router.get('/', getUsuarios);

router.get('/:id', getUsuarioById);

router.post('/', createUsuario);

router.post('/bot/:idUsuario', iniciarBot);

router.delete('/bot', detenerBot);

router.put('/:id', updateUsuario);

module.exports = router;
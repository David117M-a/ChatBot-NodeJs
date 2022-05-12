const { Router } = require('express');
const { getTop10Fans } = require('../controllers/contadorComentarios');

const router = Router();

router.get('/:idUsuario', getTop10Fans);

module.exports = router;
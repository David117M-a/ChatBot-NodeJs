const { Router } = require('express');
const { getTimersByUserId, createTimers, updateTimers, deleteTimer, enableTimer, disableTimer, createMensajes, deleteMensajes } = require('../controllers/timers');

const router = Router();

router.get('/:idUsuario', getTimersByUserId);

router.post('/:idUsuario', createTimers);

router.put('/:idTimer', updateTimers);

router.delete('/mensajes', deleteMensajes);

router.delete('/:idTimer', deleteTimer);

router.post('/mensajes/:idTimer', createMensajes);

router.post('/enable/:idTimer', enableTimer);

router.delete('/disable/:idTimer', disableTimer);

module.exports = router;
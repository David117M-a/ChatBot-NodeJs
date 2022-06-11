const { Router } = require('express');
const { getChatAlerts, createChatAlerts, updateChatAlert, enableChatAlert, disableChatAlert, createMensajesInChatAlert, deleteMensajesChatAlert } = require('../controllers/chatAlerts');
const router = Router();

router.get('/:idUsuario', getChatAlerts);

router.post('/:idUsuario', createChatAlerts);

router.post('/activar/:idChatAlert', enableChatAlert);

router.delete('/deshabilitar/:idChatAlert', disableChatAlert);

router.put('/:idChatAlert', updateChatAlert);

router.post('/mensajes/:userId', createMensajesInChatAlert);

router.delete('/mensajes/:idChatAlert', deleteMensajesChatAlert);

module.exports = router;
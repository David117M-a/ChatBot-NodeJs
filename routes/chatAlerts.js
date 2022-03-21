const { Router } = require('express');
const { getChatAlerts, createChatAlerts, updateChatAlert, enableChatAlert, disableChatAlert } = require('../controllers/chatAlerts');
const router = Router();

router.get('/:idUsuario', getChatAlerts);

router.post('/:idUsuario', createChatAlerts);

router.post('/activar/:idChatAlert', enableChatAlert);

router.delete('/deshabilitar/:idChatAlert', disableChatAlert);

router.put('/:idChatAlert', updateChatAlert);

module.exports = router;
const express = require('express');
const router = express.Router();
const { registerToken, sendPushNotification } = require('../Controllers/notification.controller');

router.post('/register-token', registerToken);
router.post('/send', sendPushNotification);

module.exports = router;

const express = require('express');

const astroCallControllers = require('../controllers/astroChatControllers');
const userCallControllers = require('../controllers/userchatControllers')

const router = express();


router.post('/add', astroCallControllers.AddChatHistory);
router.get('/get', astroCallControllers.getCallHistory)
router.post('/added', userCallControllers.AddChatHistory);
router.get('/getuser', userCallControllers.getCallHistory);



module.exports = router;
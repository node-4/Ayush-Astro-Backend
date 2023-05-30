const express = require('express');

const astroCallControllers = require('../controllers/astrocallhistory');
const userCallControllers = require('../controllers/userCallhistory')
const astroStatusControllers = require('../controllers/astroStatusControllers');

const router = express();


router.post('/add', astroCallControllers.AddCallHistory);
router.get('/get/:id', astroCallControllers.getCallHistory)
router.post('/added', userCallControllers.AddCallHistory);
router.get('/getuser/:id', userCallControllers.getCallHistory);
router.post('/status', astroStatusControllers.AddStatus);
router.get('/status/:id', astroStatusControllers.getStatus)


module.exports = router;
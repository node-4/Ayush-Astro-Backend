const express = require("express");
const router = express.Router();
const wallet = require("../controllers/walletController");


router.post('/createTransation', wallet.createTransation);
router.get('/listTransation', wallet.listTransation);
router.get('/getTransationById/:id', wallet.getTransationById)
module.exports = router;

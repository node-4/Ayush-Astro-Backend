const userController = require('../controllers/chat');
const router = require('express').Router()
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
    cloud_name: "djgrqoefp", // node4
    api_key: "274167243253962",
    api_secret: "3mkqkDDusI5Hf4flGNkJNz4PHYg",
});
const storage = new CloudinaryStorage({
    cloudinary: cloudinary, params: { folder: "smoke/chat", allowed_formats: ["jpg", "jpeg", "webp", "mp4", "mp3", "png", "PNG", "xlsx", "xls", "pdf", "PDF"], },
});
const upload = multer({ storage: storage });
var cpUpload = upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'docs', maxCount: 1 },]);

router.post('/userChat', cpUpload, userController.userChat);
router.get('/viewChat', userController.viewChat);
router.get('/chattingHistory', userController.chattingHistory);
router.delete('/deleteChat', userController.deleteChat);
router.put('/clearChat', userController.clearChat);
router.put('/deleteAllChat', userController.deleteAllChat);
router.put('/deleteMessage/:id', userController.deleteMessage);
module.exports = router;   
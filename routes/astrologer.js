const router = require("express").Router();
const { isAuthenticated } = require("../controllers/auth.controller");
const astroControllers = require('../controllers/astrologerControllers');
var multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
cloudinary.config({ cloud_name: "djgrqoefp", api_key: "274167243253962", api_secret: "3mkqkDDusI5Hf4flGNkJNz4PHYg", });
const storage = new CloudinaryStorage({ cloudinary: cloudinary, params: { folder: "ayush/images/Profile", allowed_formats: ["jpg", "jpeg", "png", "PNG", "xlsx", "xls", "pdf", "PDF"], }, });
const upload = multer({ storage: storage });




// router.post('/sendOTP', astroControllers.sendOTP);
// router.post('/verifyOTP', astroControllers.verifyOTP);
router.post('/signup', astroControllers.signUpUser);
router.post('/login', astroControllers.login);
router.post('/verify', astroControllers.verifyOTP)
router.get('/view/:id', astroControllers.ViewDataProfiles);
router.get('/search/:key', isAuthenticated, astroControllers.SearchAstroNameLangSkills);
router.get('/blog', astroControllers.getAllBlogs);
router.delete("/removed/:id", isAuthenticated, astroControllers.deleteAstroName);
router.delete("/remove-language", isAuthenticated, astroControllers.deleteLanguages)
router.get('/all', astroControllers.GetAllAstro)
router.put('/update/:id', upload.single("image"), astroControllers.updateAstro);
router.put('/updateCallStatus/:id', isAuthenticated, astroControllers.updateCallStatus);
router.post('/loginWithOTP', astroControllers.loginWithOTP);
router.get('/getAllReview/:id', astroControllers.getAllReview);

module.exports = router;
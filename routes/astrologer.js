const router = require("express").Router();
const { isAuthenticated } = require("../controllers/auth.controller");
const astroControllers = require('../controllers/astrologerControllers');





// router.post('/sendOTP', astroControllers.sendOTP);
// router.post('/verifyOTP', astroControllers.verifyOTP);
router.post('/signup', astroControllers.signUpUser);
router.post('/login', astroControllers.login);
router.post('/verify',astroControllers.verifyOTP )
router.get('/view/:id', astroControllers.ViewDataProfiles);
router.get('/search/:key', isAuthenticated, astroControllers.SearchAstroNameLangSkills);
router.get('/blog', astroControllers.getAllBlogs);
router.delete("/removed/:id", isAuthenticated, astroControllers.deleteAstroName);
router.delete("/remove-language", isAuthenticated, astroControllers.deleteLanguages)
router.get('/all', astroControllers.GetAllAstro)
router.put('/update/:id', isAuthenticated, astroControllers.updateAstro);
router.put('/updateCallStatus/:id', isAuthenticated, astroControllers.updateCallStatus);
module.exports = router;
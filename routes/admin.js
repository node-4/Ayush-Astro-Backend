const express = require("express");
const router = express.Router();
const admin = require("../controllers/admin");
const { isAuthenticated } = require("../controllers/auth.controller");
const astroControllers = require('../controllers/astrologerControllers')
const app = require("express");
const path = require("path");
var multer = require("multer");
const notificationControllers = require('../controllers/notificationControllers');
const User = require("../models/User");
const UserControllers = require('../controllers/userController');
const AstroFeeback = require('../controllers/astroFeedback');
const testimonalControllers = require('../controllers/testimonial');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

var upload = multer({ storage: storage });

router.post("/login-admin", admin.login);
router.post("/signup", admin.signUpUser);
router.post(
  "/user-blog",
  upload.single("myField"),
  isAuthenticated,
  admin.postuserBlogs
);
router.get("/get-blogs/:id", isAuthenticated, admin.ViewDataBlogs);
router.patch(
  "/edit-user-blog/:id",
  upload.single("myField"),
  isAuthenticated,
  admin.UpdateBlogs
);


router.get('/allusers/', isAuthenticated, UserControllers.getAllUsers);
router.delete('/userdelete/:user_Name', isAuthenticated, UserControllers.deleteUserName)
// Add Charges Router 
router.post('/fees/:id', isAuthenticated, admin.AddChargesofAstro);
router.get('/fees', isAuthenticated, admin.GetAllFessDetails);
router.delete('/fees', isAuthenticated, admin.DeleteFeedetails);
router.put('/fees', isAuthenticated, admin.UpdateFees);
router.get('/fees/:id', isAuthenticated, admin.GetFeesByAstroId)



router.delete("/remove-blog/:id", isAuthenticated, admin.RemovedBlogs);
router.post("/add-feedback", isAuthenticated, admin.UserFeedback);
router.get("/view-feedback", isAuthenticated, admin.ViewAllFeedback);

// Astrologer 
router.get('/astro', isAuthenticated, admin.allAstro);
router.post('/astro/', isAuthenticated, astroControllers.signUpUser);
router.delete('/astro/:id', isAuthenticated, astroControllers.deleteAstroName);
router.put('/astro/:id', isAuthenticated, astroControllers.updateAstro);


//Add Notification 
router.post('/notification', notificationControllers.AddNotification);
router.get('/notification', notificationControllers.getNotification);
router.put('/notification', notificationControllers.updateNotification);
router.delete('/notification', notificationControllers.deleteNotification)


//testimaonal 
router.post('/testimonial', testimonalControllers.AddTestimonial);
router.get('/testimonial', testimonalControllers.getTestimonial);
router.delete('/testimonial/:id', testimonalControllers.deleteTestmoial);
router.post('/addAppDetail', admin.addAppDetail);
router.get('/getAllappDetail', admin.getAllappDetail);
router.get('/appDetail/:id', admin.getAppDetailById)
router.delete('/appDetail/:id', admin.deleteAppDetail)

module.exports = router;

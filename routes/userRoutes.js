const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../controllers/auth.controller");
const user = require("../controllers/userController");
const walletController = require("../controllers/walletController");
const followController = require("../controllers/followController");
const referController = require("../controllers/referController");
const notificationControllers = require('../controllers/notificationControllers');
const testimonalControllers = require('../controllers/testimonial');
const  payment = require('../controllers/payments')
var multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

var upload = multer({ storage: storage });
router.get("/blogs/getAll", user.getAllBlogs);

router.patch(
  "/user-profiles",
  upload.single("myField"),
  isAuthenticated,
  user.postuserProfiles
);

router.get("/view-user-details/:id", isAuthenticated, user.ViewDataProfiles);
router.patch(
  "/edit-user-profiles/:id",
  upload.single("myField"),
  isAuthenticated,
  user.updateUserProfile
);
router.get("/search-language", isAuthenticated, user.SearchUserNameLangSkills);
router.get("/search-any-user-name", isAuthenticated, user.SearchUserName);
router.get(
  "/search-by-languages",
  isAuthenticated,
  user.SearchAnyLanguagesName
);
router.delete("/removed/:user_Name", isAuthenticated, user.deleteUserName);

router
  .route("/wallet")
  .get(isAuthenticated, walletController.getWallet)
  .post(walletController.createWallet);
router.post("/wallet/add", isAuthenticated, walletController.addMoney);
router.post("/wallet/remove", isAuthenticated, walletController.removeMoney);
router.get("/wallet/:id", isAuthenticated, walletController.getWalletById);

router.delete(
  "/removed-language/:language",
  isAuthenticated,
  user.deleteLanguages
);

router.get("/", user.getAllUsers);
router.route("/follow").post(isAuthenticated, followController.followById);
router.route("/unfollow").delete(isAuthenticated, followController.unfollow);
router.route("/following").get(isAuthenticated, followController.followersOfUser);
router.route("/following/:id").get(isAuthenticated, followController.Userfollowing);
router.route("/followers/:id").get(isAuthenticated, followController.Userfollowers);
// router.get('/search-only-user-name',upload.single("myField"),isAuthenticated,user.SearchOnlyUserName)

// FeedBack post 


router
  .route("/refer")
  //.post(isAuthenticated, referController.generateRefer)
  .get(isAuthenticated, referController.getReferral)
  .put(isAuthenticated, referController.useReferCode);

router.route('/feedback').post( isAuthenticated, user.UserFeedback );

router.get('/notification',isAuthenticated, notificationControllers.getNotification);
router.post('/payment', payment.CreatePaymentOrder),
router.get('/payment/:id', payment.GetPaymentsById);


// Testimaonail 
router.get('/testimonial',   isAuthenticated, testimonalControllers.getTestimonial);
router.get('/live',   user.GetAstroliveChanges);
router.get('/upcoming',user.GetAstroUpcoming )

module.exports = router;

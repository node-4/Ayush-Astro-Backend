const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const { isAuthenticated } = require("../controllers/auth.controller");
var multer = require("multer");
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/images");
    },
    filename: function (req, file, cb) {
        // console.log(file);
        cb(null, file.originalname);
    },
});

var upload = multer({ storage: storage });

router.post("/signUp", authController.signUpUser);
router.post("/sendOTP", authController.sendOTP);
router.post("/verify", authController.verifyOTP);
router.post("/sign/verify", authController.verifyOTPSignedIn);
router.post("/login", authController.login);
router.post("/loginWithOTP", authController.loginWithOTP);
router.post("/verifyloginOTP", authController.verifyloginOTP);

router.post(
    "/update-profile",
    isAuthenticated,
    authController.updateUserProfile
);
router.get(
    "/view-user-profiles",
    isAuthenticated,
    authController.GetUserProfiles
);

router.post(
    "/user-blog",
    upload.single("myField"),
    isAuthenticated,
    authController.postuserBlogs
);
router.patch(
    "/edit-user-blog/:id",
    upload.single("myField"),
    isAuthenticated,
    authController.UpdateBlogs
);

module.exports = router;

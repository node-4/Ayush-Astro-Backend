const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const { isAuthenticated } = require("../controllers/auth.controller");
// var multer = require("multer");
// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, "public/images");
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.originalname);
//     },
// });

// var upload = multer({ storage: storage });
var multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
cloudinary.config({ cloud_name: "djgrqoefp", api_key: "274167243253962", api_secret: "3mkqkDDusI5Hf4flGNkJNz4PHYg", });
const storage = new CloudinaryStorage({ cloudinary: cloudinary, params: { folder: "ayush/images/Profile", allowed_formats: ["jpg", "jpeg", "png", "PNG", "xlsx", "xls", "pdf", "PDF"], }, });
const upload = multer({ storage: storage });
router.post("/signUp", authController.signUpUser);
router.post("/socialLogin", authController.socialLogin);
router.post("/sendOTP", authController.sendOTP);
router.post("/verify", authController.verifyOTP);
router.post("/sign/verify", authController.verifyOTPSignedIn);
router.post("/login", authController.login);
router.post("/loginWithOTP", authController.loginWithOTP);
router.post("/verifyloginOTP/:id", authController.verifyloginOTP);

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

router.put("/updateProfile", isAuthenticated,upload.single("image"), authController.updateProfile);
module.exports = router;

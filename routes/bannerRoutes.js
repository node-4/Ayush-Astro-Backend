const app = require("express");
const path = require("path");
const router = app.Router();


const {
  addBanner,
  getBanner,
  editBanner,
  deleteBanner,
} = require("../controllers/BannerController");

router.post("/addBanner",  addBanner);
router.get("/getBanner", getBanner);
router.post("/editBanner/:id",  editBanner);
router.delete("/deleteBanner/:id", deleteBanner);

module.exports = router;

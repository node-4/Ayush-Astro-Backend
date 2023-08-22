const router = require("express").Router();

router.use("/auth", require("./auth.route"));
router.use("/user", require("./userRoutes"));
// router.use("/Conection", require("./conectionRoutes"));
router.use('/astrologer',require("./astrologer") );
router.use('/horoscope', require("./horoScopeRoute"));
router.use('/kundli', require('./kundliRourer'));
router.use('/order', require('./order'));
router.use('/product', require('./product'))
router.use('/astrocallhistory', require('./astrocallRouter'));
router.use('/discount', require('./discountRouter'));
router.use('/chat', require('./chatHistory'))
router.use('/agora', require('./agoreRouter.'))

router.use('/userAstroChat', require('./chatRouter'))

// router.use('/product', require('./product'))
router.use("/admin", require("./admin"));
router.use("/banner", require("./bannerRoutes"));
router.use("/notification", require("./notificationRouter"));
router.use("/support", require("./supportRoute"));

module.exports = router;

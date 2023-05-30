const express = require("express");
const router = express.Router();
const supportController = require("../controllers/supportController");

router.route("/").get(supportController.read).post(supportController.create);
router
  .route("/:id")
  .patch(supportController.update)
  .delete(supportController.delete);

module.exports = router;

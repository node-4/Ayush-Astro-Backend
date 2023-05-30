const app = require("express");
const path = require("path");
const router = app.Router();




const product = require('../controllers/productControllers');

router.post("/addProduct",  product.addproduct);
router.get("/getProduct", product.getProduct);
router.put("/editProduct/:id",  product.editProduct);
router.delete("/deleteProduct/:id", product.deleteProduct);

module.exports = router;



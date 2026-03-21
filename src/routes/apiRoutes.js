const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController.js");

router.post("/create", productController.createProduct);
router.get("/", productController.getProducts);
router.get("/id/:id", productController.getProductById);
router.put("/id/:id", productController.updateProduct);
router.delete("/id/:id", productController.deleteProduct);

router.use((req, res) => {
    res.status(404).json({error: "Página no encontrada"});
});

module.exports = router;
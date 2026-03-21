const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController.js");
const authController = require("../controllers/authController.js");
const isAdmin = require("../middlewares/authMiddleware.js");

// Ruta inicial
router.get("/", (req, res) => {
    res.redirect("/products");
});

// Rutas públicas 
router.get("/products", productController.showProducts);
router.get("/products/:id", productController.showProductById);
router.get("/login", authController.showLogin);
router.post("/login", authController.login);
router.get("/logout", authController.logout);

// Aplicar middleware de autenticación
router.use(isAdmin);

// Rutas protegidas por admin
router.get("/dashboard", productController.showProducts);
router.post("/dashboard", productController.createProduct);
router.get("/dashboard/new", productController.showNewProduct);
router.get("/dashboard/admin/new", productController.showAdminForm);
router.post("/dashboard/admin", authController.createAdmin);
router.get("/dashboard/:id/edit", productController.showEditProduct);
router.put("/dashboard/:id", productController.updateProduct);
router.delete("/dashboard/:id/delete", productController.deleteProduct);
router.get("/dashboard/:id", productController.showProductById);

// Endpoint para crear admin 
router.post("/admin/create", authController.createAdmin);

router.use((req, res) => {
    res.status(404).send(`Página no encontrada`);
});

module.exports = router;
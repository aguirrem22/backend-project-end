const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController.js");
const requireAuth = require("../middlewares/authMiddleware.js");
const User = require("../models/User.js");
const visitService = require("../services/visitService.js");

router.post("/auth/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ success: false, error: "Usuario y contraseña son requeridos" });
        }

        const user = await User.findOne({ username });
        if (user) {
            if (user.password !== password) {
                return res.status(401).json({ success: false, error: "Usuario o contraseña incorrectos" });
            }
            if (user.role !== "admin") {
                return res.status(403).json({ success: false, error: "No tienes permisos de administrador" });
            }
        } else {
            const adminUser = process.env.ADMINUSER || process.env.USER;
            const adminPass = process.env.ADMINPASS || process.env.PASSWORD;
            if (username !== adminUser || password !== adminPass) {
                return res.status(401).json({ success: false, error: "Usuario o contraseña incorrectos" });
            }
        }

        req.session.isAdmin = true;
        req.session.username = username;
        return res.json({ success: true, username });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, error: "Error al iniciar sesión" });
    }
});

router.post("/auth/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ success: false, error: "Error al cerrar sesión" });
        }
        return res.json({ success: true });
    });
});

router.get("/auth/me", (req, res) => {
    return res.json({
        isAdmin: Boolean(req.session?.isAdmin),
        username: req.session?.username || null,
    });
});

router.post("/create", requireAuth, productController.createProduct);
router.get("/", productController.getProducts);
router.get("/id/:id", productController.getProductById);
router.put("/id/:id", requireAuth, productController.updateProduct);
router.delete("/id/:id", requireAuth, productController.deleteProduct);

router.get("/visits", requireAuth, async (req, res) => {
  try {
    const count = await visitService.getVisitCount();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el contador de visitas" });
  }
});

router.post("/visits", async (req, res) => {
  try {
    const count = await visitService.incrementVisitCount();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: "Error al incrementar el contador de visitas" });
  }
});

router.use((req, res) => {
    res.status(404).json({error: "Página no encontrada"});
});

module.exports = router;
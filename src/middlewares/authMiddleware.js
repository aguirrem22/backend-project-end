const requireAuth = (req, res, next) => {
    if (!req.session?.isAdmin) {
        return res.status(401).json({ error: "No autorizado" });
    }

    next();
};

module.exports = requireAuth;
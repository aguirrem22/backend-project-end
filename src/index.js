const express = require("express");
const session = require('express-session');
const MongoStore = require('connect-mongo').default;
const path = require('path');
const cors = require("cors");
const methodOverride = require("method-override");
require('dotenv').config();

const app = express();
const PORT = 3000;
const connectDB = require("./config/db.js");
const productRouter = require("./routes/productRoutes.js");
const apiRouter = require("./routes/apiRoutes.js");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Logging middleware para depuración
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    if (req.body && Object.keys(req.body).length > 0) {
        console.log("Body:", req.body);
    }
    next();
});

// Configuración de sesion con la base de datos de mongo
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
        mongoUrl: process.env.MONGO_URI,
        touchAfter: 24 * 3600
    }),
    cookie: { 
        secure: false,
            }
}));

connectDB();
app.use("/", productRouter);
app.use("/api", apiRouter);

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
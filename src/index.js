const express = require("express");
const session = require('express-session');
const MongoStore = require('connect-mongo').default;
const cors = require("cors");
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const connectDB = require("./config/db.js");
const apiRouter = require("./routes/apiRoutes.js");
const isProduction = process.env.NODE_ENV === 'production';

const configuredOrigins = [process.env.FRONTEND_URL, process.env.FRONTEND_URLS]
    .filter(Boolean)
    .flatMap((value) => value.split(','))
    .map((origin) => origin.trim())
    .filter(Boolean);

const allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    ...configuredOrigins,
];
const netlifyOriginPattern = /^https:\/\/[a-z0-9-]+\.netlify\.app$/i;

app.set('trust proxy', 1);

app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin) || netlifyOriginPattern.test(origin)) {
            return callback(null, true);
        }

        return callback(new Error('Origin not allowed by CORS'));
    },
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

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
    secret: process.env.SESSION_SECRET || 'secret-key',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
        mongoUrl: process.env.MONGO_URI,
        touchAfter: 24 * 3600
    }),
    cookie: { 
        httpOnly: true,
        sameSite: isProduction ? 'none' : 'lax',
        secure: isProduction,
    }
}));

connectDB();
app.use("/api", apiRouter);

app.get("/", (req, res) => {
    res.json({ message: "Backend API running" });
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
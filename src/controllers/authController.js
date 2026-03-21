const User = require("../models/User.js");
const baseHtml = require("../helpers/baseHtml.js");
const getNavBar = require("../helpers/getNavBar.js");
const { renderLoginForm } = require("../helpers/template.js");

const authController = {
  showLogin: (req, res) => {
    try {
      const html = baseHtml("Iniciar Sesión", getNavBar() + renderLoginForm());
      res.send(html);
    } catch (error) {
      console.log(error);
      res.status(500).send({message: "Error al mostrar el formulario de login"});
    }
  },

  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      // Esto es par buscar el usario en la base de datos
      const user = await User.findOne({ username });

      if (user) {
        // si lo encuentra
        if (user.password !== password) {
          return res.status(401).send(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>Error de Login</title>
                <link rel="stylesheet" href="/styles.css" />
              </head>
              <body>
                <div style="text-align: center; margin-top: 60px;">
                  <h1 style="color: red;">Usuario o contraseña incorrectos</h1>
                  <p><a href="/products" style="color: blue; text-decoration: underline;">Volver</a></p>
                </div>
              </body>
            </html>
          `);
        }

        // verificar si el usuario es un adminn
        if (user.role !== "admin") {
          return res.status(403).send(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>Acceso Denegado</title>
                <link rel="stylesheet" href="/styles.css" />
              </head>
              <body>
                <div style="text-align: center; margin-top: 60px;">
                  <h1 style="color: red;">No tienes permisos de administrador</h1>
                  <p><a href="/products" style="color: blue; text-decoration: underline;">Volver</a></p>
                </div>
              </body>
            </html>
          `);
        }
      } else {
        // Si no existe en la base de datos, verifica las credenciales del .env
        const adminUser = process.env.USER;
        const adminPass = process.env.PASSWORD;

        if (username !== adminUser || password !== adminPass) {
          return res.status(401).send(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>Error de Login</title>
                <link rel="stylesheet" href="/styles.css" />
              </head>
              <body>
                <div style="text-align: center; margin-top: 60px;">
                  <h1 style="color: red;">Usuario o contraseña incorrectos</h1>
                  <p><a href="/products" style="color: blue; text-decoration: underline;">Volver</a></p>
                </div>
              </body>
            </html>
          `);
        }
      }

      // Establecer sesión
      req.session.isAdmin = true;
      req.session.username = username;

      // Redirigir al dashboard
      res.redirect("/dashboard");
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Error al intentar iniciar sesión",
      });
    }
  },

  logout: (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
        return res.status(500).send({
          message: "Error al cerrar sesión",
        });
      }
      res.redirect("/products");
    });
  },

  // Crear admin desde el dashboard solo si es admin 
  createAdmin: async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).send(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Error</title>
              <link rel="stylesheet" href="/styles.css" />
            </head>
            <body>
              <div style="text-align: center; margin-top: 60px;">
                <h1 style="color: red;">Usuario y contraseña son requeridos</h1>
                <p><a href="/dashboard/admin/new" style="color: blue; text-decoration: underline;">Volver</a></p>
              </div>
            </body>
          </html>
        `);
      }

      // Verificar que el admin no exista
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).send(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Error</title>
              <link rel="stylesheet" href="/styles.css" />
            </head>
            <body>
              <div style="text-align: center; margin-top: 60px;">
                <h1 style="color: red;">El admin ya existe</h1>
                <p><a href="/dashboard/admin/new" style="color: blue; text-decoration: underline;">Volver</a></p>
              </div>
            </body>
          </html>
        `);
      }

      // Crea nuevo admin
      const newUser = await User.create({
        username,
        password,
        role: "admin",
      });

      res.redirect("/dashboard");
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Error al crear admin",
      });
    }
  },
};

module.exports = authController;

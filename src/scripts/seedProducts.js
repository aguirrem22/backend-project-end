require('dotenv').config();
const mongoose = require('mongoose');
const { Product } = require('../models/Product');

const sampleProducts = [
  {
    nombre: 'Guantes MMA Pro X',
    descripcion: 'Guantes ligeros para entrenamiento técnico y sparring controlado.',
    imagen: 'https://images.unsplash.com/photo-1517438984742-1262db08335d?auto=format&fit=crop&w=900&q=80',
    categoria: 'Accesorios',
    talla: 'M',
    precio: 49.99,
  },
  {
    nombre: 'Pantalón Kickboxing Flex',
    descripcion: 'Pantalón transpirable con corte amplio para patadas de alta movilidad.',
    imagen: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=900&q=80',
    categoria: 'Pantalones',
    talla: 'L',
    precio: 39.95,
  },
  {
    nombre: 'Camiseta Rashguard Core',
    descripcion: 'Rashguard compresivo para grappling con costuras reforzadas.',
    imagen: 'https://images.unsplash.com/photo-1571019613576-2b22c76fd955?auto=format&fit=crop&w=900&q=80',
    categoria: 'Camisetas',
    talla: 'M',
    precio: 34.5,
  },
  {
    nombre: 'Espinilleras Muay Thai Shield',
    descripcion: 'Protección ergonómica para entrenamientos intensos de striking.',
    imagen: 'https://images.unsplash.com/photo-1549476464-37392f717541?auto=format&fit=crop&w=900&q=80',
    categoria: 'Accesorios',
    talla: 'L',
    precio: 59,
  },
  {
    nombre: 'Zapatillas Box Ring One',
    descripcion: 'Calzado ligero con gran tracción para desplazamientos rápidos en ring.',
    imagen: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
    categoria: 'Zapatos',
    talla: '42',
    precio: 79.9,
  },
  {
    nombre: 'Camiseta Training Noir',
    descripcion: 'Camiseta técnica de secado rápido para sesiones de alto rendimiento.',
    imagen: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
    categoria: 'Camisetas',
    talla: 'S',
    precio: 24.99,
  },
  {
    nombre: 'Pantalón Grappling Lite',
    descripcion: 'Pantalón resistente al roce para suelo, con cintura ajustable.',
    imagen: 'https://images.unsplash.com/photo-1506629905607-d405b7a4f42c?auto=format&fit=crop&w=900&q=80',
    categoria: 'Pantalones',
    talla: 'M',
    precio: 42,
  },
  {
    nombre: 'Botas Combat Street',
    descripcion: 'Botas urbanas inspiradas en calzado de combate, cómodas y duraderas.',
    imagen: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=80',
    categoria: 'Zapatos',
    talla: '44',
    precio: 89.99,
  },
];

async function runSeed() {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI no está definida en el archivo .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB conectado para seed');

    await Product.deleteMany({});
    const created = await Product.insertMany(sampleProducts);

    console.log(`Seed completado: ${created.length} productos insertados`);
    process.exit(0);
  } catch (error) {
    console.error('Error ejecutando seed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

runSeed();

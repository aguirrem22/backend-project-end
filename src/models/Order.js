const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    nombre: String,
    precio: Number,
    quantity: Number,
  }],
  customer: {
    nombre: String,
    email: String,
    telefono: String,
    direccion: String,
    codigoPostal: String,
    dni: String,
  },
  metodoPago: {
    type: String,
    enum: ['tarjeta', 'transferencia', 'efectivo'],
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  estado: {
    type: String,
    enum: ['pendiente', 'confirmada', 'enviada', 'entregada', 'cancelada'],
    default: 'confirmada',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;

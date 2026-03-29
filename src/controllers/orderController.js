const { Product } = require("../models/Product.js");
const Order = require("../models/Order.js");

const checkout = async (req, res) => {
  try {
    const { items, customer, metodoPago } = req.body;

    // Validar datos
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Carrito vacío" });
    }

    if (!customer || !customer.nombre || !customer.email || !customer.telefono || 
        !customer.direccion || !customer.codigoPostal || !customer.dni) {
      return res.status(400).json({ error: "Datos del cliente incompletos" });
    }

    if (!metodoPago || !['tarjeta', 'transferencia', 'efectivo'].includes(metodoPago)) {
      return res.status(400).json({ error: "Método de pago inválido" });
    }

    // Validar stock y calcular total
    let total = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item._id);
      
      if (!product) {
        return res.status(404).json({ error: `Producto ${item.nombre} no encontrado` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          error: `Stock insuficiente para ${product.nombre}. Disponible: ${product.stock}` 
        });
      }

      // Reducir stock
      product.stock -= item.quantity;
      await product.save();

      total += product.precio * item.quantity;
      orderItems.push({
        productId: product._id,
        nombre: product.nombre,
        precio: product.precio,
        quantity: item.quantity,
      });
    }

    // Crear orden
    const order = new Order({
      items: orderItems,
      customer,
      metodoPago,
      total,
      estado: 'confirmada',
    });

    await order.save();

    res.json({
      success: true,
      message: "Compra realizada exitosamente",
      orderId: order._id,
      total: order.total,
    });
  } catch (error) {
    console.error("Error en checkout:", error);
    res.status(500).json({ error: "Error al procesar la compra" });
  }
};

const getOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate('items.productId');
    
    if (!order) {
      return res.status(404).json({ error: "Orden no encontrada" });
    }

    res.json(order);
  } catch (error) {
    console.error("Error obteniendo orden:", error);
    res.status(500).json({ error: "Error al obtener la orden" });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Error obteniendo órdenes:", error);
    res.status(500).json({ error: "Error al obtener las órdenes" });
  }
};

module.exports = { checkout, getOrder, getAllOrders };

const productModel = require('../models/productModel');

const VALID_PAYMENT_METHODS = ['cash', 'credit_card'];
const CASH_DISCOUNT_RATE = 0.1;

function checkout(userId, { items, paymentMethod }) {
  if (!items || !Array.isArray(items) || items.length === 0) {
    const error = new Error('Items array is required and must not be empty.');
    error.statusCode = 400;
    throw error;
  }

  if (!paymentMethod || !VALID_PAYMENT_METHODS.includes(paymentMethod)) {
    const error = new Error('Payment method must be "cash" or "credit_card".');
    error.statusCode = 400;
    throw error;
  }

  const orderItems = [];
  let subtotal = 0;

  for (const item of items) {
    const { productId, quantity } = item;

    if (!productId || !quantity || quantity < 1) {
      const error = new Error('Each item must include a valid productId and quantity (minimum 1).');
      error.statusCode = 400;
      throw error;
    }

    const product = productModel.findById(Number(productId));

    if (!product) {
      const error = new Error(`Product with id ${productId} not found.`);
      error.statusCode = 404;
      throw error;
    }

    if (product.stock < quantity) {
      const error = new Error(`Insufficient stock for product "${product.name}". Available: ${product.stock}.`);
      error.statusCode = 400;
      throw error;
    }

    const lineTotal = product.price * quantity;
    subtotal += lineTotal;

    orderItems.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      lineTotal: Number(lineTotal.toFixed(2)),
    });
  }

  for (const item of orderItems) {
    const success = productModel.reduceStock(item.productId, item.quantity);
    if (!success) {
      const error = new Error(`Failed to reserve stock for product id ${item.productId}.`);
      error.statusCode = 400;
      throw error;
    }
  }

  const discount = paymentMethod === 'cash' ? Number((subtotal * CASH_DISCOUNT_RATE).toFixed(2)) : 0;
  const total = Number((subtotal - discount).toFixed(2));

  return {
    orderId: Date.now(),
    userId,
    items: orderItems,
    paymentMethod,
    subtotal: Number(subtotal.toFixed(2)),
    discount,
    total,
  };
}

module.exports = {
  checkout,
};

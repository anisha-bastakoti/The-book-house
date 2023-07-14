// Import necessary modules and define the OrderDetail model

const mongoose = require('mongoose');

const orderDetailSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'shipped', 'delivered'],
    default: 'pending',
    required: true,
  },
  // Add other fields for order details (e.g., order items, quantity, total price)

  // Add any other required fields or validations
});

const OrderDetail = mongoose.model('OrderDetail', orderDetailSchema);

module.exports = OrderDetail;

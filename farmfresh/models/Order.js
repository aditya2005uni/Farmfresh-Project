const mongoose = require('mongoose');


const orderItemSchema = new mongoose.Schema({
product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
qty: { type: Number, default: 1 },
priceAtPurchase: { type: Number, required: true }
});


const orderSchema = new mongoose.Schema({
user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
items: [orderItemSchema],
total: { type: Number, required: true },
createdAt: { type: Date, default: Date.now },
status: { type: String, enum: ['created', 'processing', 'completed', 'cancelled'], default: 'created' }
});


module.exports = mongoose.model('Order', orderSchema);
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    products: [
        {
            product: { type: String },
            quantity: { type: Number, required: true }
        }
    ]
});

const Cart = mongoose.model('carritos', cartSchema);

module.exports = Cart;

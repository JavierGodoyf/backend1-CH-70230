const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    products: [
        {
            product: { type: Schema.Types.ObjectId, ref: 'productos' },
            quantity: { type: Number, required: true }
        }
    ]
});

const Cart = mongoose.model('carritos', cartSchema);
module.exports = Cart;

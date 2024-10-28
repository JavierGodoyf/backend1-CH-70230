const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    code: { type: String, required: true, unique: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    thumbnails: { type: String, default: 'sin imagen' },
    status: { type: Boolean, default: true }
});

// Añadir el plugin de paginación al esquema
productSchema.plugin(mongoosePaginate);

const Product = mongoose.model('productos', productSchema);

module.exports = Product;

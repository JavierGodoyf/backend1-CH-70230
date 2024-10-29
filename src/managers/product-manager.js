const Product = require('../models/product.model');

class ProductManager {

    async addProduct({ title, description, price, code, stock, category, thumbnails = "sin imagen", status = true }) {
        try {
            const newProduct = new Product({ title, description, price, code, stock, category, thumbnails, status });
            await newProduct.save();
            console.log("Producto añadido:", newProduct);
        } catch (error) {
            console.log("Error al añadir el producto", error);
        }
    }

    async getProducts(page = 1, limit = 10) {
        try {
            const products = await Product.paginate({}, { page, limit });
            return products;
        } catch (error) {
            console.log("Error al obtener productos", error);
        }
    }


    async getProductById(id) {
        try {
            const product = await Product.findById(id); // Cambiado _id a id
            return product;
        } catch (error) {
            console.log("Error al obtener el producto por ID", error);
        }
    }

    async updateProduct(id, updatedData) {
        try {
            await Product.findByIdAndUpdate(id, updatedData); // Cambiado _id a id
            console.log("Producto actualizado");
        } catch (error) {
            console.log("Error al actualizar el producto", error);
        }
    }

    async deleteProduct(id) {
        try {
            await Product.findByIdAndDelete(id); // Cambiado _id a id
            console.log("Producto eliminado");
        } catch (error) {
            console.log("Error al eliminar el producto", error);
        }
    }

}

module.exports = ProductManager;

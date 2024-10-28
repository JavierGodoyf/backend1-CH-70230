const Cart = require('../models/cart.model');

class CartManager {

    async crearCarrito() {
        try {
            const newCart = new Cart({ products: [] });
            await newCart.save();
            return newCart;
        } catch (error) {
            console.log("Error al crear el carrito", error);
        }
    }

    async getCarritoById(id) {
        try {
            const cart = await Cart.findById(id).populate('products.product');
            return cart;
        } catch (error) {
            console.log("Error al obtener carrito por ID", error);
        }
    }

    async agregarProductoAlCarrito(carritoId, productoId, quantity) {
        try {
            const cart = await this.getCarritoById(carritoId);
            const productInCart = cart.products.find(p => p.product.toString() === productoId);

            if (productInCart) {
                productInCart.quantity += quantity;
            } else {
                cart.products.push({ product: productoId, quantity });
            }

            await cart.save();
            return cart;
        } catch (error) {
            console.log("Error al agregar producto al carrito", error);
        }
    }
    async eliminarProductoDelCarrito(carritoId, productoId) {
        try {
            const cart = await this.getCarritoById(carritoId);
            if (!cart) return null;

            // Filtramos para remover el producto especificado
            cart.products = cart.products.filter(p => p.product.toString() !== productoId);
            await cart.save();
            return cart;
        } catch (error) {
            console.log("Error al eliminar producto del carrito", error);
        }
    }

    async actualizarCarritoConProductos(carritoId, productos) {
        try {
            const cart = await this.getCarritoById(carritoId);
            if (!cart) return null;

            // Reemplazamos los productos actuales con el nuevo arreglo de productos
            cart.products = productos;
            await cart.save();
            return cart;
        } catch (error) {
            console.log("Error al actualizar carrito con productos", error);
        }
    }

    async actualizarCantidadProducto(carritoId, productoId, cantidad) {
        try {
            const cart = await this.getCarritoById(carritoId);
            if (!cart) return null;

            const productInCart = cart.products.find(p => p.product.toString() === productoId);
            if (productInCart) {
                productInCart.quantity = cantidad;
                await cart.save();
                return cart;
            } else {
                return null; // Producto no encontrado en el carrito
            }
        } catch (error) {
            console.log("Error al actualizar cantidad del producto en el carrito", error);
        }
    }

    async eliminarTodosLosProductosDelCarrito(carritoId) {
        try {
            const cart = await this.getCarritoById(carritoId);
            if (!cart) return null;

            cart.products = [];
            await cart.save();
            return cart;
        } catch (error) {
            console.log("Error al eliminar todos los productos del carrito", error);
        }
    }
}

module.exports = CartManager;

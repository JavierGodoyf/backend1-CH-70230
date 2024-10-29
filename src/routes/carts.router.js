const express = require("express");
const router = express.Router();
const CartManager = require("../managers/cart-manager.js"); // Asegúrate de tener este archivo en la ruta correcta
const ProductManager = require("../managers/product-manager.js"); // Para verificar la existencia del producto
const cartManager = new CartManager();
const productManager = new ProductManager();

// 1) POST / - Crear un nuevo carrito
router.post("/", async (req, res) => {
    try {
        const nuevoCarrito = await cartManager.crearCarrito();
        res.status(201).send(nuevoCarrito); // Devolvemos el nuevo carrito creado
    } catch (error) {
        res.status(500).send("Error al crear el carrito");
    }
});

// 2) GET /:cid - Listar los productos de un carrito por su id (cid)
router.get("/:cid", async (req, res) => {
    const carritoId = req.params.cid;

    try {
        const carrito = await cartManager.getCarritoById(carritoId);
        if (!carrito) {
            return res.status(404).send("Carrito no encontrado");
        }
        res.send(carrito.products); // Enviamos solo los productos del carrito
    } catch (error) {
        res.status(500).send("Error al obtener los productos del carrito");
    }
});

// 3) POST /:cid/product/:pid - Agregar un producto al carrito
router.post("/:cid/product/:pid", async (req, res) => {
    const carritoId = req.params.cid;
    const productoId = req.params.pid;
    const quantity = req.body.quantity || 1; // Por defecto, agregar de a uno

    try {
        // Verificar si el producto existe en el inventario
        const producto = await productManager.getProductById(productoId);
        if (!producto) {
            return res.status(404).send("Producto no encontrado");
        }

        // Agregar el producto al carrito
        const carritoActualizado = await cartManager.agregarProductoAlCarrito(carritoId, productoId, quantity);
        if (!carritoActualizado) {
            return res.status(404).send("Carrito no encontrado");
        }

        res.send(carritoActualizado);
    } catch (error) {
        res.status(500).send("Error al agregar el producto al carrito");
    }
});
router.delete("/:cid/products/:pid", async (req, res) => {
    const carritoId = req.params.cid;
    const productoId = req.params.pid;

    try {
        const carritoActualizado = await cartManager.eliminarProductoDelCarrito(carritoId, productoId);
        if (!carritoActualizado) {
            return res.status(404).send("Carrito o producto no encontrado");
        }
        res.send(carritoActualizado);
    } catch (error) {
        res.status(500).send("Error al eliminar el producto del carrito");
    }
});

// PUT /api/carts/:cid - Actualizar carrito con un arreglo de productos
router.put("/:cid", async (req, res) => {
    const carritoId = req.params.cid;
    const productos = req.body.products; // Arreglo de productos en el formato { product: productoId, quantity: cantidad }

    try {
        const carritoActualizado = await cartManager.actualizarCarritoConProductos(carritoId, productos);
        if (!carritoActualizado) {
            return res.status(404).send("Carrito no encontrado");
        }
        res.send(carritoActualizado);
    } catch (error) {
        res.status(500).send("Error al actualizar el carrito");
    }
});

// PUT /api/carts/:cid/products/:pid - Actualizar solo la cantidad de un producto en el carrito
router.put("/:cid/products/:pid", async (req, res) => {
    const carritoId = req.params.cid;
    const productoId = req.params.pid;
    const { quantity } = req.body; // Cantidad nueva

    try {
        const carritoActualizado = await cartManager.actualizarCantidadProducto(carritoId, productoId, quantity);
        if (!carritoActualizado) {
            return res.status(404).send("Carrito o producto no encontrado");
        }
        res.send(carritoActualizado);
    } catch (error) {
        res.status(500).send("Error al actualizar la cantidad del producto en el carrito");
    }
});

// DELETE /api/carts/:cid - Eliminar todos los productos del carrito
router.delete("/:cid", async (req, res) => {
    const carritoId = req.params.cid;

    try {
        const carritoActualizado = await cartManager.eliminarTodosLosProductosDelCarrito(carritoId);
        if (!carritoActualizado) {
            return res.status(404).send("Carrito no encontrado");
        }
        res.send(carritoActualizado);
    } catch (error) {
        res.status(500).send("Error al eliminar todos los productos del carrito");
    }
});
module.exports = router;

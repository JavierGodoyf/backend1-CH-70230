const express = require("express");
const router = express.Router();
const ProductManager = require("../managers/product-manager.js");
const CartManager = require("../managers/cart-manager.js");
const cartManager = new CartManager();
const manager = new ProductManager();
//Punto 2: realtimeproducts

router.get("/realtimeproducts", async (req, res) => {
    res.render("realtimeproducts");
})

router.get("/products", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Página actual
        const productos = await manager.getProducts(page); // Llamada con la página actual

        // Renderiza la vista 'home' y pasa los datos de productos y paginación
        res.render("home", {
            productos: productos.docs,
            currentPage: productos.page,
            hasPrevPage: productos.hasPrevPage,
            hasNextPage: productos.hasNextPage,
            prevPage: productos.prevPage,
            nextPage: productos.nextPage,
            hasPrevPage: productos.hasPrevPage,
            totalPages: productos.totalPages
        });
    } catch (error) {
        res.status(500).send("Error del servidor");
    }
});

router.get("/producto/:pid", async (req, res) => {
    try {
        const productId = req.params.pid;
        const productos = await manager.getProductById(productId); // Llamada con la página actual
        // Renderiza la vista 'home' y pasa los datos de productos y paginación
        res.render("detalles", {
            title: productos.title,
            description: productos.description,
            price: productos.price,
            code: productos.code,
            category: productos.category,
            stock: productos.stock,
            _id: productos._id

        });
    } catch (error) {
        res.status(500).send("Error del servidor");
    }
});

router.get("/carts/:cid", async (req, res) => {
    try {
        const carritoId = req.params.cid;
        const carrito = await cartManager.getCarritoById(carritoId);

        if (!carrito) {
            return res.status(404).send("Carrito no encontrado");
        }

        // Renderiza la vista del carrito y pasa los productos con detalles
        res.render("carrito", { productos: carrito.products });
    } catch (error) {
        res.status(500).send("Error del servidor");
    }
});



module.exports = router; 
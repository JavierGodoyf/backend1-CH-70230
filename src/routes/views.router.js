const express = require("express");
const router = express.Router();
const ProductManager = require("../managers/product-manager.js");
const manager = new ProductManager("./src/data/productos.json");
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
//pendiente
router.get("/carts/:cid", async (req, res) => {
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

module.exports = router; 
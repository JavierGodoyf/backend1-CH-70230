const express = require("express");
const router = express.Router();
const ProductManager = require("../managers/product-manager.js");
const manager = new ProductManager("./src/data/productos.json");
//Punto 2: realtimeproducts

router.get("/realtimeproducts", (req, res) => {
    res.render("realtimeproducts");
})

router.get("/home", async (req, res) => {
    try {
        // Obtener todos los productos
        const productos = await manager.getProducts();

        // Renderizar la vista 'home' y pasarle los productos
        res.render("home", { productos });
    } catch (error) {
        res.status(500).send("Error del servidor");
    }
});


module.exports = router; 
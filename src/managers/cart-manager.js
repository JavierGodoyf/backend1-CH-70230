const fs = require("fs").promises;

class CartManager {
    constructor(path) {
        this.path = path;
        this.carts = [];
        this.ultId = 0;

        //Cargar los carritos almacenados en el archivo: 
        this.cargarCarritos();
    }

    async cargarCarritos() {
        try {
            const data = await fs.readFile(this.path, "utf-8");
            this.carts = JSON.parse(data);
            if (this.carts.length > 0) {
                //Verifico si hay por lo menos algun elemento y voy a calcular el ultimo id: 
                this.ultId = Math.max(...this.carts.map(cart => cart.id));
                //Utilizo el método map para crear un nuevo array que solo tenga los ids y con Math.Max obtengo el mayor, guardandolo en la propiedad ultId. 
            }
        } catch (error) {
            console.log("Error al cargar el carrito");
            //Si no existe el archivo, lo voy a crear: 
            await this.guardarCarritos();
        }
    }

    async guardarCarritos() {
        await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
    }

    //Metodo para crear un carrito: 

    async crearCarrito() {
        const nuevoCarrito = {
            id: ++this.ultId,
            products: []
        };

        //Este objeto "carrito" lo pusheamos al array: 
        this.carts.push(nuevoCarrito);

        //Guardamos el array en el archivo: 
        await this.guardarCarritos();
        return nuevoCarrito;
    }

    async getCarritoById(carritoId) {
        try {
            const carrito = this.carts.find(c => c.id === parseInt(carritoId));
            return carrito || null;
        } catch (error) {
            console.log("Error al buscar carrito por id", error);
            return null;
        }
    }

    async agregarProductoAlCarrito(carritoId, productoId, quantity) {
        try {
            const carrito = await this.getCarritoById(carritoId);
            if (!carrito) {
                return null; // Si no existe el carrito, devolvemos null
            }

            const productoEnCarrito = carrito.products.find(item => item.product === productoId);
            if (productoEnCarrito) {
                // Si el producto ya está en el carrito, incrementamos la cantidad
                productoEnCarrito.quantity += quantity;
            } else {
                // Si no está en el carrito, lo agregamos
                carrito.products.push({ product: productoId, quantity });
            }

            // Guardamos los cambios en el archivo
            await this.guardarCarritos();
            return carrito;
        } catch (error) {
            console.log("Error al agregar producto al carrito", error);
            return null;
        }
    }


    async getcarrito() {
        try {
            const arraycarrito = await this.leerArchivo();
            return arraycarrito;
        } catch (error) {
            console.log("Error al leer el archivo", error);
        }

    }
    async leerArchivo() {
        const respuesta = await fs.readFile(this.path, "utf-8");
        const arrayProductos = JSON.parse(respuesta);
        return arrayProductos;
    }

}

module.exports = CartManager; 
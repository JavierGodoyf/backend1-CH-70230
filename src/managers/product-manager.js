const fs = require("fs").promises;

class ProductManager {

    static ultId = 0;

    constructor(path) {
        this.products = [];
        this.path = path;
        this.cargarArray();
    }

    async cargarArray() {
        try {
            this.products = await this.leerArchivo();
            // Ajustar ultId según el último id en el archivo
            if (this.products.length > 0) {
                ProductManager.ultId = Math.max(...this.products.map(product => product.id));
            }
        } catch (error) {
            console.log("Error al inicializar ProductManager");
        }
    }

    async addProduct({ title, description, price, code, stock, category, thumbnails = "sin imagen", status = true }) {
        if (!title || !description || !price || !code || !stock || !category) {
            console.log("Todos los campos son obligatorios");
            return;
        }

        else if (this.products.some(item => item.code === code)) {
            console.log("Error: El código de producto ya existe");
            return;
        }

        // Generar un id único
        const nuevoProducto = {
            id: ++ProductManager.ultId,
            title,
            description,
            price,
            code,
            stock,
            category,
            thumbnails,
            status
        };

        this.products.push(nuevoProducto);
        await this.guardarArchivo(this.products);
    }

    async getProducts(limit) {
        try {
            const arrayProductos = await this.leerArchivo();

            if (limit) {
                return arrayProductos.slice(0, limit);
            }

            return arrayProductos;
        } catch (error) {
            console.log("Error al leer el archivo", error);
        }
    }

    async getProductById(id) {
        try {
            const arrayProductos = await this.leerArchivo();
            const buscado = arrayProductos.find(item => item.id === id);

            if (!buscado) {
                console.log("Producto no encontrado");
                return null;
            } else {
                console.log("Producto encontrado");
                return buscado;
            }
        } catch (error) {
            console.log("Error al buscar por id", error);
        }
    }

    async leerArchivo() {
        const respuesta = await fs.readFile(this.path, "utf-8");
        return JSON.parse(respuesta);
    }

    async guardarArchivo(arrayProductos) {
        await fs.writeFile(this.path, JSON.stringify(arrayProductos, null, 2));
    }

    async updateProduct(id, productoActualizado) {
        try {
            const arrayProductos = await this.leerArchivo();
            const index = arrayProductos.findIndex(item => item.id == id);

            if (index !== -1) {
                arrayProductos[index] = { ...arrayProductos[index], ...productoActualizado };
                await this.guardarArchivo(arrayProductos);
                console.log("Producto actualizado");
            } else {
                console.log("No se encuentra el producto");
            }
        } catch (error) {
            console.log("Tenemos un error al actualizar productos");
        }
    }

    async deleteProduct(id) {
        try {
            const arrayProductos = await this.leerArchivo();
            const index = arrayProductos.findIndex(item => item.id === id);

            if (index !== -1) {
                arrayProductos.splice(index, 1);
                await this.guardarArchivo(arrayProductos);
                console.log("Producto eliminado");
            } else {
                console.log("No se encuentra el producto");
            }
        } catch (error) {
            console.log("Tenemos un error al eliminar productos");
        }
    }
}

module.exports = ProductManager;

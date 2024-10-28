const socket = io();

// Escuchar la lista de productos desde el servidor
socket.on("productos", (data) => {
    renderProductos(data);
});

// Función para renderizar los productos en la interfaz
const renderProductos = (productos) => {
    const contenedorProductos = document.getElementById("contenedorProductos");

    // Limpiar el contenedor antes de renderizar los productos
    contenedorProductos.innerHTML = '';

    productos.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("col-md-4", "mb-4");  // Colocar productos en columnas

        card.innerHTML = `
            <div class="card h-100">
                <img src="..." class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${item.title}</h5>
                    <p class="card-text">Descripción: ${item.description}</p>
                    <p class="card-text">Precio: ${item.price}</p>
                    <p class="card-text">Id: ${item._id}</p>
                    <a href="#" class="btn btn-danger btn-delete" data-_id="${item._id}">Borrar</a>
                </div>
            </div>
        `;

        contenedorProductos.appendChild(card);
    });

    // Añadir evento de clic para los botones de borrar
    document.querySelectorAll(".btn-delete").forEach(button => {
        button.addEventListener("click", (event) => {
            const idProducto = event.target.getAttribute("data-_id");
            fetch(`/api/products/${idProducto}`, {
                method: "DELETE",
            })
                .then(response => response.text())
                .then(data => {
                    console.log(data);
                    socket.emit("productoEliminado", idProducto); // Emitir evento para actualizar en tiempo real
                })
                .catch(error => console.error("Error al eliminar producto:", error));
        });
    });
};

// Manejar el envío del formulario para agregar productos
const form = document.querySelector("form");

form.addEventListener("submit", (event) => {
    event.preventDefault();

    // Crear un objeto con los datos del formulario
    const nuevoProducto = {
        title: form.querySelector('input[placeholder="Nombre de producto"]').value,
        description: form.querySelector('input[placeholder="Descripcion del producto"]').value,
        code: form.querySelector('input[placeholder="Codigo del producto"]').value,
        stock: form.querySelector('input[placeholder="Stock"]').value,
        category: form.querySelector('input[placeholder="Categoria"]').value,
        price: form.querySelector('input[placeholder="Precio"]').value,  // Campo de precio añadido
        // La imagen se manejará de otra manera, por ahora se deja fuera
    };

    // Enviar los datos al servidor mediante una solicitud POST
    fetch("/api/products", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevoProducto),
    })
        .then(response => response.text())
        .then(data => {
            console.log(data);
            socket.emit("productoAgregado", nuevoProducto); // Emitir evento para actualizar en tiempo real
            form.reset(); // Limpiar el formulario después de agregar el producto
        })
        .catch(error => console.error("Error al agregar producto:", error));
});

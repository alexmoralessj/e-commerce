const carrito = document.getElementById('carrito');
const elementos1 = document.getElementById('lista-1');
const lista = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.getElementById('vaciar-carrito');
const btnPagar = document.getElementById('btn-pagar');
const totalCarritoP = document.getElementById('total-carrito');

cargarEventListeners();

function cargarEventListeners() {
    if (elementos1) elementos1.addEventListener('click', comprarElemento);
    if (carrito) carrito.addEventListener('click', eliminarElemento);
    if (vaciarCarritoBtn) vaciarCarritoBtn.addEventListener('click', vaciarCarrito);
    if (btnPagar) btnPagar.addEventListener('click', pagarSimulado);
    // actualizar total si hay items por defecto
    actualizarTotal();
}

function comprarElemento(e){
    e.preventDefault();
    if(e.target.classList.contains('agregar-carrito')) {
        const elemento = e.target.parentElement.parentElement;
        leerDatosElemento(elemento);
    }
}

function leerDatosElemento(elemento) {
    const infoElemento = {
        imagen: elemento.querySelector('img').src,
        titulo: elemento.querySelector('h3').textContent,
        precio: elemento.querySelector('.precio').textContent,
        id: elemento.querySelector('a').getAttribute('data-id')
    }
    insertarCarrito(infoElemento);
    actualizarTotal();
}

function insertarCarrito(elemento) {

    const row = document.createElement('tr');
    row.innerHTML = `
        <td> 
            <img src="${elemento.imagen}" width=100 >
        </td>
        <td>
            ${elemento.titulo}
        </td>
        <td class="precio-fila">
            ${elemento.precio}
        </td>
        <td>
            <a href="#" class="borrar" data-id="${elemento.id}">x </a>
        </td>
    `;
    lista.appendChild(row);
}

function eliminarElemento(e){
    e.preventDefault();
    if(e.target.classList.contains('borrar')) {
        // remove the row
        const fila = e.target.parentElement.parentElement;
        fila.remove();
        actualizarTotal();
    }
}

function vaciarCarrito(e) {
    e.preventDefault();
    while(lista.firstChild) {
        lista.removeChild(lista.firstChild);
    }
    actualizarTotal();
    return false;
}

/* ---------- Función para leer precios y actualizar total ---------- */
function parsearPrecio(textoPrecio) {
    // espera formatos como "$200" o "$ 2.000" etc.
    if (!textoPrecio) return 0;
    // quitar cualquier caracter no numerico excepto la coma o punto
    let numero = textoPrecio.replace(/[^\d.,-]/g, '');
    // reemplazar coma por punto si existe
    numero = numero.replace(',', '.');
    // remover puntos de miles si quedaron (ej: 2.000 -> 2000)
    numero = numero.replace(/\.(?=\d{3}(?:\.|$))/g, '');
    const valor = parseFloat(numero);
    return isNaN(valor) ? 0 : valor;
}

function actualizarTotal() {
    const filas = document.querySelectorAll('#lista-carrito tbody tr');
    let total = 0;
    filas.forEach(fila => {
        const precioText = fila.querySelector('.precio-fila').textContent;
        total += parsearPrecio(precioText);
    });
    // formatear con separador de miles sencillo
    totalCarritoP.textContent = `Total: $${total.toLocaleString('es-AR')}`;
}

/* ---------- Pago simulado (no usa backend por a hora) ---------- */
function pagarSimulado() {
    // Recolectar items del carrito
    const filas = document.querySelectorAll('#lista-carrito tbody tr');
    if (filas.length === 0) {
        alert('El carrito está vacío. Agrega productos antes de pagar.');
        return;
    }

    const items = [];
    filas.forEach(fila => {
        const titulo = fila.querySelector('td:nth-child(2)').textContent.trim();
        const precioText = fila.querySelector('.precio-fila').textContent.trim();
        const precio = parsearPrecio(precioText);
        const img = fila.querySelector('img').src;
        items.push({
            title: titulo,
            unit_price: precio,
            quantity: 1,
            picture_url: img
        });
    });

    // Simulamos la creación de una 'preference'
    console.log('Simulación de preferencia - items:', items);

    // Mostrar modal / alert con resumen (opcional)
    let resumen = 'Vas a pagar:\\n';
    let suma = 0;
    items.forEach(i => {
        resumen += `${i.title} - $${i.unit_price.toLocaleString('es-AR')} x ${i.quantity}\\n`;
        suma += i.unit_price * i.quantity;
    });
    resumen += `\\nTotal: $${suma.toLocaleString('es-AR')}`;

    // Simulamos "redirección" al checkout de Mercado Pago:
    // Aquí redirigimos a una página local que representa el pago exitoso.
    if (confirm(resumen + '\\n\\nSimular pago exitoso?')) {
        // vaciar carrito y redirigir a página de éxito
        vaciarCarrito(new Event('click'));
        window.location.href = "pago_exitoso.html";
    } else {
        alert('Pago simulado cancelado.');
    }
}

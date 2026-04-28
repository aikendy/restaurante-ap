// Configuración
const API_URL = 'http://localhost:5100';

let carrito = [];
let menuGlobal = [];

// ========== FUNCIONES GENERALES ==========
async function fetchAPI(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
            },
            ...options
        });
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// ========== PÁGINA MENÚ ==========
async function cargarMenu() {
    const container = document.getElementById('menu-container');
    if (!container) return;
    
    try {
        const platillos = await fetchAPI('/menu');
        menuGlobal = platillos;
        mostrarMenu(platillos);
    } catch (error) {
        container.innerHTML = '<div class="mensaje-error">Error al cargar el menú</div>';
    }
}

function mostrarMenu(platillos) {
    const container = document.getElementById('menu-container');
    const categoriaActiva = document.querySelector('.btn-filtro.active')?.dataset.categoria || 'todos';
    
    let filtered = platillos;
    if (categoriaActiva !== 'todos') {
        filtered = platillos.filter(p => p.categoria === categoriaActiva);
    }
    
    if (filtered.length === 0) {
        container.innerHTML = '<div class="loading">No hay platillos en esta categoría</div>';
        return;
    }
    
    container.innerHTML = filtered.map(platillo => `
        <div class="menu-item ${!platillo.disponible ? 'no-disponible' : ''}">
            <h3>${platillo.nombre}</h3>
            <p>${platillo.descripcion || 'Descripción no disponible'}</p>
            <div class="precio">$${platillo.precio}</div>
            <div class="categoria">${platillo.categoria || 'General'}</div>
            ${!platillo.disponible ? '<div class="no-disponible-tag">⚡ No disponible</div>' : ''}
        </div>
    `).join('');
}

function initFiltros() {
    const filtros = document.querySelectorAll('.btn-filtro');
    filtros.forEach(filtro => {
        filtro.addEventListener('click', () => {
            filtros.forEach(f => f.classList.remove('active'));
            filtro.classList.add('active');
            cargarMenu();
        });
    });
}

// ========== PÁGINA PEDIDO ==========
async function cargarSelectorMenu() {
    const container = document.getElementById('menu-selector');
    if (!container) return;
    
    try {
        const platillos = await fetchAPI('/menu');
        const disponibles = platillos.filter(p => p.disponible !== false);
        
        container.innerHTML = disponibles.map(platillo => `
            <div class="menu-selector-item">
                <div>
                    <strong>${platillo.nombre}</strong>
                    <div>$${platillo.precio}</div>
                </div>
                <div>
                    <input type="number" min="0" max="99" value="0" 
                           data-id="${platillo._id}"
                           data-nombre="${platillo.nombre}"
                           data-precio="${platillo.precio}"
                           class="cantidad-input">
                </div>
            </div>
        `).join('');
        
        // Agregar event listeners a los inputs
        document.querySelectorAll('.cantidad-input').forEach(input => {
            input.addEventListener('change', actualizarCarrito);
        });
    } catch (error) {
        container.innerHTML = '<div class="mensaje-error">Error al cargar el menú</div>';
    }
}

function actualizarCarrito() {
    carrito = [];
    const inputs = document.querySelectorAll('.cantidad-input');
    
    inputs.forEach(input => {
        const cantidad = parseInt(input.value);
        if (cantidad > 0) {
            carrito.push({
                menuId: input.dataset.id,
                nombre: input.dataset.nombre,
                cantidad: cantidad,
                precioUnitario: parseInt(input.dataset.precio)
            });
        }
    });
    
    mostrarCarrito();
}

function mostrarCarrito() {
    const container = document.getElementById('carrito-items');
    if (!container) return;
    
    if (carrito.length === 0) {
        container.innerHTML = '<p>No hay productos en tu pedido</p>';
        document.getElementById('total').textContent = '0';
        return;
    }
    
    let total = 0;
    container.innerHTML = carrito.map(item => {
        const subtotal = item.cantidad * item.precioUnitario;
        total += subtotal;
        return `
            <div class="carrito-item">
                <span>${item.nombre} x${item.cantidad}</span>
                <span>$${subtotal}</span>
            </div>
        `;
    }).join('');
    
    document.getElementById('total').textContent = total;
    return total;
}

async function finalizarPedido() {
    // Validar datos del cliente
    const nombre = document.getElementById('nombre')?.value;
    const email = document.getElementById('email')?.value;
    const telefono = document.getElementById('telefono')?.value;
    const direccion = document.getElementById('direccion')?.value;
    
    if (!nombre || !email || !telefono || !direccion) {
        mostrarMensaje('Por favor completa todos tus datos', 'error');
        return;
    }
    
    if (carrito.length === 0) {
        mostrarMensaje('Agrega al menos un producto al pedido', 'error');
        return;
    }
    
    const metodoPago = document.getElementById('metodo-pago').value;
    
    // Primero registrar al usuario
    try {
        const usuario = await fetchAPI('/usuarios/register', {
            method: 'POST',
            body: JSON.stringify({
                nombre,
                email,
                telefono,
                direccion,
                password: Date.now().toString() // Contraseña temporal
            })
        });
        
        // Crear el pedido
        const pedido = await fetchAPI('/pedidos', {
            method: 'POST',
            body: JSON.stringify({
                clienteId: usuario.usuario._id,
                items: carrito,
                metodoPago,
                direccionEntrega: direccion,
                telefonoContacto: telefono
            })
        });
        
        mostrarMensaje(
            `✅ Pedido creado exitosamente! Guarda tu número: ${pedido.pedido._id}`,
            'exito'
        );
        
        // Limpiar carrito
        carrito = [];
        document.querySelectorAll('.cantidad-input').forEach(input => {
            input.value = 0;
        });
        mostrarCarrito();
        
        // Limpiar formulario
        document.getElementById('nombre').value = '';
        document.getElementById('email').value = '';
        document.getElementById('telefono').value = '';
        document.getElementById('direccion').value = '';
        
    } catch (error) {
        mostrarMensaje('Error al procesar el pedido', 'error');
    }
}

function mostrarMensaje(msg, tipo) {
    const container = document.getElementById('mensaje');
    if (container) {
        container.innerHTML = `<div class="mensaje-${tipo}">${msg}</div>`;
        setTimeout(() => {
            container.innerHTML = '';
        }, 5000);
    }
}

// ========== PÁGINA ESTADO ==========
async function consultarEstado() {
    const idPedido = document.getElementById('id-pedido')?.value;
    const resultado = document.getElementById('resultado');
    
    if (!idPedido) {
        resultado.innerHTML = '<div class="mensaje-error">Por favor ingresa un ID de pedido</div>';
        return;
    }
    
    try {
        const pedido = await fetchAPI(`/pedidos/${idPedido}`);
        
        const estados = {
            'pendiente': '⏳ Pendiente - Esperando confirmación',
            'confirmado': '✅ Confirmado - Tu pedido fue recibido',
            'preparando': '🍳 En preparación - Estamos cocinando tu pedido',
            'listo': '🛵 Listo - Tu pedido está listo para entregar',
            'entregado': '🏠 Entregado - Disfruta tu comida!',
            'cancelado': '❌ Cancelado'
        };
        
        resultado.innerHTML = `
            <div class="resultado-info">
                <h3>📋 Detalles del Pedido</h3>
                <p><strong>Estado:</strong> <span class="estado-${pedido.estado}">${estados[pedido.estado] || pedido.estado}</span></p>
                <p><strong>Total:</strong> $${pedido.total}</p>
                <p><strong>Fecha:</strong> ${new Date(pedido.createdAt).toLocaleString()}</p>
                <h4>Productos:</h4>
                <ul>
                    ${pedido.items.map(item => `
                        <li>${item.nombre} x${item.cantidad} - $${item.subtotal}</li>
                    `).join('')}
                </ul>
                <h4>Historial de Estados:</h4>
                <ul>
                    ${pedido.historialEstados.map(h => `
                        <li>${h.estado} - ${new Date(h.fecha).toLocaleString()} ${h.nota ? `(${h.nota})` : ''}</li>
                    `).join('')}
                </ul>
            </div>
        `;
    } catch (error) {
        resultado.innerHTML = '<div class="mensaje-error">Pedido no encontrado. Verifica el ID</div>';
    }
}

// ========== INICIALIZACIÓN ==========
document.addEventListener('DOMContentLoaded', () => {
    // Página Menú
    if (document.getElementById('menu-container')) {
        cargarMenu();
        initFiltros();
    }
    
    // Página Pedido
    if (document.getElementById('menu-selector')) {
        cargarSelectorMenu();
        const btnFinalizar = document.getElementById('btn-finalizar');
        if (btnFinalizar) {
            btnFinalizar.addEventListener('click', finalizarPedido);
        }
    }
    
    // Página Estado
    const btnConsultar = document.getElementById('btn-consultar');
    if (btnConsultar) {
        btnConsultar.addEventListener('click', consultarEstado);
    }
});
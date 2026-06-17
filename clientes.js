const API_URL = '/api/clientes';
let editandoId = null;

document.addEventListener('DOMContentLoaded', () => {
    cargarClientes();
});

async function cargarClientes() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Error al cargar clientes');
        const clientes = await response.json();
        mostrarClientes(clientes);
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('cuerpoTabla').innerHTML = 
            '<tr><td colspan="6" style="text-align:center; color:red;">Error al cargar clientes</td></tr>';
    }
}

function mostrarClientes(clientes) {
    const tbody = document.getElementById('cuerpoTabla');
    if (clientes.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No hay clientes registrados</td></tr>';
        return;
    }

    let html = '';
    clientes.forEach((cliente) => {
        const color = cliente.estado === 'activo' ? 'green' : 'red';
        html += `<tr>
            <td>${cliente.id}</td>
            <td>${cliente.nombre}</td>
            <td>${cliente.email}</td>
            <td>${cliente.telefono}</td>
            <td><span style="color:${color}; font-weight:bold;">${cliente.estado}</span></td>
            <td>
                <button class="btn-editar" onclick="editarCliente(${cliente.id})">✏️ Editar</button>
                <button class="btn-eliminar" onclick="eliminarCliente(${cliente.id})">🗑️ Eliminar</button>
            </td>
        </tr>`;
    });
    tbody.innerHTML = html;
}

document.getElementById('clienteForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const estado = document.getElementById('estado').value;

    if (!nombre || !email || !telefono) {
        alert('⚠️ Todos los campos son obligatorios');
        return;
    }

    const clienteData = { nombre, email, telefono, estado };

    try {
        let response;
        if (editandoId !== null) {
            response = await fetch(`${API_URL}/${editandoId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(clienteData),
            });
        } else {
            response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(clienteData),
            });
        }

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al guardar');
        }

        this.reset();
        editandoId = null;
        document.getElementById('formTitle').textContent = 'Agregar Nuevo Cliente';
        document.getElementById('btnCancelar').style.display = 'none';
        document.getElementById('btnGuardar').textContent = 'Guardar Cliente';
        await cargarClientes();

    } catch (error) {
        console.error('Error:', error);
        alert(`Error: ${error.message}`);
    }
});

async function editarCliente(id) {
    try {
        const response = await fetch(API_URL);
        const clientes = await response.json();
        const cliente = clientes.find(c => c.id === id);

        if (!cliente) {
            alert('Cliente no encontrado');
            return;
        }

        document.getElementById('clienteId').value = id;
        document.getElementById('nombre').value = cliente.nombre;
        document.getElementById('email').value = cliente.email;
        document.getElementById('telefono').value = cliente.telefono;
        document.getElementById('estado').value = cliente.estado;

        editandoId = id;
        document.getElementById('formTitle').textContent = '✏️ Editar Cliente';
        document.getElementById('btnCancelar').style.display = 'inline-block';
        document.getElementById('btnGuardar').textContent = 'Actualizar Cliente';

    } catch (error) {
        console.error('Error al editar:', error);
        alert('Error al cargar los datos del cliente');
    }
}

document.getElementById('btnCancelar').addEventListener('click', function() {
    document.getElementById('clienteForm').reset();
    editandoId = null;
    document.getElementById('formTitle').textContent = 'Agregar Nuevo Cliente';
    this.style.display = 'none';
    document.getElementById('btnGuardar').textContent = 'Guardar Cliente';
});

async function eliminarCliente(id) {
    if (!confirm('⚠️ ¿Estás seguro de eliminar este cliente y todos sus horarios?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al eliminar');
        }
        await cargarClientes();
    } catch (error) {
        console.error('Error al eliminar:', error);
        alert(`Error: ${error.message}`);
    }
}
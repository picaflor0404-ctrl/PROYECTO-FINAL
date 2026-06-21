// Función para guardar cliente
async function guardarCliente() {
    // Obtener valores del formulario
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const telefono = document.getElementById('telefono').value;
    const estado = document.getElementById('estado').value;
    
    // Validar que todos los campos estén llenos
    if (!nombre || !email || !telefono) {
        alert('Por favor, llena todos los campos');
        return;
    }
    
    // Crear objeto con los datos
    const datos = {
        nombre: nombre,
        email: email,
        telefono: telefono,
        estado: estado
    };
    
    try {
        // Enviar datos a la API
        const response = await fetch('/api/clientes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });
        
        if (response.ok) {
            const resultado = await response.json();
            console.log('✅ Cliente guardado:', resultado);
            alert('✅ Cliente guardado correctamente');
            
            // Limpiar formulario
            document.getElementById('formCliente').reset();
            
            // Recargar la lista de clientes
            cargarClientes();
        } else {
            const error = await response.text();
            console.error('❌ Error:', error);
            alert('❌ Error al guardar cliente: ' + error);
        }
    } catch (error) {
        console.error('❌ Error de conexión:', error);
        alert('❌ Error de conexión con el servidor');
    }
}

// Función para cargar la lista de clientes
async function cargarClientes() {
    try {
        const response = await fetch('/api/clientes');
        const clientes = await response.json();
        
        const tbody = document.getElementById('cuerpoTabla');
        tbody.innerHTML = '';
        
        if (clientes.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 30px;">No hay clientes registrados</td></tr>';
            return;
        }
        
        clientes.forEach(cliente => {
            const tr = document.createElement('tr');
            tr.style.borderBottom = '1px solid #eee';
            tr.innerHTML = `
                <td style="padding: 15px; text-align: center;">${cliente.id}</td>
                <td style="padding: 15px;">${cliente.nombre}</td>
                <td style="padding: 15px;">${cliente.email}</td>
                <td style="padding: 15px;">${cliente.telefono}</td>
                <td style="padding: 15px; text-align: center;">
                    <span style="background: ${cliente.estado === 'activo' ? '#27ae60' : '#e74c3c'}; 
                                 color: white; 
                                 padding: 5px 15px; 
                                 border-radius: 20px; 
                                 font-size: 12px;">
                        ${cliente.estado}
                    </span>
                </td>
                <td style="padding: 15px; text-align: center;">
                    <button onclick="eliminarCliente(${cliente.id})" style="background: #e74c3c; color: white; border: none; padding: 5px 15px; border-radius: 5px; cursor: pointer;">
                        Eliminar
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error al cargar clientes:', error);
        document.getElementById('cuerpoTabla').innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 30px; color: red;">Error al cargar clientes</td></tr>';
    }
}

// Función para eliminar cliente
async function eliminarCliente(id) {
    if (!confirm('¿Estás seguro de eliminar este cliente?')) return;
    
    try {
        const response = await fetch(`/api/clientes/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('✅ Cliente eliminado correctamente');
            cargarClientes();
        } else {
            alert('❌ Error al eliminar cliente');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Error de conexión');
    }
}

// Asignar la función guardarCliente al botón del formulario
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Página de clientes cargada');
    
    // Cargar la lista de clientes al abrir la página
    cargarClientes();
    
    // Asignar evento al formulario
    const form = document.getElementById('formCliente');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault(); // Evita que la página se recargue
            guardarCliente();
        });
        console.log('✅ Formulario configurado correctamente');
    } else {
        console.error('❌ Formulario no encontrado');
    }
});

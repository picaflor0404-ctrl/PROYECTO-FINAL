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
                    <button onclick="editarCliente(${cliente.id})" style="background: #f39c12; color: white; border: none; padding: 5px 15px; border-radius: 5px; cursor: pointer; margin-right: 5px;">Editar</button>
                    <button onclick="eliminarCliente(${cliente.id})" style="background: #e74c3c; color: white; border: none; padding: 5px 15px; border-radius: 5px; cursor: pointer;">Eliminar</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error al cargar clientes:', error);
    }
}

async function eliminarCliente(id) {
    if (!confirm('¿Estás seguro de eliminar este cliente?')) return;
    
    try {
        const response = await fetch(`/api/clientes/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            cargarClientes();
        } else {
            alert('Error al eliminar cliente');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

document.addEventListener('DOMContentLoaded', cargarClientes);

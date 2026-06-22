// Función para cargar clientes en el select
async function cargarClientesSelect() {
    try {
        const response = await fetch('/api/clientes');
        const clientes = await response.json();
        
        const select = document.getElementById('cliente_id');
        select.innerHTML = '<option value="">Selecciona un cliente</option>';
        
        clientes.forEach(cliente => {
            const option = document.createElement('option');
            option.value = cliente.id;
            option.textContent = `${cliente.nombre} (${cliente.email})`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar clientes:', error);
    }
}

// Función para guardar horario
async function guardarHorario() {
    const cliente_id = document.getElementById('cliente_id').value;
    const dia = document.getElementById('dia').value;
    const hora = document.getElementById('hora').value;
    const entrenador = document.getElementById('entrenador').value;
    
    if (!cliente_id) {
        alert('Por favor, selecciona un cliente');
        return;
    }
    
    if (!dia || !hora || !entrenador) {
        alert('Por favor, llena todos los campos');
        return;
    }
    
    const datos = {
        cliente_id: parseInt(cliente_id),
        dia: dia,
        hora: hora,
        entrenador: entrenador
    };
    
    try {
        const response = await fetch('/api/horarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });
        
        if (response.ok) {
            const resultado = await response.json();
            console.log('✅ Horario guardado:', resultado);
            alert('✅ Horario guardado correctamente');
            
            // Limpiar formulario
            document.getElementById('formHorario').reset();
            document.getElementById('cliente_id').value = '';
            
            // Recargar la lista de horarios
            cargarHorarios();
        } else {
            const error = await response.text();
            console.error('❌ Error:', error);
            alert('❌ Error al guardar horario: ' + error);
        }
    } catch (error) {
        console.error('❌ Error de conexión:', error);
        alert('❌ Error de conexión con el servidor');
    }
}

// Función para cargar la lista de horarios
async function cargarHorarios() {
    try {
        const response = await fetch('/api/horarios');
        const horarios = await response.json();
        
        const tbody = document.getElementById('cuerpoTabla');
        tbody.innerHTML = '';
        
        if (horarios.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 30px;">No hay horarios registrados</td></tr>';
            return;
        }
        
        horarios.forEach(horario => {
            const tr = document.createElement('tr');
            tr.style.borderBottom = '1px solid #eee';
            tr.innerHTML = `
                <td style="padding: 15px; text-align: center;">${horario.id}</td>
                <td style="padding: 15px;">${horario.cliente_nombre}</td>
                <td style="padding: 15px;">${horario.dia}</td>
                <td style="padding: 15px;">${horario.hora}</td>
                <td style="padding: 15px;">${horario.entrenador}</td>
                <td style="padding: 15px; text-align: center;">
                    <button onclick="eliminarHorario(${horario.id})" style="background: #e74c3c; color: white; border: none; padding: 5px 15px; border-radius: 5px; cursor: pointer;">
                        Eliminar
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error al cargar horarios:', error);
        document.getElementById('cuerpoTabla').innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 30px; color: red;">Error al cargar horarios</td></tr>';
    }
}

// Función para eliminar horario
async function eliminarHorario(id) {
    if (!confirm('¿Estás seguro de eliminar este horario?')) return;
    
    try {
        const response = await fetch(`/api/horarios/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('✅ Horario eliminado correctamente');
            cargarHorarios();
        } else {
            alert('❌ Error al eliminar horario');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Error de conexión');
    }
}

// Asignar la función guardarHorario al formulario
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Página de horarios cargada');
    
    // Cargar clientes en el select
    cargarClientesSelect();
    
    // Cargar la lista de horarios al abrir la página
    cargarHorarios();
    
    // Asignar evento al formulario
    const form = document.getElementById('formHorario');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            guardarHorario();
        });
        console.log('✅ Formulario configurado correctamente');
    } else {
        console.error('❌ Formulario no encontrado');
    }
});

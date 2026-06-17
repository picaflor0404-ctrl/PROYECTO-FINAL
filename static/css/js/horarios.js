const API_URL_HORARIOS = '/api/horarios';
const API_URL_CLIENTES = '/api/clientes';
let editandoIdHorario = null;

document.addEventListener('DOMContentLoaded', () => {
    cargarHorarios();
    cargarClientesParaSelect();
});

async function cargarHorarios() {
    try {
        const response = await fetch(API_URL_HORARIOS);
        if (!response.ok) throw new Error('Error al cargar horarios');
        const horarios = await response.json();
        mostrarHorarios(horarios);
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('cuerpoTablaHorarios').innerHTML = 
            '<tr><td colspan="6" style="text-align:center; color:red;">Error al cargar horarios</td></tr>';
    }
}

async function cargarClientesParaSelect() {
    try {
        const response = await fetch(API_URL_CLIENTES);
        const clientes = await response.json();
        const select = document.getElementById('cliente');
        select.innerHTML = '<option value="">Seleccione un cliente...</option>';
        clientes.forEach(c => {
            const option = document.createElement('option');
            option.value = c.id;
            option.textContent = c.nombre;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar clientes:', error);
    }
}

function mostrarHorarios(horarios) {
    const tbody = document.getElementById('cuerpoTablaHorarios');
    if (horarios.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No hay horarios registrados</td></tr>';
        return;
    }

    let html = '';
    horarios.forEach((h) => {
        html += `<tr>
            <td>${h.id}</td>
            <td>${h.cliente_nombre}</td>
            <td>${h.dia}</td>
            <td>${h.hora}</td>
            <td>${h.entrenador}</td>
            <td>
                <button class="btn-editar" onclick="editarHorario(${h.id})">✏️ Editar</button>
                <button class="btn-eliminar" onclick="eliminarHorario(${h.id})">🗑️ Eliminar</button>
            </td>
        </tr>`;
    });
    tbody.innerHTML = html;
}

document.getElementById('horarioForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const cliente_id = parseInt(document.getElementById('cliente').value);
    const dia = document.getElementById('dia').value;
    const hora = document.getElementById('hora').value;
    const entrenador = document.getElementById('entrenador').value.trim();

    if (!cliente_id || !dia || !hora || !entrenador) {
        alert('⚠️ Todos los campos son obligatorios');
        return;
    }

    const horarioData = { cliente_id, dia, hora, entrenador };

    try {
        let response;
        if (editandoIdHorario !== null) {
            response = await fetch(`${API_URL_HORARIOS}/${editandoIdHorario}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(horarioData),
            });
        } else {
            response = await fetch(API_URL_HORARIOS, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(horarioData),
            });
        }

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al guardar');
        }

        this.reset();
        editandoIdHorario = null;
        document.getElementById('formTitleHorario').textContent = 'Agregar Nuevo Horario';
        document.getElementById('btnCancelarHorario').style.display = 'none';
        document.getElementById('btnGuardarHorario').textContent = 'Guardar Horario';
        await cargarHorarios();

    } catch (error) {
        console.error('Error:', error);
        alert(`Error: ${error.message}`);
    }
});

async function editarHorario(id) {
    try {
        const response = await fetch(API_URL_HORARIOS);
        const horarios = await response.json();
        const h = horarios.find(h => h.id === id);

        if (!h) {
            alert('Horario no encontrado');
            return;
        }

        document.getElementById('horarioId').value = id;
        document.getElementById('cliente').value = h.cliente_id;
        document.getElementById('dia').value = h.dia;
        document.getElementById('hora').value = h.hora;
        document.getElementById('entrenador').value = h.entrenador;

        editandoIdHorario = id;
        document.getElementById('formTitleHorario').textContent = '✏️ Editar Horario';
        document.getElementById('btnCancelarHorario').style.display = 'inline-block';
        document.getElementById('btnGuardarHorario').textContent = 'Actualizar Horario';

    } catch (error) {
        console.error('Error al editar:', error);
        alert('Error al cargar los datos del horario');
    }
}

document.getElementById('btnCancelarHorario').addEventListener('click', function() {
    document.getElementById('horarioForm').reset();
    editandoIdHorario = null;
    document.getElementById('formTitleHorario').textContent = 'Agregar Nuevo Horario';
    this.style.display = 'none';
    document.getElementById('btnGuardarHorario').textContent = 'Guardar Horario';
});

async function eliminarHorario(id) {
    if (!confirm('⚠️ ¿Estás seguro de eliminar este horario?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL_HORARIOS}/${id}`, { method: 'DELETE' });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al eliminar');
        }
        await cargarHorarios();
    } catch (error) {
        console.error('Error al eliminar:', error);
        alert(`Error: ${error.message}`);
    }
}
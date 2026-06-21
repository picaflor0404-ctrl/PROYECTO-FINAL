const API_URL_CLIENTES = '/api/clientes';
const API_URL_HORARIOS = '/api/horarios';

async function actualizarDashboard() {
    try {
        const responseClientes = await fetch(API_URL_CLIENTES);
        const clientes = await responseClientes.json();

        const responseHorarios = await fetch(API_URL_HORARIOS);
        const horarios = await responseHorarios.json();

        document.getElementById('totalClientes').textContent = clientes.length;
        document.getElementById('totalHorarios').textContent = horarios.length;

        const activos = clientes.filter(c => c.estado === 'activo').length;
        document.getElementById('clientesActivos').textContent = activos;

        document.getElementById('horariosOcupados').textContent = horarios.length;

        const ultimos = clientes.slice(0, 5);
        const contenedor = document.getElementById('ultimosClientes');

        if (ultimos.length === 0) {
            contenedor.innerHTML = '<p>No hay clientes registrados aún.</p>';
        } else {
            let html = `<table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>`;
            ultimos.forEach(c => {
                const color = c.estado === 'activo' ? 'green' : 'red';
                html += `<tr>
                    <td>${c.nombre}</td>
                    <td>${c.email}</td>
                    <td><span style="color:${color}; font-weight:bold;">${c.estado}</span></td>
                </tr>`;
            });
            html += `</tbody></table>`;
            contenedor.innerHTML = html;
        }
    } catch (error) {
        console.error('Error al actualizar dashboard:', error);
        document.getElementById('ultimosClientes').innerHTML = '<p>Error al cargar los datos.</p>';
    }
}

document.addEventListener('DOMContentLoaded', actualizarDashboard);

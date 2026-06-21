async function cargarHorarios() {
    try {
        const response = await fetch('/api/horarios');
        const horarios = await response.json();
        
        const tbody = document.getElementById('cuerpoTabla');
        tbody.innerHTML = '';
        
        if (horarios.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 30px;">No hay horarios registrados</td></tr>';
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
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error al cargar horarios:', error);
    }
}

document.addEventListener('DOMContentLoaded', cargarHorarios);

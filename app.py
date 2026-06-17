from flask import Flask, request, jsonify, render_template
import sqlite3

app = Flask(__name__)

# --- FUNCIONES DE BASE DE DATOS ---

def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS clientes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            email TEXT NOT NULL,
            telefono TEXT NOT NULL,
            estado TEXT NOT NULL
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS horarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cliente_id INTEGER NOT NULL,
            dia TEXT NOT NULL,
            hora TEXT NOT NULL,
            entrenador TEXT NOT NULL,
            FOREIGN KEY (cliente_id) REFERENCES clientes (id) ON DELETE CASCADE
        )
    ''')
    
    conn.commit()
    conn.close()

init_db()

# --- RUTAS ---

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

@app.route('/clientes')
def clientes():
    return render_template('clientes.html')

@app.route('/horarios')
def horarios():
    return render_template('horarios.html')

# --- API CLIENTES ---

@app.route('/api/clientes', methods=['GET'])
def get_clientes():
    conn = get_db_connection()
    clientes = conn.execute('SELECT * FROM clientes ORDER BY id DESC').fetchall()
    conn.close()
    return jsonify([dict(c) for c in clientes])

@app.route('/api/clientes', methods=['POST'])
def create_cliente():
    data = request.get_json()
    nombre = data.get('nombre')
    email = data.get('email')
    telefono = data.get('telefono')
    estado = data.get('estado', 'activo')
    
    if not nombre or not email or not telefono:
        return jsonify({'error': 'Faltan datos'}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        'INSERT INTO clientes (nombre, email, telefono, estado) VALUES (?, ?, ?, ?)',
        (nombre, email, telefono, estado)
    )
    conn.commit()
    nuevo_id = cursor.lastrowid
    conn.close()
    return jsonify({'id': nuevo_id, 'message': 'Cliente creado'}), 201

@app.route('/api/clientes/<int:id>', methods=['PUT'])
def update_cliente(id):
    data = request.get_json()
    nombre = data.get('nombre')
    email = data.get('email')
    telefono = data.get('telefono')
    estado = data.get('estado')
    
    if not nombre or not email or not telefono or not estado:
        return jsonify({'error': 'Faltan datos'}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        'UPDATE clientes SET nombre = ?, email = ?, telefono = ?, estado = ? WHERE id = ?',
        (nombre, email, telefono, estado, id)
    )
    conn.commit()
    conn.close()
    return jsonify({'message': 'Cliente actualizado'})

@app.route('/api/clientes/<int:id>', methods=['DELETE'])
def delete_cliente(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM clientes WHERE id = ?', (id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Cliente eliminado'}), 200

# --- API HORARIOS ---

@app.route('/api/horarios', methods=['GET'])
def get_horarios():
    conn = get_db_connection()
    horarios = conn.execute('''
        SELECT horarios.*, clientes.nombre as cliente_nombre
        FROM horarios
        JOIN clientes ON horarios.cliente_id = clientes.id
        ORDER BY horarios.id DESC
    ''').fetchall()
    conn.close()
    return jsonify([dict(h) for h in horarios])

@app.route('/api/horarios', methods=['POST'])
def create_horario():
    data = request.get_json()
    cliente_id = data.get('cliente_id')
    dia = data.get('dia')
    hora = data.get('hora')
    entrenador = data.get('entrenador')
    
    if not cliente_id or not dia or not hora or not entrenador:
        return jsonify({'error': 'Faltan datos'}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        'INSERT INTO horarios (cliente_id, dia, hora, entrenador) VALUES (?, ?, ?, ?)',
        (cliente_id, dia, hora, entrenador)
    )
    conn.commit()
    nuevo_id = cursor.lastrowid
    conn.close()
    return jsonify({'id': nuevo_id, 'message': 'Horario creado'}), 201

@app.route('/api/horarios/<int:id>', methods=['PUT'])
def update_horario(id):
    data = request.get_json()
    cliente_id = data.get('cliente_id')
    dia = data.get('dia')
    hora = data.get('hora')
    entrenador = data.get('entrenador')
    
    if not cliente_id or not dia or not hora or not entrenador:
        return jsonify({'error': 'Faltan datos'}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        'UPDATE horarios SET cliente_id = ?, dia = ?, hora = ?, entrenador = ? WHERE id = ?',
        (cliente_id, dia, hora, entrenador, id)
    )
    conn.commit()
    conn.close()
    return jsonify({'message': 'Horario actualizado'})

@app.route('/api/horarios/<int:id>', methods=['DELETE'])
def delete_horario(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM horarios WHERE id = ?', (id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Horario eliminado'}), 200

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5001, debug=True)
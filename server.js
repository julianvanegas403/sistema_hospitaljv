const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;
const DB_FILE = path.join(__dirname, 'turnos.json');

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

function leerTurnos() {
    if (!fs.existsSync(DB_FILE)) return [];
    try {
        const data = fs.readFileSync(DB_FILE, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
}

function guardarTurnos(turnos) {
    fs.writeFileSync(DB_FILE, JSON.stringify(turnos, null, 2));
}

app.get('/api/turnos', (req, res) => {
    res.json(leerTurnos());
});

app.post('/api/turnos', (req, res) => {
    const turnos = leerTurnos();
    const nuevoTurno = { id: Date.now(), ...req.body };
    turnos.push(nuevoTurno);
    guardarTurnos(turnos);
    res.status(201).json(nuevoTurno);
});

app.delete('/api/turnos/:id', (req, res) => {
    let turnos = leerTurnos();
    const id = Number(req.params.id);
    turnos = turnos.filter(t => t.id !== id);
    guardarTurnos(turnos);
    res.status(204).send();
});

app.get('/{*splat}', (req, res) => {
    res.sendFile(path.join(__dirname, 'sistema_hospital.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
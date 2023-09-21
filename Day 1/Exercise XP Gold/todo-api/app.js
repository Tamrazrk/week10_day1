const express = require('express');
const { Pool } = require('pg');
const app = express();

app.use(express.json());

const pool = new Pool({
    user: 'learning',
    host: 'localhost',
    database: 'tododb',
    password: 'passwor1234',
    port: 5432,
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


app.post('/api/todos', async (req, res) => {
    const { title } = req.body;
    try {
        const result = await pool.query('INSERT INTO todos(title) VALUES($1) RETURNING *', [title]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get('/api/todos', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM todos');
        res.json(result.rows);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get('/api/todos/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const result = await pool.query('SELECT * FROM todos WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            res.status(404).send('Todo not found');
        } else {
            res.json(result.rows[0]);
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

app.put('/api/todos/:id', async (req, res) => {
    const id = req.params.id;
    const { title, completed } = req.body;
    try {
        const result = await pool.query('UPDATE todos SET title = $1, completed = $2 WHERE id = $3 RETURNING *', [title, completed, id]);
        if (result.rows.length === 0) {
            res.status(404).send('Todo not found');
        } else {
            res.json(result.rows[0]);
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

app.delete('/api/todos/:id', async (req, res) => {
    const id = req.params.id;
    try {
        await pool.query('DELETE FROM todos WHERE id = $1', [id]);
        res.json({ message: 'Deleted successfully!' });
    } catch (err) {
        res.status(500).send(err);
    }
});

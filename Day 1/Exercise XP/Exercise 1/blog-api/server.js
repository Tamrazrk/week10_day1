const express = require('express');
const app = express();
app.use(express.json());

const { Pool } = require('pg');
const pool = new Pool({
    user: 'learning',
    host: 'localhost',
    database: 'blogdb',
    password: 'passwor1234',
    port: 5432,
});


app.get('/posts', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM posts');
        res.json(result.rows);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get('/posts/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const result = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.post('/posts', async (req, res) => {
    const { title, content } = req.body;
    try {
        const result = await pool.query('INSERT INTO posts(title, content) VALUES($1, $2) RETURNING *', [title, content]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.put('/posts/:id', async (req, res) => {
    const id = req.params.id;
    const { title, content } = req.body;
    try {
        const result = await pool.query('UPDATE posts SET title = $1, content = $2 WHERE id = $3 RETURNING *', [title, content, id]);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.delete('/posts/:id', async (req, res) => {
    const id = req.params.id;
    try {
        await pool.query('DELETE FROM posts WHERE id = $1', [id]);
        res.json({ message: 'Deleted successfully!' });
    } catch (err) {
        res.status(500).send(err);
    }
});
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500).json({ error: error.message });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

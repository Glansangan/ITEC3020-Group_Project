import express from 'express';
import mysql from 'mysql2';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12345westLP',
  database: 'crud_app'
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL Database');
});

// Get all tasks
app.get('/tasks', (req, res) => {
  db.query('SELECT * FROM tasks', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Add a task
app.post('/add', (req, res) => {
  const { task, type, completed } = req.body;
  db.query('INSERT INTO tasks (task, type, completed) VALUES (?, ?, ?)', [task, type, completed], err => {
    if (err) return res.status(500).send(err);
    res.send('Task added');
  });
});

// Update a task
app.put('/update/:id', (req, res) => {
  const { id } = req.params;
  const { task, completed } = req.body;

  const query = task !== undefined
    ? 'UPDATE tasks SET task = ?, completed = ? WHERE id = ?'
    : 'UPDATE tasks SET completed = ? WHERE id = ?';

  const values = task !== undefined
    ? [task, completed ?? false, id]
    : [completed ?? false, id];

  db.query(query, values, err => {
    if (err) return res.status(500).send(err);
    res.send('Task updated');
  });
});

// Delete a task
app.delete('/delete/:id', (req, res) => {
  db.query('DELETE FROM tasks WHERE id = ?', [req.params.id], err => {
    if (err) return res.status(500).send(err);
    res.send('Task deleted');
  });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

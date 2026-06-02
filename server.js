const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const jwt = require('jwt-simple');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Database setup
const db = new sqlite3.Database('./attendance.db', (err) => {
  if (err) console.error('Database connection error:', err);
  else console.log('Connected to SQLite database');
});

// Create tables
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS attendance (
      id INTEGER PRIMARY KEY,
      user_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      status TEXT NOT NULL,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id),
      UNIQUE(user_id, date)
    )
  `);
});

// Middleware to verify token
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.decode(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Routes

// Register
app.post('/api/register', (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);

  db.run(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, hashedPassword],
    function(err) {
      if (err) {
        return res.status(400).json({ error: 'Email already exists' });
      }
      const token = jwt.encode({ id: this.lastID, email }, JWT_SECRET);
      res.json({ message: 'User registered successfully', token, userId: this.lastID });
    }
  );
});

// Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err || !user) {
      return res.status(400).json({ error: 'User not found' });
    }

    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    const token = jwt.encode({ id: user.id, email: user.email }, JWT_SECRET);
    res.json({ message: 'Login successful', token, userId: user.id, name: user.name });
  });
});

// Mark attendance
app.post('/api/attendance', authenticateToken, (req, res) => {
  const { date, status, notes } = req.body;
  const userId = req.user.id;

  db.run(
    'INSERT OR REPLACE INTO attendance (user_id, date, status, notes) VALUES (?, ?, ?, ?)',
    [userId, date, status, notes || ''],
    function(err) {
      if (err) {
        return res.status(400).json({ error: 'Failed to record attendance' });
      }
      res.json({ message: 'Attendance marked successfully' });
    }
  );
});

// Get attendance for user
app.get('/api/attendance', authenticateToken, (req, res) => {
  const userId = req.user.id;

  db.all(
    'SELECT * FROM attendance WHERE user_id = ? ORDER BY date DESC',
    [userId],
    (err, rows) => {
      if (err) {
        return res.status(400).json({ error: 'Failed to fetch attendance' });
      }
      res.json(rows);
    }
  );
});

// Get attendance statistics
app.get('/api/stats', authenticateToken, (req, res) => {
  const userId = req.user.id;

  db.all(
    'SELECT status, COUNT(*) as count FROM attendance WHERE user_id = ? GROUP BY status',
    [userId],
    (err, rows) => {
      if (err) {
        return res.status(400).json({ error: 'Failed to fetch stats' });
      }
      res.json(rows);
    }
  );
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

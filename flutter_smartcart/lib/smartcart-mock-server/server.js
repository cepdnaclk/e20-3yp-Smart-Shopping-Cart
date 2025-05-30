const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
const PORT = 3000;

app.use(express.json());

// MySQL Connection Settings (same as your Flutter app)
const dbConfig = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'root123',
  database: 'smartcart',
};

// 🟢 Login API
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const connection = await mysql.createConnection(dbConfig);

    const [rows] = await connection.execute(
      'SELECT * FROM customer WHERE username = ? AND password = ?',
      [username, password]
    );

    await connection.end();

    if (rows.length > 0) {
      res.json({ success: true, user: rows[0] });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// 🟢 Register API
app.post('/register', async (req, res) => {
  const { username, fullname, contact, sex, password } = req.body;

  try {
    const connection = await mysql.createConnection(dbConfig);

    await connection.execute(
      'INSERT INTO customer (username, fullname, contact, sex, password) VALUES (?, ?, ?, ?, ?)',
      [username, fullname, contact, sex, password]
    );

    await connection.end();
    res.json({ success: true, message: 'User registered successfully' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
});

// 🟢 Get Profile API
app.get('/profile/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const connection = await mysql.createConnection(dbConfig);

    const [rows] = await connection.execute(
      'SELECT * FROM customer WHERE username = ?',
      [username]
    );

    await connection.end();

    if (rows.length > 0) {
      res.json(rows[0]); // Return user profile
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 🟢 Get All Products
app.get('/products', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);

    const [rows] = await connection.execute('SELECT * FROM products');

    await connection.end();

    res.json(rows);
  } catch (err) {
    console.error('Fetch products error:', err);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

//    (Optional) GET Product by ID
app.get('/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const connection = await mysql.createConnection(dbConfig);

    const [rows] = await connection.execute(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );

    await connection.end();

    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    console.error('Fetch product by ID error:', err);
    res.status(500).json({ message: 'Failed to fetch product' });
  }
});


app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

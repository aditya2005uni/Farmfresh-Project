const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors'); // import cors
const path = require('path'); 

dotenv.config(); // load .env

const app = express(); // initialize app

// Middleware
app.use(cors()); // now OK
app.use(express.json()); // for parsing JSON requests

// Connect Database
connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));


app.use(express.static(path.join(__dirname, '../farmfresh-frontend')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../farmfresh-frontend', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

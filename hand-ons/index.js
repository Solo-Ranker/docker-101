const express = require('express');
const knex = require('knex')(require('./knexfile').development);
const app = express();
const port = 3000;

app.use(express.json());

// Create a new user
app.post('/users', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Insert user into PostgreSQL
   knex('users').insert({
      username,
      email,
      password,
    }).returning('id');

    res.status(201).json({
      message: 'User created successfully'
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      message: 'Error creating user',
      error: error.message,
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
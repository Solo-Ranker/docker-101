const express = require('express');
const knex = require('knex')(require('./knexfile').development);
const redisClient = require('./redis');
const app = express();
const port = 3000;

app.use(express.json());

// Utility function to cache users in Redis
const cacheUser = (id, data) => {
  redisClient.setex(`user:${id}`, 3600, JSON.stringify(data));
};

// Create a new user
app.post('/users', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Insert user into PostgreSQL
    const [userId] = await knex('users').insert({
      username,
      email,
      password,
    }).returning('id');

    // Retrieve newly created user
    const user = await knex('users').where({ id: userId }).first();

    // Cache user in Redis
    cacheUser(userId, user);

    res.status(201).json({
      message: 'User created successfully',
      user,
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
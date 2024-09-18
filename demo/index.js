require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));


// Create User Schema
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', UserSchema);

// Middleware
app.use(bodyParser.json());

// Log file setup
const logFile = path.join(__dirname, 'demo.log');

// User registration route
app.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Create new user
    const newUser = new User({
      username,
      email,
      password
    });

    // Save user to database
    await newUser.save();

    // Log user registration
    const logMessage = `new user registered >>> ${username} (${email}) at ${new Date().toISOString()}\n`;
    fs.appendFile(logFile, logMessage, (err) => {
      if (err) console.error('Error writing to log file:', err);
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
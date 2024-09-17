const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/userdb');

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

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword
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
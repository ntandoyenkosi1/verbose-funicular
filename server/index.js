const express = require('express');
const cors = require('cors');
const app = express();
require("dotenv").config() // enables environment variables access in a Node enviroment: process.env.*
const PORT = process.env.PORT || 5000; // In production, the PORT is always provided by the deployment platform
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs")
app.use(cors());
app.use(express.json());
const path = require('path');
// Update this connection string with your MongoDB URI
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/portal_db';
// --- Database Connection ---
mongoose.connect(MONGO_URI)
  .then(() => 
    console.log('Successfully connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err))

// --- User Schema & Model ---
const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  idNumber: { type: String, required: true, unique: true },
  accountNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
// 1. Serve the static files from the React build
app.use(express.static(path.join(__dirname, 'public')));

// Sample API route
app.get('/api/message', (req, res) => {
  res.json({ message: "Hello from the Express Server!" });
});
/**
 * Registration API Endpoint
 * Method: POST
 * URL: http://localhost:3000/api/register
 */
app.post('/api/register', async (req, res) => {
  // Retrieve details from the Request body
  const { fullName, idNumber, accountNumber, password } = req.body;

  // Validate fields to ensure they all exist
  if (!fullName || !idNumber || !accountNumber || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  // Hash the password using Bcrypt
  // Salt rounds: 10 is standard for security vs performance
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  /**
   * @TODO Check if the User Id or Account number already exist in the database
   */
  // Create and Save a new User
  const newUser = new User({
    fullName,
    idNumber,
    accountNumber,
    password: hashedPassword // Save the hash, not the plain text!
  });
  // Save the user to the database
  await newUser.save();
  console.log(`User registered: ${fullName} (ID: ${idNumber})`);

  res.status(201).json({
    status: 'success',
    message: 'Account created and saved to database securely.'
  });
});

/**
 * Login API Endpoint Workflow
 * Method: POST
 * URL: http://localhost:3000/api/login
 */
app.post('/api/login', async (req, res) => {
  /**
   * @TODO Retrieve the details from the request body
   */


  /**
   * @TODO Check if the User details exist in the database
   */

  /**
   * @TODO If the user exist then check if the passwords hashes match: https://github.com/dcodeIO/bcrypt.js#usage---async 
   */

  /**
   * @TODO If the password hashes match return the appropriate values that could be used in the frontend to implement further functionality.
   */

})

/**
 * Portal API Endpoint Workflow
 * Method: POST
 * URL: http://localhost:3000/api/portal/view AND/OR http://localhost:3000/api/portal/pay
 * @TODO Implement the APIs for the Customer Portal View, Payment and any other relevant APIs that may be useful to the user
 */
app.get('/api/portal/view', async (req, res) => {
  // Not implemented yet
})

app.post('/api/login/pay', async (req, res) => {
  // Not Implemented yet
})
// This sends the React index.html for any request that isn't an API call
app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB')
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error('MongoDB connection error:', err));


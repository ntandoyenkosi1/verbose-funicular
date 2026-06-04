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
const ExpressBrute = require('express-brute');
const store = new ExpressBrute.MemoryStore();
const bruteforce = new ExpressBrute(store);
// Update this connection string with your MongoDB URI
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/portal_db';


async function seedDatabase() {
  try {
    // Check if there are any users in the database
    const userCount = await User.countDocuments();

    if (userCount == 0) {
      console.log('No users found. Seeding database...');

      // Hash passwords for the seed users
      const saltRounds = 10;
      const passwordAlice = await bcrypt.hash('Password123!', saltRounds);
      const passwordBob = await bcrypt.hash('Password123!', saltRounds);

      // Define the seed data
      const seedUsers = [
        {
          fullName: 'Jane Doe',
          idNumber: 'ID-998877',
          accountNumber: 'ACC-112233',
          password: passwordAlice,
          balance: 1000.00
        },
        {
          fullName: 'Bob Jones',
          idNumber: 'ID-445566',
          accountNumber: 'ACC-445566',
          password: passwordBob,
          balance: 1500.50
        }
      ];

      // Insert many user records into MongoDB
      await User.insertMany(seedUsers);
      console.log('Successfully seeded 2 users into the database.');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('Successfully connected to MongoDB')
    await seedDatabase();
  })
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
app.post('/api/login', bruteforce.prevent, async (req, res) => {
  try {
    // Retrieve the details from the request body
    const { accountNumber, password } = req.body;

    if (!accountNumber || !password) {
      return res.status(400).json({ message: 'Account number and password are required.' });
    }

    // Check if the User details exist in the database
    const user = await User.findOne({ accountNumber });
    if (!user) {
      return res.status(401).json({ message: 'Invalid Account Number or Password.' });
    }

    // Check if the passwords hashes match
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid Account Number or Password.' });
    }

    // If the password hashes match, return data useful for the frontend
    // Note: In production, consider issuing a JWT (JSON Web Token) here instead of raw IDs.
    res.status(200).json({
      status: 'success',
      message: 'Login successful.',
      user: {
        id: user._id,
        fullName: user.fullName,
        accountNumber: user.accountNumber
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

/**
 * Portal API Endpoint Workflow
 * Method: POST
 * URL: http://localhost:3000/api/portal/view AND/OR http://localhost:3000/api/portal/pay
 * @TODO Implement the APIs for the Customer Portal View, Payment and any other relevant APIs that may be useful to the user
 */
app.get('/api/portal/view', async (req, res) => {
  try {
    const { accountNumber } = req.query;

    if (!accountNumber) {
      return res.status(400).json({ message: 'Account number parameter is required.' });
    }

    const user = await User.findOne({ accountNumber }).select('-password'); // Exclude the password hash
    if (!user) {
      return res.status(404).json({ message: 'Account not found.' });
    }

    res.status(200).json({
      status: 'success',
      data: {
        fullName: user.fullName,
        accountNumber: user.accountNumber,
        balance: user.balance,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Portal View Error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

app.post('/api/portal/pay', async (req, res) => {
  try {
    const { accountNumber, amount } = req.body;

    if (!accountNumber || amount === undefined) {
      return res.status(400).json({ message: 'Account number and payment amount are required.' });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: 'Payment amount must be greater than zero.' });
    }

    // Find the user
    const user = await User.findOne({ accountNumber });
    if (!user) {
      return res.status(404).json({ message: 'Account not found.' });
    }

    // Check if user has sufficient funds
    if (user.balance < amount) {
      return res.status(400).json({ message: 'Insufficient funds to complete this payment.' });
    }

    // Deduct amount and update database
    user.balance -= amount;
    await user.save();

    res.status(200).json({
      status: 'success',
      message: `Payment of $${amount} processed successfully.`,
      newBalance: user.balance
    });
  } catch (error) {
    console.error('Payment Error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});
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
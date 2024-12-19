#!/usr/bin/env node
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const readline = require('readline');
const User = require('../models/User');
require('dotenv').config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function addUser() {
  try {
    const username = await question('Enter username: ');
    const password = await question('Enter password: ');
    
    // Check if user exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log('User already exists');
      return;
    }

    // Create new user
    const user = new User({ username, password });
    await user.save();
    console.log('User created successfully');
  } catch (err) {
    console.error('Error creating user:', err.message);
  }
}

async function listUsers() {
  try {
    const users = await User.find({}, 'username lastLogin');
    console.log('\nCurrent users:');
    users.forEach(user => {
      console.log(`- ${user.username} (Last login: ${user.lastLogin ? user.lastLogin.toLocaleString() : 'Never'})`);
    });
  } catch (err) {
    console.error('Error listing users:', err.message);
  }
}

async function deleteUser() {
  try {
    const username = await question('Enter username to delete: ');
    const user = await User.findOne({ username });
    
    if (!user) {
      console.log('User not found');
      return;
    }

    await User.deleteOne({ username });
    console.log('User deleted successfully');
  } catch (err) {
    console.error('Error deleting user:', err.message);
  }
}

async function changePassword() {
  try {
    const username = await question('Enter username: ');
    const user = await User.findOne({ username });
    
    if (!user) {
      console.log('User not found');
      return;
    }

    const newPassword = await question('Enter new password: ');
    user.password = newPassword;
    await user.save();
    console.log('Password changed successfully');
  } catch (err) {
    console.error('Error changing password:', err.message);
  }
}

async function main() {
  try {
    while (true) {
      console.log('\nUser Management');
      console.log('1. Add user');
      console.log('2. List users');
      console.log('3. Delete user');
      console.log('4. Change password');
      console.log('5. Exit');
      
      const choice = await question('\nSelect an option (1-5): ');
      
      switch (choice) {
        case '1':
          await addUser();
          break;
        case '2':
          await listUsers();
          break;
        case '3':
          await deleteUser();
          break;
        case '4':
          await changePassword();
          break;
        case '5':
          console.log('Goodbye!');
          rl.close();
          process.exit(0);
        default:
          console.log('Invalid option');
      }
    }
  } catch (err) {
    console.error('An error occurred:', err.message);
  }
}

// Handle cleanup
rl.on('close', () => {
  mongoose.disconnect();
  process.exit(0);
});

main();
/**
 * CREATE AGENT USER SCRIPT
 * 
 * Run this script to create an agent user or convert existing user to agent
 * Usage: node createAgent.js
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import readline from 'readline';
import { config } from './src/config/env.js';
import { User } from './src/models/User.model.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function createAgentUser() {
  try {
    // Connect to MongoDB
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(config.mongoUri);
    console.log('✅ Connected to MongoDB\n');

    // Ask for operation type
    console.log('Choose operation:');
    console.log('1. Create new agent user');
    console.log('2. Convert existing user to agent\n');
    
    const choice = await question('Enter choice (1 or 2): ');

    if (choice === '1') {
      await createNewAgent();
    } else if (choice === '2') {
      await convertToAgent();
    } else {
      console.log('❌ Invalid choice');
    }

    rl.close();
    await mongoose.connection.close();
    console.log('\n✅ Done! Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    rl.close();
    await mongoose.connection.close();
    process.exit(1);
  }
}

async function createNewAgent() {
  console.log('\n📝 Creating new agent user...\n');

  const name = await question('Name: ');
  const email = await question('Email: ');
  const password = await question('Password: ');
  const license = await question('License Number (optional): ');
  const specialization = await question('Specialization (comma-separated, optional): ');

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    console.log('❌ User with this email already exists!');
    return;
  }

  // Create agent user
  const agentUser = await User.create({
    name,
    email,
    password, // Will be hashed by pre-save hook
    role: 'AGENT',
    agentDetails: {
      license: license || undefined,
      specialization: specialization ? specialization.split(',').map(s => s.trim()) : [],
      clients: [],
    },
  });

  console.log('\n✅ Agent user created successfully!');
  console.log('📧 Email:', agentUser.email);
  console.log('👤 Name:', agentUser.name);
  console.log('🎫 Role:', agentUser.role);
  console.log('\n🔐 Login credentials:');
  console.log('   Email:', email);
  console.log('   Password:', password);
  console.log('\n🌐 Login at: http://localhost:5173/login');
}

async function convertToAgent() {
  console.log('\n🔄 Converting existing user to agent...\n');

  const email = await question('User email: ');

  // Find user
  const user = await User.findOne({ email });
  if (!user) {
    console.log('❌ User not found!');
    return;
  }

  if (user.role === 'AGENT') {
    console.log('ℹ️  User is already an agent!');
    return;
  }

  const license = await question('License Number (optional): ');
  const specialization = await question('Specialization (comma-separated, optional): ');

  // Update user
  user.role = 'AGENT';
  user.agentDetails = {
    license: license || undefined,
    specialization: specialization ? specialization.split(',').map(s => s.trim()) : [],
    clients: [],
  };
  await user.save();

  console.log('\n✅ User converted to agent successfully!');
  console.log('📧 Email:', user.email);
  console.log('👤 Name:', user.name);
  console.log('🎫 Role:', user.role);
  console.log('\n🌐 Login at: http://localhost:5173/login');
}

// Run the script
createAgentUser();

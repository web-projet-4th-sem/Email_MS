const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  const email = 'lecturer@gmail.com';
  const plainPassword = '123456'; // 🔐 use this to login
  const role = 'lecturer';

  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const user = new User({ email, password: hashedPassword, role });

  await user.save();
  console.log('✅ Test user created:', user);

  mongoose.disconnect();
}

seed().catch(err => {
  console.error('❌ Error seeding user:', err);
  mongoose.disconnect();
});

const bcrypt = require('bcryptjs');
const User = require('../models/User');

const seedAdmin = async () => {
  try {
    const email = process.env.ADMIN_EMAIL || 'banana@email.com';
    const password = process.env.ADMIN_PASSWORD || 'minions';
    const name = process.env.ADMIN_NAME || 'Banana Admin';

    let admin = await User.findOne({ email });
    if (admin) {
      const passwordMatch = await bcrypt.compare(password, admin.password);
      if (admin.role !== 'admin' || !passwordMatch) {
        admin.role = 'admin';
        admin.password = await bcrypt.hash(password, 12);
        admin.name = name;
        await admin.save();
        console.log('Admin credentials seeded or updated:', email);
      } else {
        console.log('Admin user already exists:', email);
      }
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await User.create({ name, email, password: hashedPassword, role: 'admin' });
    console.log('Admin user seeded:', email);
  } catch (error) {
    console.error('Admin seed failed:', error.message);
  }
};

module.exports = seedAdmin;

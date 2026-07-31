// One-off script — creates the first super_admin AdminUser account.
// Run once from your project root:
//   node create-admin.cjs
//
// Prints a temporary password to the terminal. Since the AdminUser model
// defaults mustChangePassword: true, your existing /api/cms/complete-profile
// flow will prompt for a permanent password on first login.

const crypto = require('crypto');
const db = require('./models');

const EMAIL = 'admin@scalelinkalliance.com';

// Generates a random temporary password — printed once below, not stored anywhere.
const generateTempPassword = () => {
  return crypto.randomBytes(9).toString('base64').replace(/[+/=]/g, '').slice(0, 12) + '!1';
};

(async () => {
  try {
    const existing = await db.AdminUser.findOne({ where: { email: EMAIL } });
    if (existing) {
      console.log(`⚠️  An AdminUser with email "${EMAIL}" already exists (id=${existing.id}, role=${existing.role}).`);
      console.log('   Refusing to create a duplicate. If you need to reset this account instead, say so and a reset script can be written.');
      process.exit(1);
    }

    const tempPassword = generateTempPassword();

    const user = await db.AdminUser.create({
      email: EMAIL,
      passwordHash: tempPassword, // beforeCreate hook in models/AdminUser.js hashes this automatically
      role: 'super_admin',
      isVerified: true,           // skip email verification for this first bootstrap account
      isActive: true,
      mustChangePassword: true,   // forces your existing complete-profile flow on first login
      isProfileComplete: false
    });

    console.log('✅ Super admin account created successfully.');
    console.log('');
    console.log(`   Email:            ${user.email}`);
    console.log(`   Temporary password: ${tempPassword}`);
    console.log('');
    console.log('   Log in with these credentials, then your app will prompt you to set a permanent password and complete your profile.');
    console.log('   This temporary password is shown only here — it is not stored in plaintext anywhere.');
  } catch (err) {
    console.error('❌ Failed to create admin user:', err.message);
    process.exit(1);
  } finally {
    process.exit(0);
  }
})();

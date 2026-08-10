// One-off script — sets a permanent password on an existing AdminUser account.
// Run once from your project root:
//   node set-permanent-password.cjs

const db = require('./models');

const EMAIL = 'admin@scalelinkalliance.com';
const NEW_PASSWORD = 'Admin@may';

(async () => {
  try {
    const user = await db.AdminUser.findOne({ where: { email: EMAIL } });
    if (!user) {
      console.log(`❌ No AdminUser found with email: "${EMAIL}"`);
      process.exit(1);
    }

    // Assign to passwordHash and use .save() (not .update()) so the model's
    // beforeUpdate hook fires and hashes it — same pattern as change-password
    // and complete-profile routes in routes/cms.js.
    user.passwordHash = NEW_PASSWORD;
    user.mustChangePassword = false;
    await user.save();

    console.log('✅ Permanent password set successfully.');
    console.log(`   Email: ${user.email}`);
    console.log('   mustChangePassword is now false — no forced change on next login.');
  } catch (err) {
    console.error('❌ Failed to set password:', err.message);
    process.exit(1);
  } finally {
    process.exit(0);
  }
})();

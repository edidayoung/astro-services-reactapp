// Password Hash Generator Script
// Run this to generate a bcrypt hash for your admin password
// Usage: node --loader ts-node/esm src/lib/admin/generate-password.ts

import bcrypt from 'bcryptjs';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('\n🔐 Admin Password Hash Generator\n');
console.log('This will generate a bcrypt hash for your admin password.');
console.log('Store the hash in your .env file as VITE_ADMIN_PASSWORD_HASH\n');

rl.question('Enter your admin password: ', async (password) => {
  if (!password || password.length < 8) {
    console.error('❌ Password must be at least 8 characters long');
    rl.close();
    process.exit(1);
  }

  try {
    console.log('\n⏳ Generating hash (this may take a few seconds)...\n');
    
    // Generate hash with salt rounds = 12 (good balance of security and speed)
    const hash = await bcrypt.hash(password, 12);
    
    console.log('✅ Hash generated successfully!\n');
    console.log('Add this to your .env file:\n');
    console.log(`VITE_ADMIN_PASSWORD_HASH="${hash}"\n`);
    console.log('⚠️  Keep this hash secret! Do not commit it to version control.\n');
    
    // Test the hash
    const isValid = await bcrypt.compare(password, hash);
    if (isValid) {
      console.log('✅ Hash verified - it works correctly!\n');
    } else {
      console.log('❌ Hash verification failed - something went wrong\n');
    }
  } catch (error) {
    console.error('❌ Error generating hash:', error);
  }

  rl.close();
});

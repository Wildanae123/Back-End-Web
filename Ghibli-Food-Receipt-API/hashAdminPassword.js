// hashAdminPassword.js
const bcrypt = require('bcryptjs');

const plaintextPassword = 'admin123'; // The password you want to hash
const saltRounds = 10; // Same as in your authController

bcrypt.hash(plaintextPassword, saltRounds, function(err, hashedPassword) {
  if (err) {
    console.error('Error hashing password:', err);
    return;
  }
  console.log('Plaintext Password:', plaintextPassword);
  console.log('Hashed Password for DB:', hashedPassword);
  console.log('---');
  console.log('Copy the "Hashed Password for DB" value for the SQL INSERT statement.');
});
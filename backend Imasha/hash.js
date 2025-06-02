const bcrypt = require('bcryptjs');

async function hashPassword() {
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash("654321", salt);  // change password here
  console.log("Hashed password:", hashed);
}

hashPassword();

const fs = require('fs');

try {
  const files = fs.readdirSync('.'); // '.' refers to the current directory
  console.log('Files in the current directory:', files);
} catch (err) {
  console.error('Error reading directory:', err);
}

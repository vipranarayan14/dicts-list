const fs = require('fs');

try {
  const files = fs.readdirSync('./indic-dicts-index');
  console.log('Files in the current directory:', files);
} catch (err) {
  console.error('Error reading directory:', err);
}

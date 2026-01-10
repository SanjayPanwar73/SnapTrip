const sharp = require('sharp');

sharp({
  create: {
    width: 32,
    height: 32,
    channels: 4,
    // background: 'white',
    // colore: '#e74c3c'
  }
}).toFormat('ico').toFile('public/favicon.ico');
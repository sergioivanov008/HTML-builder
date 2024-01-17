const fs = require('fs');
const path = require('path');

const curFile = 'text.txt';
const stream = fs.createReadStream(path.join(__dirname, curFile), 'utf-8');

let curData = '';

stream.on('data', (partData) => (curData += partData));
stream.on('end', () => process.stdout.write(curData));
stream.on('error', (error) => console.log('Error', error.message));

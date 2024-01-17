const fs = require('fs');
const path = require('path');

const fileName = 'text.txt';
const stdout = process.stdout;
const stdin = process.stdin;

const curFile = path.join(__dirname, fileName);

stdout.write('Hello! Write something (exit - for exit):\n');

fs.access(curFile, function (error) {
  if (error) {
    fs.writeFile(curFile, '', (error) => {
      if (error) return console.error(error.message);
    });
  }
});

stdin.on('data', (data) => {
  let curData = data.toString();
  if (curData.trim() === 'exit') {
    process.exit();
  } else {
    addText(data);
  }
});

process.on('SIGINT', process.exit);

process.on('exit', () => {
  stdout.write('Good Bye!');
  process.exit();
});

function addText(newData) {
  fs.readFile(curFile, (error, data) => {
    if (error) return console.error(error.message);
    const dataPrev = (data += newData);
    fs.writeFile(curFile, dataPrev, (error) => {
      if (error) return console.error(error.message);
    });
  });
}

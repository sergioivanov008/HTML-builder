const fs = require('fs/promises');
const path = require('path');

const folderName = 'secret-folder';
const CONVERT_TO_KB = 1024;

async function getInfo() {
  const curFolder = path.join(__dirname, folderName);
  const files = await fs.readdir(curFolder, { withFileTypes: true });
  for (let file of files) {
    if (file.isFile()) {
      const curFile = path.join(curFolder, file.name);
      const curFileExt = path.extname(curFile);
      const curFileName = path.basename(curFile, curFileExt);
      const curFileSize = `${(await fs.stat(curFile)).size / CONVERT_TO_KB} Kb`;
      console.log(`${curFileName} - ${curFileExt.slice(1)} - ${curFileSize}`);
    }
  }
}

getInfo();

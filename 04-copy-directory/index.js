const fs = require('fs/promises');
const path = require('path');

const folderName = 'files';

const curFolder = path.join(__dirname, folderName);
const copyFolder = path.join(__dirname, `${folderName}-copy`);

async function removeDir(copyFolder) {
  await fs.rm(copyFolder, { recursive: true, force: true });
}

async function recCopyFiles(curFolder, copyFolder) {
  await fs.mkdir(copyFolder, { recursive: true });
  const files = await fs.readdir(curFolder, { withFileTypes: true });
  for (let file of files) {
    const curFile = path.join(curFolder, file.name);
    const copyFile = path.join(copyFolder, file.name);
    if (file.isFile()) {
      await fs.copyFile(curFile, copyFile);
    } else {
      await recCopyFiles(curFile, copyFile);
    }
  }
}

async function copyDir(curFolder, copyFolder) {
  await removeDir(copyFolder);
  await recCopyFiles(curFolder, copyFolder);
}

copyDir(curFolder, copyFolder);

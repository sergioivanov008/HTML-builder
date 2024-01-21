const fs = require('fs/promises');
const path = require('path');

const finishCssFileName = 'bundle.css';
const finishCssFolderName = 'project-dist';
const curCssFolderName = 'styles';
const CSS_EXTENSION = '.css';

const finishCssFile = path.join(
  __dirname,
  finishCssFolderName,
  finishCssFileName,
);
const curCssFolder = path.join(__dirname, curCssFolderName);

async function removeFinishCssFile(finishCssFile) {
  await fs.rm(finishCssFile, { recursive: true, force: true });
}

async function createFinishCssFile(finishCssFile) {
  await fs.writeFile(finishCssFile, '', (error) => {
    if (error) return console.error(error.message);
  });
}

async function addCssData(finishCssFile, curFile) {
  const prevData = (await fs.readFile(finishCssFile, 'utf-8')).trim();
  const curData = (await fs.readFile(curFile, 'utf-8')).trim();
  const fullData = `${prevData}\n\n${curData}`;
  await fs.writeFile(finishCssFile, fullData, 'utf-8');
}

async function copyCssFiles(finishCssFile, curCssFolder) {
  const curCssFiles = await fs.readdir(curCssFolder, { withFileTypes: true });
  for (let file of curCssFiles) {
    const curFile = path.join(curCssFolder, file.name);
    const curFileExt = path.extname(curFile);
    if (file.isFile() && curFileExt === CSS_EXTENSION) {
      await addCssData(finishCssFile, curFile);
    }
  }
}

async function mergeStyles(finishCssFile, curCssFolder) {
  await removeFinishCssFile(finishCssFile);
  await createFinishCssFile(finishCssFile);
  await copyCssFiles(finishCssFile, curCssFolder);
}

mergeStyles(finishCssFile, curCssFolder);

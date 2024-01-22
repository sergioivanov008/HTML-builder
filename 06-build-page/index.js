const fs = require('fs/promises');
const path = require('path');

const finishFolderName = 'project-dist';
const finishHtmlFileName = 'index.html';
const finishCssFileName = 'style.css';

const curIndexHtmlFileName = 'template.html';
const curCssFolderName = 'styles';
const curAssetsFolderName = 'assets';
const curComponentsFolderName = 'components';

const finishFolder = path.join(__dirname, finishFolderName);
const finishHtmlFile = path.join(
  __dirname,
  finishFolderName,
  finishHtmlFileName,
);
const finishCssFile = path.join(__dirname, finishFolderName, finishCssFileName);
const finishAssetsFolder = path.join(
  __dirname,
  finishFolderName,
  curAssetsFolderName,
);

const curIndexHtmlFile = path.join(__dirname, curIndexHtmlFileName);
const curCssFolder = path.join(__dirname, curCssFolderName);
const curAssetsFolder = path.join(__dirname, curAssetsFolderName);
const curComponentsFolder = path.join(__dirname, curComponentsFolderName);

const CSS_EXTENSION = '.css';
const HTML_EXTENSION = '.html';

async function removeFinishFolder(finishFolder) {
  await fs.rm(finishFolder, { recursive: true, force: true });
}

async function createFinishFolder(finishFolder) {
  await fs.mkdir(finishFolder, { recursive: true });
}

async function createEmptyFinishHtmlFile(finishHtmlFile) {
  await fs.writeFile(finishHtmlFile, '', (error) => {
    if (error) return console.error(error.message);
  });
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

async function recCopyFiles(curAssetsFolder, finishAssetsFolder) {
  await fs.mkdir(finishAssetsFolder, { recursive: true });
  const files = await fs.readdir(curAssetsFolder, { withFileTypes: true });
  for (let file of files) {
    const curFile = path.join(curAssetsFolder, file.name);
    const copyFile = path.join(finishAssetsFolder, file.name);
    if (file.isFile()) {
      await fs.copyFile(curFile, copyFile);
    } else {
      await recCopyFiles(curFile, copyFile);
    }
  }
}

async function createFinishHtmlFile(
  curIndexHtmlFile,
  curComponentsFolder,
  finishHtmlFile,
) {
  const inputData = (await fs.readFile(curIndexHtmlFile, 'utf-8')).trim();
  let finishData = inputData;
  const arrComponents = inputData.match(/({{.*}})/g);
  const arrNamesComponents = arrComponents.map((el) => [
    el,
    `${el.slice(2, el.length - 2).trim()}${HTML_EXTENSION}`,
  ]);

  for await (let item of arrNamesComponents) {
    try {
      const res = (
        await fs.readFile(path.join(curComponentsFolder, item[1]), 'utf-8')
      ).trim();
      if (res) {
        item.push(res);
        finishData = finishData.replace(item[0], item[2]);
      }
    } catch {
      console.error(
        `Component ${item[1]} does not exist in ${curComponentsFolder}`,
      );
    }
  }

  await fs.writeFile(finishHtmlFile, finishData, 'utf-8');
}

async function buildPage() {
  await removeFinishFolder(finishFolder);
  await createFinishFolder(finishFolder);
  await createEmptyFinishHtmlFile(finishHtmlFile);
  await createFinishCssFile(finishCssFile);
  await copyCssFiles(finishCssFile, curCssFolder);
  await recCopyFiles(curAssetsFolder, finishAssetsFolder);
  await createFinishHtmlFile(
    curIndexHtmlFile,
    curComponentsFolder,
    finishHtmlFile,
  );
}

buildPage();

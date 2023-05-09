const path = require('path');
const fs = require('fs-extra');

const copyRecursively = (sourceFolder, targetFolder) => {
  fs.readdirSync(sourceFolder, {withFileTypes: true}).forEach(dirEnt => {
    const sourcePath = path.join(sourceFolder, dirEnt.name);
    const targetPath = path.join(targetFolder, dirEnt.name);

    if (dirEnt.isDirectory()) {
      if (fs.existsSync(targetPath)) {
        copyRecursively(sourcePath, targetPath);
      }
    } else if (dirEnt.isFile()) {
      if (fs.existsSync(targetPath)) {
        fs.copyFileSync(sourcePath, targetPath);
      }
    }
  });
};

const patch = () => {
  const sourceFolder = path.resolve(__dirname, 'patch');
  const nodeModulesFolder = path.resolve(__dirname, 'node_modules');

  copyRecursively(sourceFolder, nodeModulesFolder);
};

patch();

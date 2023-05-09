const path = require('path');
const fs = require('fs-extra');

// Get the source path from the command-line arguments
const sourcePath = process.argv[2];

if (!sourcePath) {
  console.log('Please specify a path to the file to be replaced. Ex:');
  console.log(
    '  yarn toPatch node_modules/react-native/ReactAndroid/gradle.properties',
  );
  process.exit(1);
}
const targetBasePath = __dirname;

const relativePath = path.relative(
  path.join(__dirname, 'node_modules'),
  sourcePath,
);
const targetPath = path.join(targetBasePath, 'patch', relativePath);

fs.ensureDir(path.dirname(targetPath));

// Copy the file
fs.copySync(sourcePath, targetPath);

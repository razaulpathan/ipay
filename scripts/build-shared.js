const { execSync } = require('child_process');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
console.log('Building @ipay/shared package from monorepo root:', rootDir);

try {
  execSync('npm --prefix packages/shared run build', {
    cwd: rootDir,
    stdio: 'inherit',
  });
  console.log('Successfully built @ipay/shared!');
} catch (error) {
  console.error('Failed to build @ipay/shared:', error.message);
  process.exit(1);
}

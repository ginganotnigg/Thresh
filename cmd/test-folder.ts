import { config } from 'dotenv';
config();
import { execSync } from 'child_process';

const testDir = process.env.TEST_DIR;

if (testDir == null) {
	console.log('Please provide a test directory to run tests in: TEST_DIR=tests/folder');
	process.exit(1);
}

console.log('Running tests in folder: ' + testDir);
execSync(`npx jest ${testDir}`, { stdio: 'inherit' });
console.log('Tests completed');
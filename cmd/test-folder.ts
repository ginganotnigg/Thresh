import { execSync } from 'child_process';
import { env } from '../src/utils/env';

const testDir = env.testDir;

if (testDir == null) {
	console.log('Please provide a test directory to run tests in: TEST_DIR=tests/folder');
	process.exit(1);
}

try {
	console.log('Running tests in folder: ' + testDir);
	execSync(`npx jest ${testDir}`, { stdio: 'inherit' });
	console.log('Tests completed');
} catch (e) {
	console.error('Tests failed');
	process.exit(1);
}

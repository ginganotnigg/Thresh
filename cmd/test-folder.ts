import { config } from 'dotenv';

process.env.NODE_ENV = process.env.NODE_ENV || 'test';

config({
	path: [
		`${__dirname}/../.env`,
		`${__dirname}/../.env.${process.env.NODE_ENV}`,
	],
	override: true,
});
import { execSync } from 'child_process';

const testDir = process.env.TEST_DIR;

if (testDir == null) {
	console.log('Please provide a test directory to run tests in: TEST_DIR=tests/folder');
	process.exit(1);
}

try {
	console.log('Running tests in folder: ' + testDir);
	execSync(`npx jest ${testDir}`, { stdio: 'inherit' });
	console.log('Tests completed');
} catch (e) {
	console.error('Tests failed with error:');
	console.error(e);
	process.exit(1);
}

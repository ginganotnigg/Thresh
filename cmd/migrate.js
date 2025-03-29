import { execSync } from 'child_process';

try {
	console.log('Checking database existence...');
	execSync('npx sequelize-cli db:create', { stdio: 'inherit' });
	console.log('Database is ready.');

	console.log('Running migrations...');
	execSync('npx sequelize-cli db:migrate', { stdio: 'inherit' });
	console.log('Migrations applied.');
} catch (error) {
	console.error('Error during migrating:', error);
	process.exit(1);
}

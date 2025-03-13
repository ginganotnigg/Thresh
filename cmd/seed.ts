import { execSync } from 'child_process';
import { seed } from '../src/__init__/seed';

try {
	console.log('Dropping database...');
	execSync('npx sequelize-cli db:drop', { stdio: 'inherit' });
	console.log('Database dropped.');

	console.log('Create database...');
	execSync('npx sequelize-cli db:create', { stdio: 'inherit' });
	console.log('Database is ready.');

	console.log('Running migrations...');
	execSync('npx sequelize-cli db:migrate', { stdio: 'inherit' });
	console.log('Migrations applied.');

	console.log('Seeding (test) data ...');
	Promise.resolve(seed());
	console.log('Seeding completed.');
} catch (error) {
	console.error('Error during seeding:', error);
	process.exit(1);
}

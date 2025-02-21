const { execSync } = require('child_process');

try {
    console.log('Checking database existence...');
    execSync('npx sequelize-cli db:create', { stdio: 'inherit' });
    console.log('Database is ready.');

    console.log('Running migrations...');
    execSync('npx sequelize-cli db:migrate', { stdio: 'inherit' });
    console.log('Migrations applied.');

    console.log('Seeding data...');
    execSync('npx sequelize-cli db:seed:all', { stdio: 'inherit' });
    console.log('Seeding completed.');
} catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
}

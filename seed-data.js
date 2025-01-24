const { execSync } = require('child_process');

try {
    console.log('Seeding data...');

    // Chạy seed data
    console.log('Seeding database...');
    execSync('npx sequelize-cli db:seed:all', { stdio: 'inherit' });

    console.log('Seeding completed.');
} catch (error) {
    console.error('Error during seeding:', error.message);
    process.exit(1);
}

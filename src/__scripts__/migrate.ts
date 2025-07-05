import sequelize from "../configs/orm/sequelize/sequelize";

async function main() {
	await sequelize.sync({
		logging: true,
		force: false,
		alter: true,
	});
}

main()
	.then(() => {
		console.log("Database migrated successfully.");
	})
	.catch((error) => {
		console.error("Error migrating database:", error);
	});


import config from "./association";
import sequelize from "./database";

export default async function syncSequelize(mode?: "force" | "alter", reset: boolean = false) {
	const modeConfig =
		mode === "force"
			? { force: true }
			: mode === "alter"
				? { alter: true }
				: undefined;
	config(sequelize);
	try {
		await sequelize.sync({ ...modeConfig, logging: false });
		await sequelize.drop({ logging: false });

	} catch (err: any) {
		console.log("Sync failed: ", err);
	}
};
import sequelize from "../sequelize/database";

describe.skip('Sequelize Configuration', () => {
	beforeEach(() => {
	});

	afterEach(() => {
	});

	it('should establish a connection to the database', async () => {
		await expect(sequelize.authenticate()).resolves.not.toThrow();
		await expect(sequelize.close()).resolves.not.toThrow();
	});
});
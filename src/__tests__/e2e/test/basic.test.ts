import { main } from '../../../app/main';
import http from 'http';
import { requestWithCredentials } from '../helper/credentials-mock';
import { recreateDatabase } from '../../../configs/orm/database-operations';
import { postTestsData } from '../../data/post-test-data';

describe('Tests API Endpoints', () => {
	let app: http.Server;
	let createdTestIds: string[] = [];

	beforeAll(async () => {
		const { restServer } = await main();
		app = restServer;
	});

	afterAll(done => {
		app.close(async () => {
			console.log('Server closed');
			await recreateDatabase();
			done();
		});
	});

	it('CRUD operations', async () => {
		// POST /api/tests for each test data
		for (const testData of postTestsData) {
			const createResponse = await requestWithCredentials(app)
				.post('/api/tests')
				.send(testData)
				.expect(201);
			const id = createResponse.body.testId || createResponse.body.id;
			createdTestIds.push(id);
			expect(id).toBeDefined();
		}

		// GET /api/tests/:testId for each created test
		for (let i = 0; i < postTestsData.length; i++) {
			const testData = postTestsData[i];
			const id = createdTestIds[i];
			const getResponse = await requestWithCredentials(app)
				.get(`/api/tests/${id}`)
				.expect(200);
			expect(getResponse.body.id).toBe(id);
			expect(getResponse.body.title).toBe(testData.title);
		}

		// GET /api/tests
		const allTestsResponse = await requestWithCredentials(app)
			.get('/api/tests')
			.expect(200);
		expect(Array.isArray(allTestsResponse.body.data)).toBe(true);
		expect(allTestsResponse.body.data.length).toBeGreaterThan(0);

		// PUT /api/tests/:testId (update the first test)
		const id = createdTestIds[0];
		const updatedTest = { ...postTestsData[0], title: postTestsData[0].title + ' - Updated' };
		await requestWithCredentials(app)
			.put(`/api/tests/${id}`)
			.send(updatedTest)
			.expect(200);
		// Verify update
		const updatedResponse = await requestWithCredentials(app)
			.get(`/api/tests/${id}`)
			.expect(200);
		expect(updatedResponse.body.title).toBe(updatedTest.title);

		// DELETE /api/tests/:testId for all created tests
		for (const id of createdTestIds) {
			await requestWithCredentials(app)
				.delete(`/api/tests/${id}`)
				.expect(204);
		}
	});
});

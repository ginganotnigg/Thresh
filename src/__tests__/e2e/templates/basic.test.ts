import { main } from '../../../app/main';
import { postTemplates } from './data';
import http from 'http';
import { requestWithCredentials } from '../helper/credentials-mock';
import { recreateDatabase } from '../../../configs/orm/database-operations';

describe("Template API Endpoints", () => {
	let app: http.Server;
	let createdTemplateIds: string[] = [];

	beforeAll(async () => {
		const { restServer } = await main();
		app = restServer;
	});

	afterAll(done => {
		app.close(async () => {
			console.log("Server closed");
			await recreateDatabase();
			done();
		});
	});

	it("CRUD operations", async () => {
		// POST operation
		for (const template of postTemplates) {
			const createResponse = await requestWithCredentials(app)
				.post("/api/templates")
				.send(template)
				.expect(201);
			createdTemplateIds.push(createResponse.body.templateId);
			expect(createResponse.body).toHaveProperty("templateId");
		}

		// GET operation
		for (let i = 0; i < postTemplates.length; i++) {
			const template = postTemplates[i];
			const id = createdTemplateIds[i];
			const getResponse = await requestWithCredentials(app)
				.get(`/api/templates/${id}`)
				.expect(200);
			expect(getResponse.body.id).toBe(id);
			expect(getResponse.body.name).toBe(template.name);
		}

		// GET all operation
		const allTemplatesResponse = await requestWithCredentials(app)
			.get("/api/templates")
			.expect(200);
		expect(allTemplatesResponse.body.data.length).toBeGreaterThan(0);

		// PUT operation
		const template = postTemplates[0];
		const id = createdTemplateIds[0];
		const updatedTemplate = { ...template, title: `${template.title} - Updated` };
		await requestWithCredentials(app)
			.put(`/api/templates/${id}`)
			.send(updatedTemplate)
			.expect(200);
		// Verify the update
		const updatedResponse = await requestWithCredentials(app)
			.get(`/api/templates/${id}`)
			.expect(200);
		expect(updatedResponse.body.title).toBe(updatedTemplate.title);

		// DELETE operation
		for (const id of createdTemplateIds) {
			await requestWithCredentials(app)
				.delete(`/api/templates/${id}`)
				.expect(204);
		}
	});
});
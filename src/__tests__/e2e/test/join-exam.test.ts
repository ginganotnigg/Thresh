import http from "http";
import { main } from "../../../app/main";
import { recreateDatabase } from "../../../configs/orm/database-operations";
import { requestWithCredentials } from "../helper/credentials-mock";
import { postExamData } from "../../data/post-test-data";

describe("Join Exam API Endpoints", () => {
	let app: http.Server;
	let createdExamId: string;
	let foundExamResponse: any;

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

	it("should create an exam", async () => {
		if (postExamData.detail.mode !== "EXAM") {
			return;
		}
		const now = new Date();
		postExamData.detail.openDate = new Date(now.getTime() - 1000 * 60 * 60); // 1 hour before
		postExamData.detail.closeDate = new Date(now.getTime() + 1000 * 60 * 60); // 1 hour later

		const createExamResponse = await requestWithCredentials(app)
			.post("/api/tests")
			.send(postExamData)
			.expect(201);
		const examId = createExamResponse.body.testId;
		expect(examId).toBeDefined();
		createdExamId = examId;
	});

	it("should find the created exam", async () => {
		if (postExamData.detail.mode !== "EXAM") {
			return;
		}
		const findResponse = await requestWithCredentials(app)
			.get(`/api/tests/find-by-room`)
			.query({
				roomId: postExamData.detail.roomId,
			})
			.send()
			.expect(200);
		expect(findResponse.body.data).not.toBeNull();
		expect(findResponse.body.hasJoined).toBe(false);

		foundExamResponse = findResponse.body.data;
	});

	it("should join an exam", async () => {
		await requestWithCredentials(app)
			.post(`/api/tests/${foundExamResponse.id}/participants`)
			.send({
				password: "secret123",
			})
			.expect(201);
	});

	it("should list the participants of the exam", async () => {
		const participantsResponse = await requestWithCredentials(app)
			.get(`/api/tests/${foundExamResponse.id}/participants`)
			.query({
				page: 1,
				perPage: 10,
				sortByRank: "asc",
			})
			.expect(200);

		expect(participantsResponse.body.data).toBeDefined();
		expect(participantsResponse.body.data.length).toBeGreaterThan(0);
		expect(participantsResponse.body.data[0].candidateId).toEqual("1");
	});

	it("should start an attempt for the exam", async () => {
		const attemptId = await requestWithCredentials(app)
			.post(`/api/attempts`)
			.send({
				testId: foundExamResponse.id,
			})
			.expect(201);

		const answersResponse = await requestWithCredentials(app)
			.get(`/api/attempts/${attemptId.body.attemptId}/answers`)
			.expect(200);
	});
});
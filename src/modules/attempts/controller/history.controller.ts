import { z } from "zod";
import { PagedSchema } from "../../../controller/schemas/base";
import { CredentialsMetaSchema } from "../../../controller/schemas/meta";
import { Chuoi } from "../../../library/caychuoijs";
import { HistoryAttemptsRead } from "../usecase/history/history-attempts.read";
import { AttemptsOfCandidateQuerySchema, AttemptWithTestSchema } from "../schema/history.schema";

export function historyController() {
	const router = Chuoi.newRoute("/history");

	router.endpoint().get("/attempts")
		.schema({
			meta: CredentialsMetaSchema,
			query: AttemptsOfCandidateQuerySchema,
			response: PagedSchema(AttemptWithTestSchema),
		})
		.handle(async (data) => {
			return HistoryAttemptsRead.create(data.meta).getAttemptsWithTest(data.query);
		}).build({
			tags: ['History Attempt'],
		});

	router.endpoint().get("/attempts/:attemptId")
		.schema({
			meta: CredentialsMetaSchema,
			params: z.object({
				attemptId: z.string(),
			}),
			response: AttemptWithTestSchema,
		})
		.handle(async (data) => {
			return HistoryAttemptsRead.create(data.meta).getAttemptWithTest(data.params.attemptId);
		}).build({
			tags: ['History Attempt'],
		});

}
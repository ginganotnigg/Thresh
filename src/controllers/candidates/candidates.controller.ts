import { Chuoi } from "../../library/caychuoijs";
import { ControllerBase } from "../../shared/controller/controller.base";
import { CandidateIdParamsSchema } from "../../shared/schemas/params";
import { GetCandidateAttemptsQuerySchema } from "./uc_query/get-candidate-attempts/param";
import { GetCandidateAttemptsResponseSchema } from "./uc_query/get-candidate-attempts/response";
import { GetCandidateAttemptsHandler } from "./uc_query/get-candidate-attempts/handler";
import { CredentialsMetaSchema } from "../../shared/schemas/meta";

export class AnswersController extends ControllerBase {
	constructRouter(): void {
		const router = Chuoi.newRoute("/candidates");

		router.endpoint().get("/:candidateId/attempts")
			.schema({
				meta: CredentialsMetaSchema,
				params: CandidateIdParamsSchema,
				query: GetCandidateAttemptsQuerySchema,
				response: GetCandidateAttemptsResponseSchema,
			})
			.handle(async (data) => {
				return await new GetCandidateAttemptsHandler()
					.withCredentials(data.meta)
					.withId(data.params.candidateId)
					.handle(data.query);
			})
			.build({ tags: ["Candidates"] });
	}
}
import { Chuoi } from "../../library/caychuoijs";
import { ControllerBase } from "../../shared/controller/controller.base";
import { CandidateIdParamsSchema } from "../../shared/schemas/params";
import { PostCandidateBodySchema } from "./body.schema";
import { CandidatesQuerySchema } from "./query.schema";
import { CandidateQuerySchema } from "./uc_query/get-candidate-attempts/param";
import { CandidateResourceSchema, CandidatesResourceSchema } from "../../schemas/candidate/resource";

export class AnswersController extends ControllerBase {
	constructRouter(): void {
		const router = Chuoi.newRoute("/candidates");

		router.endpoint().get("/:candidateId/attempts")
			.schema({
				query: CandidatesQuerySchema,
				response: CandidatesResourceSchema,
			})
			.handle(async (data) => {
			})
			.build({ tags: ["Candidates"] });

		router.endpoint().get("/:candidateId")
			.schema({
				params: CandidateIdParamsSchema,
				query: CandidateQuerySchema,
				response: CandidateResourceSchema,
			})
			.handle(async (data) => {
			})
			.build({ tags: ["Candidates"] });

		router.endpoint().post()
			.schema({
				body: PostCandidateBodySchema,
			})
			.handle(async (data) => {
			})
			.build({ tags: ["Candidates"] });
	}
}
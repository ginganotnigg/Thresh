import { Chuoi } from "../../library/caychuoijs";
import { ControllerBase } from "../../shared/controller/controller.base";
import { QuestionsQuerySchema } from "./query.schema";
import { QuestionsResourceSchema } from "./resource.schema";

export class QuestionsController extends ControllerBase {
	constructRouter(): void {
		const router = Chuoi.newRoute("/questions");

		router.endpoint().get()
			.schema({
				query: QuestionsQuerySchema,
				response: QuestionsResourceSchema,
			})
			.handle(async (data) => {
			})
			.build({ tags: ["Questions"] });



	}
}
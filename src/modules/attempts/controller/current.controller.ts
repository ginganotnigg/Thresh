import { z } from "zod";
import { CredentialsMetaSchema } from "../../../controller/schemas/meta";
import { Chuoi } from "../../../library/caychuoijs";
import { AttemptWithTestSchema } from "../schema/history.schema";
import { CurrentAttemptRead } from "../usecase/current/current-attempt.read";
import { AnswerCoreSchema } from "../../../domain/schema/core.schema";
import { CurrentAttemptWrite } from "../usecase/current/current-attempt.write";

export function currentController() {
	const router = Chuoi.newRoute("/current");

	router.endpoint().get('/attempts/:attemptId')
		.schema({
			meta: CredentialsMetaSchema,
			params: z.object({
				attemptId: z.string(),
			}),
			response: AttemptWithTestSchema,
		})
		.handle(async (data) => {
			return (await CurrentAttemptRead.load(data.params.attemptId, data.meta)).getAttemptWithTest();
		}).build({
			tags: ['Current Attempt'],
		});

	router.endpoint().get('/tests/:testId')
		.schema({
			meta: CredentialsMetaSchema,
			params: z.object({
				testId: z.string(),
			}),
			response: AttemptWithTestSchema,
		})
		.handle(async (data) => {
			return (await CurrentAttemptRead.loadByTestId(data.params.testId, data.meta)).getAttemptWithTest();
		}).build({
			tags: ['Current Attempt'],
		});

	router.endpoint().get('/attempts/:attemptId/answers')
		.schema({
			meta: CredentialsMetaSchema,
			params: z.object({
				attemptId: z.string(),
			}),
			response: z.array(AnswerCoreSchema),
		})
		.handle(async (data) => {
			return (await CurrentAttemptRead.load(data.params.attemptId, data.meta)).getAnswers();
		}).build({
			tags: ['Current Attempt'],
		});

	router.endpoint().patch('/attempts/:attemptId/answers')
		.schema({
			meta: CredentialsMetaSchema,
			params: z.object({
				attemptId: z.string(),
			}),
			body: z.object({
				questionId: z.coerce.number(),
				chosenOption: z.coerce.number().optional(),
			}),
		})
		.handle(async (data) => {
			await (await CurrentAttemptWrite.load(data.params.attemptId, data.meta)).answerQuestion({
				questionId: data.body.questionId,
				chosenOption: data.body.chosenOption,
			});
		}).build({
			tags: ["Current Attempt"],
		});

	router.endpoint().patch('/attempts/:attemptId/submit')
		.schema({
			meta: CredentialsMetaSchema,
			params: z.object({
				attemptId: z.string(),
			}),
		})
		.handle(async (data) => {
			await (await CurrentAttemptWrite.load(data.params.attemptId, data.meta)).submit();
		}).build({
			tags: ["Current Attempt"],
		});
}
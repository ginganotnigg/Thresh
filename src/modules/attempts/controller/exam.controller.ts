import { z } from "zod";
import { PagedSchema } from "../../../controller/schemas/base";
import { AttemptIdParamsSchema } from "../../../controller/schemas/params";
import { AttemptInfoSchema } from "../../../domain/schema/info.schema";
import { Chuoi } from "../../../library/caychuoijs";
import { queryAttempt } from "../app/query/attempt";
import { queryAttempts } from "../app/query/attempts";
import { AttemptAggregateQuerySchema, AttemptAggregateResponseSchema } from "../schema";
import { AnswerCoreSchema } from "../../../domain/schema/core.schema";
import { queryAttemptAnswers } from "../app/query/attempt-answers";
import { queryAttemptAggregate } from "../app/query/attempt-aggregate";
import { CredentialsMetaSchema } from "../../../controller/schemas/meta";

export function historyController() {
	const router = Chuoi.newRoute("/exam");


	return router;
}
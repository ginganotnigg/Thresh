import { TestCoreSchema } from "../../../../schemas/core/test";

export const PostTestBodySchema = TestCoreSchema.omit({
	id: true,
	authorId: true,
}).extend({

});
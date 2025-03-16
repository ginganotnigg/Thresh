import { z } from "zod";
import { TagIdParamsSchema } from "../../common/controller/schemas/params";
import { Chuoi } from "../../library/caychuoijs";
import Tag from "../../models/tag";
import { DomainErrorResponse } from "../../common/controller/errors/domain.error";

const bodySchema = z.object({
	name: z.string().nonempty()
});

const responseSchema = z.object({
	id: z.number(),
	name: z.string()
});

export function tagsController() {
	const router = Chuoi.newRoute();

	router.endpoint().get("/tags")
		.schema({ response: z.array(responseSchema) })
		.handle(async data => {
			return (await Tag.findAll());
		}).build({ tags: ["Tags"] });

	router.endpoint().get("/tags/:tagId")
		.schema({
			params: TagIdParamsSchema,
			response: responseSchema,
		})
		.handle(async data => {
			return await Tag.findByPk(data.params.tagId);
		}).build({ tags: ["Tags"] });


	router.endpoint().post("/tags")
		.schema({
			body: bodySchema
		})
		.handle(async data => {
			return await Tag.create(data.body);
		}).build({ tags: ["Tags"] });

	router.endpoint().put("/tags/:tagId")
		.schema({
			params: TagIdParamsSchema,
			body: bodySchema
		})
		.handle(async data => {
			const tag = await Tag.findByPk(data.params.tagId);
			if (!tag) {
				throw new DomainErrorResponse("Tag not found");
			}
			return await tag.update(data.body);
		}).build({ tags: ["Tags"] });

	router.endpoint().delete("/tags/:tagId")
		.schema({
			params: TagIdParamsSchema
		})
		.handle(async data => {
			const tag = await Tag.findByPk(data.params.tagId);
			if (!tag) {
				throw new DomainErrorResponse("Tag not found");
			}
			return await tag.destroy();
		}).build({ tags: ["Tags"] });
}

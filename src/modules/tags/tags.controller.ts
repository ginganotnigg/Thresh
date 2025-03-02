import { z } from "zod";
import { TagIdParamsSchema } from "../../common/controller/schemas/params";
import { Chuoi } from "../../library/caychuoijs";
import Tag from "../../models/tag";

const bodySchema = z.object({
	name: z.string().nonempty()
});

export function tagsController() {
	const router = Chuoi.newRoute();

	router.endpoint().get("/tags")
		.handle(async data => {
			return await Tag.findAll();
		}).build({ tags: ["Tags"] });

	router.endpoint().get("/tags/:id")
		.schema({
			params: TagIdParamsSchema
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

	router.endpoint().put("/tags/:id")
		.schema({
			params: TagIdParamsSchema,
			body: bodySchema
		})
		.handle(async data => {
			const tag = await Tag.findByPk(data.params.tagId);
			if (!tag) {
				throw new Error("Tag not found");
			}
			return await tag.update(data.body);
		}).build();

	router.endpoint().delete("/tags/:id")
		.schema({
			params: TagIdParamsSchema
		})
		.handle(async data => {
			const tag = await Tag.findByPk(data.params.tagId);
			if (!tag) {
				throw new Error("Tag not found");
			}
			await tag.destroy();
			return { message: "Deleted" };
		}).build({ tags: ["Tags"] });
}

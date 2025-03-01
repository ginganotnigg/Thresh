import { Chuoi } from "../../library/caychuoijs";
import Tag from "../../models/tag";
import { TagIdParams } from "../../common/controller/schemas/params";

export function tagsController() {
	const router = Chuoi.newRoute();

	router.endpoint().get("/tags")
		.schema()
		.handle(async data => {
			return await Tag.findAll();
		}).build();

	router.endpoint().get("/tags/:id")
		.schema({
			params: TagIdParams
		})
		.handle(async data => {
			return await Tag.findByPk(data.params.tagId);
		}).build();


	router.endpoint().post("/tags")
		.schema({
			body: class {
				name: string;
			}
		})
		.handle(async data => {
			return await Tag.create(data.body);
		}).build();

	router.endpoint().put("/tags/:id")
		.schema({
			params: TagIdParams,
			body: class {
				name: string;
			}
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
			params: TagIdParams
		})
		.handle(async data => {
			const tag = await Tag.findByPk(data.params.tagId);
			if (!tag) {
				throw new Error("Tag not found");
			}
			await tag.destroy();
			return { message: "Deleted" };
		}).build();
}

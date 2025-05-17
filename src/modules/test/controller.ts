import { CredentialsMetaSchema } from "../../controller/schemas/meta";
import { TestIdParamsSchema } from "../../controller/schemas/params";
import { Chuoi } from "../../library/caychuoijs";
import { TestRead } from "./test.read";

export function testController() {
	const router = Chuoi.newRoute("/tests");

	router.endpoint().get("/:testId")
		.schema({
			meta: CredentialsMetaSchema,
			params: TestIdParamsSchema,
		})
		.handle(async data => {
			return (await TestRead.load(data.params.testId, data.meta)).getTest();
		})
		.build({ tags: ["Test"] });
}
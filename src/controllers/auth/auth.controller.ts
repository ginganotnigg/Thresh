import { isValid, z } from "zod";
import { Chuoi } from "../../library/caychuoijs";
import { ControllerBase } from "../../shared/controller/controller.base";
import { CredentialsMetaSchema } from "../../shared/controller/schemas/meta";

export class AuthController extends ControllerBase {
	async constructRouter(): Promise<void> {
		const router = Chuoi.newRoute("/auth");
		router.endpoint().post("/verify")
			.schema({
				meta: CredentialsMetaSchema,
				body: z.object({
					token: z.string(),
				}),
				response: z.object({
					isValid: z.boolean(),
					userId: z.string().nullish(),
					roleId: z.string().nullish(),
					message: z.string().nullish(),
				}),
			})
			.handle(async (data) => {
				const { token } = data.body;
				const userId = data.meta.userId;
				const roleId = data.meta.role;
				const isValid = userId != null && roleId != null;
				return {
					isValid,
					userId: isValid ? userId : null,
					roleId: isValid ? roleId : null,
					message: isValid ? "Token is valid" : "Invalid token",
				};
			})
			.build({ tags: ["Auth"] });
	}
}
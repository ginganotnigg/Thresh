import { ChuoiSecurityBase } from "../../library/caychuoijs/documentation/security";

export type SecurityScheme = "userId" | "roleId";

class SecurityDocument extends ChuoiSecurityBase<SecurityScheme> {
	constructor() {
		super({
			userId: {
				type: "apiKey",
				name: "userId",
				locationName: "x-user-id",
				in: "header",
				description: "User ID for authentication",
			},
			roleId: {
				type: "apiKey",
				name: "roleId",
				locationName: "x-role-id",
				in: "header",
				description: "Role ID for authentication",
			},
		})
	}
}

export const securityDocument = new SecurityDocument();
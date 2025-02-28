import { IsString, Validate } from "class-validator";
import { UnauthorizedErrorResponse } from "../errors/unauthorized.error";

export class UserIdMeta {
	@Validate((value: string) => {
		if (!value) {
			throw new UnauthorizedErrorResponse();
		}
		return true;
	})
	@IsString()
	userId: string;
}
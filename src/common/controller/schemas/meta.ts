import { IsString } from "class-validator";

export class UserIdMeta {
	@IsString()
	userId: string;
}
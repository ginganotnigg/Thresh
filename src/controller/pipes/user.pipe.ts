import { ChuoiPipeBase } from "../../library/caychuoijs/main/contracts";
import { ChuoiContainer } from "../../library/caychuoijs/utils/container";
import { Request } from "express";

export class UserPipe extends ChuoiPipeBase<{ userId: string }> {
	extract(req: Request): { userId: string } {
		const userId = req.headers['x-user-id'] as string;
		return { userId };
	}
}

ChuoiContainer.register(UserPipe);
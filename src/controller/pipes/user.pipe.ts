import { IChuoiHandler } from "../../library/caychuoijs/main/contracts";
import { ChuoiContainer } from "../../library/caychuoijs/utils/container";
import { ChuoiMeta } from "../../library/caychuoijs/utils/meta";
import { CallbackExpressHandler } from "../../library/caychuoijs/utils/type";

export class UserPipe implements IChuoiHandler {
	get handle(): CallbackExpressHandler {
		return (req, res, next) => {
			const userId = req.headers['x-user-id'];
			if (userId) {
				ChuoiMeta.assign(req, { userId });
			}
			next();
		}
	}
}

ChuoiContainer.register(UserPipe);
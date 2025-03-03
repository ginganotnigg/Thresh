import { IChuoiHandler } from "../../../library/caychuoijs/main/contracts";
import { CallbackExpressHandler } from "../../../library/caychuoijs/utils/type";
import { ChuoiMeta } from "../../../library/caychuoijs/utils/meta";
import { ChuoiContainer } from "../../../library/caychuoijs/utils/container";

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
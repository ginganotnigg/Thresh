import { IChuoiHandler } from "../../../library/caychuoijs/contracts";
import { CallbackExpressHandler } from "../../../library/caychuoijs/utils/type";
import { ChuoiMeta } from "../../../library/caychuoijs/utils/meta";

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
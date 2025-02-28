import { IChuoiHandler } from "../../../library/caychuoijs/contracts";
import { CallbackExpressHandler } from "../../../library/caychuoijs/utils/type";
import { ChuoiMeta } from "../../../library/caychuoijs/utils/meta";

export class UserPipeHandler implements IChuoiHandler {
	get handle(): CallbackExpressHandler {
		return (req, res, next) => {
			if (req.header('x-user-id') === undefined) {
				res.status(401).json({ message: 'Unauthorized' });
			}
			else {
				const userId = parseInt(req.header('x-user-id')!, 10);
				if (isNaN(userId)) {
					res.status(401).json({ message: 'Unauthorized' });
				}
				else {
					ChuoiMeta.assign(req, { userId });
					next();
				}
			}
		}
	}
}
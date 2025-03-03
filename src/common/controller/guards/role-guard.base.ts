import { IChuoiHandler } from "../../../library/caychuoijs/main/contracts";
import { CallbackExpressHandler } from "../../../library/caychuoijs/utils/type";
import { Role } from "./role";

export abstract class RoleGuardBaseHandler implements IChuoiHandler {
	constructor(
		private readonly role: Role
	) { }

	handle: CallbackExpressHandler = (req, res, next) => {
		if (process.env.NO_AUTH === 'true') {
			next();
		}
		else if (req.header('x-role-id') === undefined) {
			res.status(401).json({ message: 'Unauthorized' });
		}
		else if (isNaN(parseInt(req.header('x-role-id')!, 10))) {
			res.status(401).json({ message: 'Unauthorized' });
		}
		else if (parseInt(req.header('x-role-id')!, 10) !== this.role) {
			res.status(403).json({ message: 'Forbidden' });
		}
		else {
			next();
		}
	}
} 
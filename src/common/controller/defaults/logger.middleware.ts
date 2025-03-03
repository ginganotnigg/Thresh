import { logHttpRequest } from "../../../configs/logger/winston";
import { ChuoiContainer } from "../../../library/caychuoijs/utils/container";
import { IChuoiHandler } from "../../../library/caychuoijs/main/contracts";
import { CallbackExpressHandler } from "../../../library/caychuoijs/utils/type";

export class LoggerMiddleware implements IChuoiHandler {
	handle: CallbackExpressHandler = (req, res, next) => {
		logHttpRequest(`[${req.method}] ${req.url}`, { body: req.body, query: req.query, params: req.params });
		next();
	}
}

ChuoiContainer.register(LoggerMiddleware);
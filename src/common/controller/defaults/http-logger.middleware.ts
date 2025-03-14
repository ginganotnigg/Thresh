import { logHttpRequest, logHttpResponse } from "../../../configs/logger/winston";
import { ChuoiContainer } from "../../../library/caychuoijs/utils/container";
import { IChuoiHandler } from "../../../library/caychuoijs/main/contracts";
import { CallbackExpressHandler } from "../../../library/caychuoijs/utils/type";
import { nanoid } from "nanoid";
import { createNamespace } from "cls-hooked";
const requestNamespace = createNamespace("request");

export class LoggerMiddleware implements IChuoiHandler {
	handle: CallbackExpressHandler = (req, res, next) => {
		const requestId = nanoid(6);
		requestNamespace.run(() => {
			requestNamespace.set("requestId", requestId);
			logHttpRequest(`[${req.method}] ${req.url}`, { body: req.body, query: req.query, params: req.params });
			next();
		});
		const _originalJson = res.json;
		(res.send as any) = function (body: any) {
			logHttpResponse(`[${res.statusCode}] - [${res.statusMessage}] \n [${JSON.stringify(body)}]`, body);
			return _originalJson.apply(res, body);
		};
	}
}

const getRequestId = (): string => {
	return requestNamespace.get("requestId") || "unknown";
};

ChuoiContainer.register(LoggerMiddleware);

export { getRequestId };

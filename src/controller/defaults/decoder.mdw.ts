import { Request, Response, NextFunction } from "express";
import { IChuoiMiddleware } from "../../library/caychuoijs/main/contracts";
import { ChuoiMeta } from "../../library/caychuoijs/utils/meta";
import { ChuoiContainer } from "../../library/caychuoijs/utils/container";

export class DecoderMiddleware implements IChuoiMiddleware {
	handle(req: Request, res: Response, next: NextFunction): void {
		if (req.headers.authorization) {
			try {
				// Extract token from "Bearer <token>"
				const token = req.headers.authorization.split(' ')[1];
				if (token) {
					const payload = this._decodeJwtToken(token);
					ChuoiMeta.assign(req, { "userId": payload["user_id"] });
					ChuoiMeta.assign(req, { "role": payload["role"] });
				}
			} catch (error) {
				console.error('Failed to decode JWT token:', error);
			}
		}
		else {
			// If no authorization header, check for x-user-id header
			const userId = req.headers["x-user-id"];
			const roleId = req.headers["x-role-id"];
			ChuoiMeta.assign(req, { "userId": userId });
			ChuoiMeta.assign(req, { "role": roleId });
		}

		return next();
	}

	private _decodeJwtToken(token: string): any {
		const parts = token.split('.');
		if (parts.length !== 3) {
			throw new Error('Invalid JWT token format');
		}

		const payload = parts[1];
		const decoded = Buffer.from(payload, 'base64').toString('utf8');
		return JSON.parse(decoded);
	}
}

ChuoiContainer.register(DecoderMiddleware);
import { Request } from "express";
import { MetaRequest } from "./type";

export class ChuoiMeta {
	static retrive<TMeta extends Record<string, any>>(req: Request): TMeta | null {
		const parsed = req as MetaRequest<TMeta>;
		if (parsed == null || parsed.meta == null) {
			return null;
		}
		return parsed.meta as TMeta;
	}

	static assign<TMeta extends Record<string, any>>(req: Request, meta: TMeta): void {
		const parsed = req as MetaRequest<TMeta>;
		if (parsed == null || parsed.meta == null) {
			(req as MetaRequest<TMeta>).meta = meta;
		}
		else {
			parsed.meta = {
				...meta,
				...parsed.meta,
			};
		}
	}
}
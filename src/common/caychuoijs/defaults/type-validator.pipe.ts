// import { plainToClass } from "class-transformer";
// import { ChuoiPipeBase } from "../bases/handler.i";
// import { Constructor } from "../type";
// import { ValidationError } from "../../controller/errors/validation.error";
// import { validate } from "class-validator";
// import { Request } from "express";

// export class ChuoiValidatorPipe extends ChuoiPipeBase {
// 	async handlePipe(
// 		req: Request,
// 		paramsType: Constructor,
// 		queryType: Constructor,
// 		bodyType: Constructor,
// 		headersType: Constructor,
// 	): Promise<void> {
// 		await validateHelperObject(req.params, paramsType);
// 		await validateHelperObject(req.query, queryType);
// 		await validateHelperObject(req.body, bodyType);
// 		await validateHelperObject(req.headers, headersType);
// 	}
// }


// async function validateHelperObject<T extends object>(obj: any, type: new (...args: any[]) => T): Promise<T> {
// 	const parsedPlain = plainToClass(type, obj);
// 	const errors = await validate(parsedPlain);
// 	if (errors.length > 0) {
// 		throw new ValidationError(errors);
// 	}
// 	return parsedPlain;
// }

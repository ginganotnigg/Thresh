import { OpenApiGeneratorV31, OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { OpenAPIObjectConfigV31 } from "@asteasolutions/zod-to-openapi/dist/v3.1/openapi-generator";
import { RequestSchema } from "../utils/type";
import { z } from "zod";
import { ChuoiSecurityBase } from "./security";

function convertExpressPathToOpenAPI(path: string): string {
	return path.replace(/:([\w]+)/g, '{$1}');
}

export class ChuoiDocument {
	public static readonly documentRegistry = new OpenAPIRegistry();

	static generateV31<TScheme extends string>(security?: ChuoiSecurityBase<TScheme>, config?: Partial<Omit<OpenAPIObjectConfigV31, 'openapi'>>) {
		const _config: OpenAPIObjectConfigV31 = {
			...config,
			openapi: '3.1.0',
			info: {
				version: '1.0.0',
				title: 'My API',
				description: 'This is the API',
			},
		}

		if (security) {
			security.getSecuritySchemes().forEach(scheme => {
				this.documentRegistry.registerComponent(
					"securitySchemes",
					scheme.name,
					{
						type: scheme.type,
						name: scheme.locationName,
						in: scheme.in,
						description: scheme.description,
					}
				);
			});
		}
		return new OpenApiGeneratorV31(this.documentRegistry.definitions).generateDocument(_config);
	}

	static addEndpointDocumentation(
		path: string,
		method: "get" | "post" | "put" | "delete" | "patch" | "options" | "head" | "trace",
		schema?: RequestSchema<any, any, any, any, any>,
		successResponseSchema?: z.ZodTypeAny,
		summary?: string,
		description?: string,
		tags?: string[],
		securitySchemeKeys?: string[],
	) {
		this.documentRegistry.registerPath({
			path: convertExpressPathToOpenAPI(path),
			method,
			summary,
			description,
			security: schema ? securitySchemeKeys?.map(k => {
				return {
					[k]: []
				}
			}) : undefined,
			tags: tags || [],
			request: schema ? {
				params: schema.params,
				query: schema.query,
				body: schema.body ? {
					// Only supports json response for convention
					content: {
						"application/json": {
							schema: schema.body
						}
					},
					required: true
				} : undefined,
				headers: schema.headers,
			} : undefined,
			responses: successResponseSchema ? {
				"200": {
					description: "Success",
					content: {
						"application/json": {
							schema: successResponseSchema
						}
					}
				}
			} : {
				"200": {
					description: "Success"
				}
			}
		});
	}
}
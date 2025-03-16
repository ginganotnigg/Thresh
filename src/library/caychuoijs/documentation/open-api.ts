import { OpenApiGeneratorV31, OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { OpenAPIObjectConfigV31 } from "@asteasolutions/zod-to-openapi/dist/v3.1/openapi-generator";
import { RequestSchema } from "../utils/type";
import { z } from "zod";

// Function to transform Express paths to OpenAPI paths
function convertExpressPathToOpenAPI(path: string): string {
	return path.replace(/:([\w]+)/g, '{$1}');
}

export class ChuoiDocument {
	public static readonly documentRegistry = new OpenAPIRegistry();

	static generateV31(config?: Partial<Omit<OpenAPIObjectConfigV31, 'openapi'>>) {
		const _config: OpenAPIObjectConfigV31 = {
			...config,
			openapi: '3.1.0',
			info: {
				version: '1.0.0',
				title: 'My API',
				description: 'This is the API',
			},
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
	) {
		ChuoiDocument.documentRegistry.registerPath({
			path: convertExpressPathToOpenAPI(path),
			method,
			summary,
			description,
			tags: tags || [],
			request: schema ? {
				params: schema.params,
				query: schema.query,
				body: schema.body ? {
					// Only supports json response for convention
					description: "Request body",
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
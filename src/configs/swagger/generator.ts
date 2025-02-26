import { OpenAPIV3 } from "openapi-types";

export class SwaggerDocument {
	private static _paths: OpenAPIV3.PathsObject = {};

	static addPath(pattern: string, pathItem: OpenAPIV3.PathItemObject) {
		this._paths[pattern] = pathItem;
	}

	static addOperation(path: string, method: string, operation: OpenAPIV3.OperationObject) {
		const lowerCaseMethod = method.toLowerCase();
		if (lowerCaseMethod as keyof typeof OpenAPIV3.HttpMethods === undefined) {
			throw new Error(`Invalid HTTP method: ${lowerCaseMethod}`);
		}
		const enumMethod = OpenAPIV3.HttpMethods[lowerCaseMethod as keyof typeof OpenAPIV3.HttpMethods];
		let pathObject: OpenAPIV3.PathItemObject = {};
		if (this._paths[path]) {
			pathObject = this._paths[path];
		} else {
			this._paths[path] = pathObject;
		}
		pathObject[enumMethod] = operation;
	}

	static build(): OpenAPIV3.Document {
		return {
			// General Information
			openapi: '3.0.0',
			info: {
				title: 'Auto-generated API',
				version: '1.0.0',
				description: 'This is an auto-generated OpenAPI documentation',
			},
			// Paths
			paths: this._paths,
		};
	}
}

SwaggerDocument.addOperation('/test', 'get', {
	summary: 'Test endpoint',
	requestBody: {
		content: {
			'text/plain': {
				schema: {
					type: 'string',
				},
			},
			'application/json': {
				schema: {
					type: 'object',
					properties: {
						exampleField: { type: 'string' },
					},
				},
			},
		},
	},
	responses: {
		200: {
			description: 'Successful response',
			content: {
				'application/json': {
					schema: {
						type: 'object',
						properties: {
							message: { type: 'string' },
						},
					},
				},
			},
		},
	},
});
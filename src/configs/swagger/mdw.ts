import { Application } from 'express';
import swaggerUi from 'swagger-ui-express';
import { OpenAPIV3 } from 'openapi-types';

const generateSwaggerSpec = (app: Application): OpenAPIV3.Document => {
	const paths: OpenAPIV3.PathsObject = {};

	app._router.stack.forEach((middleware: any) => {
		if (middleware.route) {
			const route = middleware.route;
			const path = route.path;
			const methods = route.methods;

			if (!paths[path]) {
				paths[path] = {};
			}

			Object.keys(methods).forEach((method) => {
				(paths[path] as any)[method] = {
					summary: `Auto-generated ${method.toUpperCase()} ${path}`,
					requestBody: {
						content: {
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
				};
			});
		}
	});

	return {
		openapi: '3.0.0',
		info: {
			title: 'Auto-generated API',
			version: '1.0.0',
			description: 'This is an auto-generated OpenAPI documentation',
		},
		paths,
	};
};

const swaggerMiddleware = (app: Application) => {
	const swaggerSpec = generateSwaggerSpec(app);
	app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default swaggerMiddleware;

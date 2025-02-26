import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options: swaggerJsdoc.Options = {
	failOnErrors: true,
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Thresh API Documentation',
			version: '1.1.0',
			description: 'Express API with Swagger in TypeScript'
		},
		servers: [
			{
				url: 'http://localhost:' + process.env.PORT,
				description: 'Local server'
			}
		]
	},
	apis: ['./src/**/*.ts'],
};


export const setupSwagger = (app: Express): void => {
	const swaggerSpec = swaggerJsdoc(options);
	app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
	console.log(swaggerSpec);
	console.log('📄 Swagger Docs available at: /docs');
};

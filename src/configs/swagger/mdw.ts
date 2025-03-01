import { Application } from 'express';
import swaggerUi from 'swagger-ui-express';
import { ChuoiDocument } from '../../library/caychuoijs/documentation/open-api';

const swaggerMiddleware = (app: Application) => {
	const swaggerSpec = ChuoiDocument.generateV31({
		info: {
			title: "Thresh API",
			version: "1.1.0"
		},
	});
	app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default swaggerMiddleware;

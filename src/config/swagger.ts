import swaggerUi from 'swagger-ui-express';
import openapi from '../openapi.json';

export const swaggerConfig = {
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(openapi),
};
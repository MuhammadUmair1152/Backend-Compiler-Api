const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Backend Compiler API',
    description: 'API for compiling JavaScript code'
  },
  host: 'localhost:3000',
  schemes: ['http'],
  paths: {
    '/api/code/compile': {
      post: {
        description: 'Compiles JavaScript code and returns the result',
        consumes: ['text/plain'],
        produces: ['application/json'],
        parameters: [
          {
            name: 'code',
            in: 'body',
            description: 'The JavaScript code to compile',
            required: true,
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          200: {
            description: 'Compilation successful'
          },
          400: {
            description: 'Invalid code provided'
          },
          500: {
            description: 'Internal Server Error'
          }
        }
      }
    }
  }
};

const outputFile = './swagger-output.json';
const routes = ['./Routes/code.js'];

swaggerAutogen(outputFile, routes, doc);

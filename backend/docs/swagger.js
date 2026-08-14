const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'TARZZ Bijouterie API',
      version: '1.0.0',
      description: 'API REST admin pour la gestion de bijouterie (produits, categories, clients, commandes, dashboard).',
    },
    servers: [
      {
        url: 'http://localhost:3001/api',
        description: 'Local API server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', example: 'admin@hajtajeb.com' },
            password: { type: 'string', example: 'admin123' },
          },
        },
        Category: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
          },
        },
        Product: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            reference: { type: 'string' },
            purchasePrice: { type: 'number' },
            sellingPrice: { type: 'number' },
            stockQuantity: { type: 'number' },
          },
        },
        Client: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            phone: { type: 'string' },
            address: { type: 'string' },
          },
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerSpec };

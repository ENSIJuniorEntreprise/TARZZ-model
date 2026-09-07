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
    security: [{ bearerAuth: [] }],
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
            email: { type: 'string', example: 'admin@hajtayeb.com' },
            password: { type: 'string', example: '••••••••' },
          },
        },
        Category: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            parent: { type: 'string', nullable: true, description: 'ObjectId of the parent category' },
          },
        },
        Product: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            category: { type: 'string', description: 'ObjectId of the category' },
            imageUrl: { type: 'string', nullable: true },
            stock: { type: 'number', default: 20 },
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
        Fournisseur: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            nom: { type: 'string' },
            prenom: { type: 'string' },
            societe: { type: 'string' },
            phone: { type: 'string' },
            email: { type: 'string' },
            adresse: { type: 'string' },
          },
        },
        ClientOrderItem: {
          type: 'object',
          properties: {
            productName: { type: 'string' },
            productCategory: { type: 'string' },
            quantity: { type: 'number', default: 1 },
          },
        },
        ClientOrder: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            client: { type: 'string' },
            items: { type: 'array', items: { $ref: '#/components/schemas/ClientOrderItem' } },
            date: { type: 'string', format: 'date-time' },
            status: { type: 'string', enum: ['en_commande', 'en_cours', 'livre'] },
            remarque: { type: 'string' },
          },
        },
        FournisseurOrder: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            fournisseur: { type: 'string' },
            items: { type: 'array', items: { $ref: '#/components/schemas/ClientOrderItem' } },
            date: { type: 'string', format: 'date-time' },
            status: { type: 'string', enum: ['en_attente', 'confirme', 'recu'] },
            remarque: { type: 'string' },
          },
        },
        ApiError: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            details: { type: 'object', nullable: true },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerSpec };

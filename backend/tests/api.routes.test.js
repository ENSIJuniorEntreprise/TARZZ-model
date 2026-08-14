const request = require('supertest');

jest.mock('../services/auth.service', () => ({
  login: jest.fn(async ({ email }) => ({
    token: 'test-token',
    admin: { id: 'admin-id', email },
  })),
  seedDefaultAdmin: jest.fn(async () => ({})),
}));

jest.mock('../middlewares/auth.middleware', () => ({
  protect: (req, _res, next) => {
    req.user = { email: 'admin@hajtajeb.com', sub: 'admin-id' };
    next();
  },
}));

jest.mock('../services/category.service', () => ({
  listCategories: jest.fn(async () => ({ data: [{ _id: 'cat1', name: 'Bracelets' }], meta: { total: 1 } })),
  createCategory: jest.fn(async () => ({ _id: 'cat1', name: 'Bracelets' })),
  updateCategory: jest.fn(async () => ({ _id: 'cat1', name: 'Bracelets New' })),
  deleteCategory: jest.fn(async () => undefined),
}));

jest.mock('../services/product.service', () => ({
  listProducts: jest.fn(async () => ({
    data: [{ _id: 'prod1', name: 'Bracelet', reference: 'BR-1', stockQuantity: 5 }],
    meta: { total: 1 },
  })),
  createProduct: jest.fn(async () => ({ _id: 'prod1', name: 'Bracelet' })),
  updateProduct: jest.fn(async () => ({ _id: 'prod1', name: 'Bracelet Updated' })),
  deleteProduct: jest.fn(async () => undefined),
}));

jest.mock('../services/client.service', () => ({
  listClients: jest.fn(async () => ({ data: [{ _id: 'client1', firstName: 'Fatima', lastName: 'Zahra' }], meta: { total: 1 } })),
  getClientById: jest.fn(async () => ({ _id: 'client1', firstName: 'Fatima', lastName: 'Zahra' })),
  createClient: jest.fn(async () => ({ _id: 'client1', firstName: 'Fatima', lastName: 'Zahra' })),
  updateClient: jest.fn(async () => ({ _id: 'client1', firstName: 'Fatima', lastName: 'Zahra' })),
  deleteClient: jest.fn(async () => undefined),
}));

jest.mock('../services/dashboard.service', () => ({
  getDashboardStats: jest.fn(async () => ({
    totalStockValue: 1000,
    totalProducts: 1,
    totalClients: 1,
    lowStockProducts: [],
    ordersByStatus: { pending: 0, in_progress: 0, delivered: 1 },
  })),
}));

const app = require('../app');

describe('API route tests (mocked services)', () => {
  test('GET /health', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('POST /api/auth/login', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'admin@hajtajeb.com',
      password: 'admin123',
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toBe('test-token');
    expect(res.body.admin.email).toBe('admin@hajtajeb.com');
  });

  test('GET /api/auth/me', async () => {
    const res = await request(app).get('/api/auth/me').set('Authorization', 'Bearer x');
    expect(res.status).toBe(200);
    expect(res.body.email).toBe('admin@hajtajeb.com');
  });

  test('GET /api/categories', async () => {
    const res = await request(app).get('/api/categories').set('Authorization', 'Bearer x');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('POST /api/products', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', 'Bearer x')
      .send({
        name: 'Bracelet',
        reference: 'BR-100',
        purchasePrice: 100,
        sellingPrice: 150,
        stockQuantity: 5,
        category: '507f191e810c19729de860ea',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  test('GET /api/clients', async () => {
    const res = await request(app).get('/api/clients').set('Authorization', 'Bearer x');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('GET /api/dashboard', async () => {
    const res = await request(app).get('/api/dashboard').set('Authorization', 'Bearer x');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('totalStockValue');
  });
});

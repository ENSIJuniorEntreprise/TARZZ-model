const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod;
let app;
let adminToken;

const ADMIN_EMAIL = 'admin@hajtajeb.com';
const ADMIN_PASSWORD = 'Test-Password-1234';

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongod.getUri();
  process.env.JWT_SECRET = 'test-jwt-secret';
  process.env.ADMIN_EMAIL = ADMIN_EMAIL;
  process.env.ADMIN_PASSWORD = ADMIN_PASSWORD;
  process.env.NODE_ENV = 'development';

  app = require('../app');
  await mongoose.connect(process.env.MONGO_URI);

  const { seedDefaultAdmin } = require('../services/auth.service');
  await seedDefaultAdmin();

  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
  adminToken = res.body.token;
}, 60000);

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
});

const auth = req => req.set('Authorization', `Bearer ${adminToken}`);

describe('Health', () => {
  test('GET /health', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.db).toBe('connected');
  });
});

describe('Auth', () => {
  test('POST /api/auth/login succeeds with correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeTruthy();
    expect(res.body.admin.email).toBe(ADMIN_EMAIL);
  });

  test('POST /api/auth/login rejects wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: ADMIN_EMAIL, password: 'wrong-password' });
    expect(res.status).toBe(401);
  });

  test('POST /api/auth/login rejects malformed input', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'not-an-email', password: 'x' });
    expect(res.status).toBe(400);
  });

  test('GET /api/auth/me requires a token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  test('GET /api/auth/me returns the admin email with a valid token', async () => {
    const res = await auth(request(app).get('/api/auth/me'));
    expect(res.status).toBe(200);
    expect(res.body.email).toBe(ADMIN_EMAIL);
  });
});

describe('Categories', () => {
  let categoryId;

  test('POST /api/categories creates a category', async () => {
    const res = await auth(request(app).post('/api/categories')).send({ name: 'Bracelets' });
    expect(res.status).toBe(201);
    expect(res.body.data.name).toBe('Bracelets');
    categoryId = res.body.data._id;
  });

  test('GET /api/categories lists categories', async () => {
    const res = await auth(request(app).get('/api/categories'));
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.some(c => c._id === categoryId)).toBe(true);
  });

  test('GET /api/categories is paginated', async () => {
    const res = await auth(request(app).get('/api/categories?limit=1'));
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeLessThanOrEqual(1);
    expect(res.body.meta).toMatchObject({ limit: 1, page: 1 });
  });

  test('POST /api/categories rejects an empty name', async () => {
    const res = await auth(request(app).post('/api/categories')).send({ name: '' });
    expect(res.status).toBe(400);
  });
});

describe('Products', () => {
  let categoryId;
  let productId;

  beforeAll(async () => {
    const res = await auth(request(app).post('/api/categories')).send({ name: 'Colliers' });
    categoryId = res.body.data._id;
  });

  test('POST /api/products creates a product against the real schema', async () => {
    const res = await auth(request(app).post('/api/products')).send({ name: 'Collier Or', category: categoryId, stock: 5 });
    expect(res.status).toBe(201);
    expect(res.body.data.name).toBe('Collier Or');
    expect(res.body.data.stock).toBe(5);
    productId = res.body.data._id;
  });

  test('GET /api/products is paginated', async () => {
    const res = await auth(request(app).get('/api/products?limit=1'));
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeLessThanOrEqual(1);
    expect(res.body.meta).toMatchObject({ limit: 1, page: 1 });
    expect(res.body.meta.total).toBeGreaterThanOrEqual(1);
  });

  test('GET /api/products lists products', async () => {
    const res = await auth(request(app).get('/api/products'));
    expect(res.status).toBe(200);
    expect(res.body.data.some(p => p._id === productId)).toBe(true);
  });

  test('GET /api/products?category=<validId> filters correctly', async () => {
    const res = await auth(request(app).get(`/api/products?category=${categoryId}`));
    expect(res.status).toBe(200);
    expect(res.body.data.every(p => p.category?._id === categoryId || p.category === categoryId)).toBe(true);
  });

  test('GET /api/products rejects a NoSQL injection attempt on category', async () => {
    const res = await auth(request(app).get('/api/products?category[$ne]=null'));
    expect(res.status).toBe(400);
  });
});

describe('Clients', () => {
  let clientId;

  test('POST /api/clients creates a client', async () => {
    const res = await auth(request(app).post('/api/clients')).send({ firstName: 'Fatima', lastName: 'Zahra', phone: '12345678' });
    expect(res.status).toBe(201);
    clientId = res.body.data._id;
  });

  test('GET /api/clients lists clients', async () => {
    const res = await auth(request(app).get('/api/clients'));
    expect(res.status).toBe(200);
    expect(res.body.data.some(c => c._id === clientId)).toBe(true);
  });

  test('GET /api/clients/:id returns 404 for an unknown id', async () => {
    const res = await auth(request(app).get('/api/clients/507f1f77bcf86cd799439011'));
    expect(res.status).toBe(404);
  });

  describe('Client orders (real flow used by the frontend)', () => {
    let orderId;

    test('POST /api/clients/:id/orders creates an order', async () => {
      const res = await auth(request(app).post(`/api/clients/${clientId}/orders`)).send({
        items: [{ productName: 'Bracelet perle', productCategory: 'Bracelets', quantity: 2 }],
      });
      expect(res.status).toBe(201);
      expect(res.body.data.status).toBe('en_commande');
      orderId = res.body.data._id;
    });

    test('GET /api/clients/:id/orders lists the order', async () => {
      const res = await auth(request(app).get(`/api/clients/${clientId}/orders`));
      expect(res.status).toBe(200);
      expect(res.body.data.some(o => o._id === orderId)).toBe(true);
    });

    test('PUT /api/client-orders/:id updates the status', async () => {
      const res = await auth(request(app).put(`/api/client-orders/${orderId}`)).send({ status: 'en_cours' });
      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('en_cours');
    });

    test('PUT /api/client-orders/:id rejects an invalid status', async () => {
      const res = await auth(request(app).put(`/api/client-orders/${orderId}`)).send({ status: 'not_a_status' });
      expect(res.status).toBe(400);
    });

    test('DELETE /api/client-orders/:id removes the order', async () => {
      const res = await auth(request(app).delete(`/api/client-orders/${orderId}`));
      expect(res.status).toBe(200);
    });

    test('deleting the client no longer throws (Order dependency removed)', async () => {
      const res = await auth(request(app).delete(`/api/clients/${clientId}`));
      expect(res.status).toBe(200);
    });
  });
});

describe('Dashboard', () => {
  test('GET /api/dashboard returns stats', async () => {
    const res = await auth(request(app).get('/api/dashboard'));
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('totalClients');
    expect(res.body.data).toHaveProperty('monthlyStats');
    expect(res.body.data).toHaveProperty('recentPurchases');
  });

  test('GET /api/dashboard/search returns without crashing', async () => {
    const res = await auth(request(app).get('/api/dashboard/search?q=test'));
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('products');
    expect(res.body.data).toHaveProperty('clients');
  });
});

describe('/api/orders no longer exists', () => {
  test('POST /api/orders returns 404', async () => {
    const res = await auth(request(app).post('/api/orders')).send({});
    expect(res.status).toBe(404);
  });
});

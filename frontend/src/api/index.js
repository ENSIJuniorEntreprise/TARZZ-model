const BASE = '/api';

function getToken() {
  return localStorage.getItem('haj_token');
}

async function req(method, url, body, isFormData = false) {
  const headers = {};
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (body && !isFormData) headers['Content-Type'] = 'application/json';

  const res = await fetch(BASE + url, {
    method,
    headers,
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    localStorage.removeItem('haj_token');
    window.location.href = '/login';
    return;
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || data.error || `Erreur ${res.status}`);
  return data;
}

const pickData = payload => (payload && payload.data !== undefined ? payload.data : payload);

const mapCategory = c => ({
  id: c?._id || c?.id,
  name: c?.name || '',
});

const mapProduct = p => ({
  id: p?._id || p?.id,
  name: p?.name || '',
  ref: p?.reference || p?.ref || '',
  reference: p?.reference || p?.ref || '',
  description: p?.description || '',
  purchase_price: p?.purchasePrice ?? p?.purchase_price ?? 0,
  sale_price: p?.sellingPrice ?? p?.sale_price ?? 0,
  stock: p?.stockQuantity ?? p?.stock ?? 0,
  category_id: p?.category?._id || p?.category || p?.category_id || '',
  category_name: p?.category?.name || p?.category_name || '',
  image: p?.image || null,
});

const mapClient = c => ({
  id: c?._id || c?.id,
  firstName: c?.firstName || c?.first_name || c?.prenom || '',
  lastName: c?.lastName || c?.last_name || c?.nom || '',
  phone: c?.phone || '',
  address: c?.address || c?.adresse || '',
  prenom: c?.firstName || c?.first_name || c?.prenom || '',
  nom: c?.lastName || c?.last_name || c?.nom || '',
  adresse: c?.address || c?.adresse || '',
});

// ── Auth ──────────────────────────────────────────────────────────────────────
export const auth = {
  login: async (email, password) => {
    const payload = await req('POST', '/auth/login', { email, password });
    return {
      token: payload.token,
      email: payload.admin?.email || payload.email,
      admin: payload.admin,
    };
  },
  me: async () => {
    const payload = await req('GET', '/auth/me');
    return { email: payload.email };
  },
};

// ── Dashboard ─────────────────────────────────────────────────────────────────
export const dashboard = {
  get: async () => {
    const payload = await req('GET', '/dashboard');
    return pickData(payload);
  },
};

// ── Categories ────────────────────────────────────────────────────────────────
export const categories = {
  list: async (filters = {}) => {
    const qs = new URLSearchParams(filters).toString();
    const payload = await req('GET', `/categories${qs ? `?${qs}` : ''}`);
    const list = (pickData(payload) || []).map(mapCategory);
    return { categories: list, subCategories: [], meta: payload.meta || null };
  },
  create: async name => {
    const payload = await req('POST', '/categories', { name });
    return mapCategory(pickData(payload));
  },
  update: async (id, name) => {
    const payload = await req('PUT', `/categories/${id}`, { name });
    return mapCategory(pickData(payload));
  },
  remove: id => req('DELETE', `/categories/${id}`),
  createSub: () => Promise.reject(new Error('Les sous-categories ne sont pas prises en charge par cette version API.')),
  removeSub: () => Promise.reject(new Error('Les sous-categories ne sont pas prises en charge par cette version API.')),
};

// ── Products ──────────────────────────────────────────────────────────────────
export const products = {
  list: async (filters = {}) => {
    const normalized = { ...filters };
    if (normalized.category_id) {
      normalized.category = normalized.category_id;
      delete normalized.category_id;
    }

    Object.keys(normalized).forEach(key => {
      if (normalized[key] === undefined || normalized[key] === null || normalized[key] === '') {
        delete normalized[key];
      }
    });

    const qs = new URLSearchParams(normalized).toString();
    const payload = await req('GET', `/products${qs ? '?' + qs : ''}`);
    const list = (pickData(payload) || []).map(mapProduct);
    return list;
  },
  create: async formData => {
    const fd = new FormData();
    const reference = formData.get('ref') || formData.get('reference') || `REF-${Date.now()}`;
    fd.append('name', formData.get('name') || '');
    fd.append('reference', reference);
    fd.append('description', formData.get('description') || '');
    fd.append('purchasePrice', formData.get('purchase_price') || formData.get('purchasePrice') || 0);
    fd.append('sellingPrice', formData.get('sale_price') || formData.get('sellingPrice') || 0);
    fd.append('stockQuantity', formData.get('stock') || formData.get('stockQuantity') || 0);
    fd.append('category', formData.get('category_id') || formData.get('category') || '');
    if (formData.get('image')) fd.append('image', formData.get('image'));
    const payload = await req('POST', '/products', fd, true);
    return mapProduct(pickData(payload));
  },
  update: async (id, formData) => {
    const fd = new FormData();
    if (formData.get('name') !== null) fd.append('name', formData.get('name'));
    if (formData.get('ref') !== null || formData.get('reference') !== null) {
      fd.append('reference', formData.get('ref') || formData.get('reference') || `REF-${Date.now()}`);
    }
    if (formData.get('description') !== null) fd.append('description', formData.get('description'));
    if (formData.get('purchase_price') !== null || formData.get('purchasePrice') !== null) {
      fd.append('purchasePrice', formData.get('purchase_price') || formData.get('purchasePrice') || 0);
    }
    if (formData.get('sale_price') !== null || formData.get('sellingPrice') !== null) {
      fd.append('sellingPrice', formData.get('sale_price') || formData.get('sellingPrice') || 0);
    }
    if (formData.get('stock') !== null || formData.get('stockQuantity') !== null) {
      fd.append('stockQuantity', formData.get('stock') || formData.get('stockQuantity') || 0);
    }
    if (formData.get('category_id') !== null || formData.get('category') !== null) {
      fd.append('category', formData.get('category_id') || formData.get('category') || '');
    }
    if (formData.get('image')) fd.append('image', formData.get('image'));
    const payload = await req('PUT', `/products/${id}`, fd, true);
    return mapProduct(pickData(payload));
  },
  remove: (id) => req('DELETE', `/products/${id}`),
};

// ── Clients ───────────────────────────────────────────────────────────────────
export const clients = {
  list: async (search = '') => {
    const payload = await req('GET', `/clients${search ? `?search=${encodeURIComponent(search)}` : ''}`);
    return (pickData(payload) || []).map(mapClient);
  },
  get: async id => {
    const payload = await req('GET', `/clients/${id}`);
    return mapClient(pickData(payload));
  },
  create: async data => {
    const firstName = data.firstName || data.prenom || '';
    const lastName = data.lastName || data.nom || '';
    const address = data.address || data.adresse || '';

    const payload = await req('POST', '/clients', {
      // Keep both naming conventions to support legacy and migrated backends.
      firstName,
      lastName,
      nom: lastName,
      prenom: firstName,
      phone: data.phone || '',
      address,
      adresse: address,
    });
    return mapClient(pickData(payload));
  },
  update: async (id, data) => {
    const firstName = data.firstName || data.prenom;
    const lastName = data.lastName || data.nom;
    const address = data.address || data.adresse;

    const payload = await req('PUT', `/clients/${id}`, {
      ...(data.firstName !== undefined || data.prenom !== undefined
        ? { firstName, prenom: firstName }
        : {}),
      ...(data.lastName !== undefined || data.nom !== undefined
        ? { lastName, nom: lastName }
        : {}),
      ...(data.phone !== undefined ? { phone: data.phone } : {}),
      ...(data.address !== undefined || data.adresse !== undefined
        ? { address, adresse: address }
        : {}),
    });
    return mapClient(pickData(payload));
  },
  remove: (id)          => req('DELETE', `/clients/${id}`),
};

// ── Client Orders ─────────────────────────────────────────────────────────────
export const clientOrders = {
  list: async (clientId) => {
    const payload = await req('GET', `/clients/${clientId}/orders`);
    return pickData(payload) || [];
  },
  create: async (clientId, data) => {
    const payload = await req('POST', `/clients/${clientId}/orders`, data);
    return pickData(payload);
  },
  update: async (orderId, data) => {
    const payload = await req('PUT', `/client-orders/${orderId}`, data);
    return pickData(payload);
  },
  remove: async (orderId) => {
    await req('DELETE', `/client-orders/${orderId}`);
  },
};

// ── Orders ─────────────────────────────────────────────────────────────────────
export const orders = {
  list: async filters => {
    const qs = new URLSearchParams(filters || {}).toString();
    const payload = await req('GET', `/orders${qs ? `?${qs}` : ''}`);
    return { items: pickData(payload) || [], meta: payload.meta || null };
  },
  create: data => req('POST', '/orders', data),
  updateStatus: (id, status) => req('PUT', `/orders/${id}/status`, { status }),
};

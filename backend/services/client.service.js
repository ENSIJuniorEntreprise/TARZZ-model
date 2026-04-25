const mongoose = require('mongoose');
const Client = require('../models/Client');
const Order = require('../models/Order');
const ApiError = require('../utils/ApiError');
const { parsePagination, buildMeta, parseSort, toRegex } = require('../utils/query');

const listClients = async query => {
  const { page, limit, skip } = parsePagination(query);
  const sort = parseSort(query, { date: 'createdAt', name: 'firstName' }, { createdAt: -1 });

  const filter = {};
  if (query.search) {
    const regex = toRegex(query.search);
    filter.$or = [{ firstName: regex }, { lastName: regex }, { phone: regex }];
  }

  const [items, total] = await Promise.all([
    Client.find(filter).sort(sort).skip(skip).limit(limit),
    Client.countDocuments(filter),
  ]);

  return { data: items, meta: buildMeta(total, page, limit) };
};

const getClientById = async id => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new ApiError(400, 'Invalid client id');
  const client = await Client.findById(id);
  if (!client) throw new ApiError(404, 'Client not found');
  return client;
};

const createClient = payload => {
  return Client.create({
    firstName: String(payload.firstName).trim(),
    lastName: String(payload.lastName).trim(),
    phone: payload.phone ? String(payload.phone).trim() : '',
    address: payload.address ? String(payload.address).trim() : '',
  });
};

const updateClient = async (id, payload) => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new ApiError(400, 'Invalid client id');

  const updated = await Client.findByIdAndUpdate(
    id,
    {
      ...(payload.firstName !== undefined ? { firstName: String(payload.firstName).trim() } : {}),
      ...(payload.lastName !== undefined ? { lastName: String(payload.lastName).trim() } : {}),
      ...(payload.phone !== undefined ? { phone: String(payload.phone).trim() } : {}),
      ...(payload.address !== undefined ? { address: String(payload.address).trim() } : {}),
    },
    { new: true, runValidators: true }
  );

  if (!updated) throw new ApiError(404, 'Client not found');
  return updated;
};

const deleteClient = async id => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new ApiError(400, 'Invalid client id');

  const deleted = await Client.findByIdAndDelete(id);
  if (!deleted) throw new ApiError(404, 'Client not found');

  await Order.deleteMany({ client: id });
};

module.exports = {
  listClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
};

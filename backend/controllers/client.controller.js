const catchAsync = require('../utils/catchAsync');
const clientService = require('../services/client.service');

const getClients = catchAsync(async (req, res) => {
  const result = await clientService.listClients(req.query);
  res.status(200).json({ success: true, ...result });
});

const getClientById = catchAsync(async (req, res) => {
  const client = await clientService.getClientById(req.params.id);
  res.status(200).json({ success: true, data: client });
});

const createClient = catchAsync(async (req, res) => {
  const client = await clientService.createClient(req.body);
  res.status(201).json({ success: true, data: client });
});

const updateClient = catchAsync(async (req, res) => {
  const client = await clientService.updateClient(req.params.id, req.body);
  res.status(200).json({ success: true, data: client });
});

const deleteClient = catchAsync(async (req, res) => {
  await clientService.deleteClient(req.params.id);
  res.status(200).json({ success: true, message: 'Client deleted' });
});

module.exports = {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
};

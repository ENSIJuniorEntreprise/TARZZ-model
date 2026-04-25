const Product = require('../models/Product');
const Client = require('../models/Client');
const Order = require('../models/Order');

const getDashboardStats = async () => {
  const [totalProducts, totalClients, lowStockProducts, outOfStock, lowStock, stockValueAgg, recentOrders] = await Promise.all([
    Product.countDocuments(),
    Client.countDocuments(),
    Product.find({ stockQuantity: { $lte: 3 } })
      .populate('category', 'name')
      .sort({ stockQuantity: 1 })
      .limit(10),
    Product.countDocuments({ stockQuantity: 0 }),
    Product.countDocuments({ stockQuantity: { $gt: 0, $lte: 3 } }),
    Product.aggregate([
      {
        $group: {
          _id: null,
          totalStockValue: { $sum: { $multiply: ['$stockQuantity', '$sellingPrice'] } },
        },
      },
    ]),
    Order.find({})
      .populate('client', 'firstName lastName')
      .sort({ date: -1 })
      .limit(6),
  ]);

  const orderStats = await Order.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const ordersByStatus = orderStats.reduce(
    (acc, item) => ({ ...acc, [item._id]: item.count }),
    { pending: 0, in_progress: 0, delivered: 0 }
  );

  const toLegacyStatus = status => {
    if (status === 'delivered') return 'Livre';
    if (status === 'in_progress') return 'En cours';
    return 'Non commence';
  };

  const mappedLowStockProducts = lowStockProducts.map(p => ({
    id: p._id,
    name: p.name,
    image: p.image,
    stock: p.stockQuantity,
    stockQuantity: p.stockQuantity,
    category_name: p.category?.name || null,
    category: p.category,
  }));

  const recentPurchases = recentOrders.map(order => ({
    id: order._id,
    first_name: order.client?.firstName || '',
    last_name: order.client?.lastName || '',
    date: order.date,
    amount: order.totalAmount,
    status: toLegacyStatus(order.status),
  }));

  return {
    totalStockValue: stockValueAgg[0]?.totalStockValue || 0,
    totalProducts,
    lowStockProducts: mappedLowStockProducts,
    totalClients,
    ordersByStatus,
    delivered: ordersByStatus.delivered,
    inProgress: ordersByStatus.in_progress,
    notStarted: ordersByStatus.pending,
    outOfStock,
    lowStock,
    recentPurchases,
  };
};

module.exports = { getDashboardStats };

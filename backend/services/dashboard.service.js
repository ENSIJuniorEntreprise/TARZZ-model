const Client = require('../models/Client');
const ClientOrder = require('../models/ClientOrder');

const MONTHS_FR = ['Jan','Fév','Mar','Avr','Mai','Juin','Juil','Août','Sep','Oct','Nov','Déc'];

const getDashboardStats = async () => {
  const [
    totalClients,
    delivered,
    inProgress,
    enCommande,
    recentOrders,
    monthlyAgg,
  ] = await Promise.all([
    Client.countDocuments(),
    ClientOrder.countDocuments({ status: 'livre' }),
    ClientOrder.countDocuments({ status: 'en_cours' }),
    ClientOrder.countDocuments({ status: 'en_commande' }),
    ClientOrder.find({})
      .populate('client', 'firstName lastName')
      .sort({ date: -1 })
      .limit(6),
    ClientOrder.aggregate([
      {
        $group: {
          _id: { year: { $year: '$date' }, month: { $month: '$date' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]),
  ]);

  const monthlyStats = monthlyAgg.map(m => ({
    mois:      MONTHS_FR[m._id.month - 1],
    commandes: m.count,
    year:      m._id.year,
    month:     m._id.month,
  }));

  const recentPurchases = recentOrders.map(order => ({
    id:        order._id,
    firstName: order.client?.firstName || '',
    lastName:  order.client?.lastName  || '',
    date:      order.date,
    itemCount: (order.items || []).length,
    status:    order.status,
  }));

  return {
    totalClients,
    delivered,
    inProgress,
    enCommande,
    recentPurchases,
    monthlyStats,
  };
};

module.exports = { getDashboardStats };

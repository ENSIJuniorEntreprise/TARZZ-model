const parsePagination = query => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

const buildMeta = (total, page, limit) => {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

const parseSort = (query, map, defaultSort = { createdAt: -1 }) => {
  const sortBy = query.sortBy;
  const sortOrder = query.sortOrder === 'asc' ? 1 : -1;

  if (!sortBy || !map[sortBy]) {
    return defaultSort;
  }

  return { [map[sortBy]]: sortOrder };
};

const toRegex = value => new RegExp(String(value).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');

module.exports = {
  parsePagination,
  buildMeta,
  parseSort,
  toRegex,
};

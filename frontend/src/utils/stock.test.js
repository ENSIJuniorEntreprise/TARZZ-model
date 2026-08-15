import { describe, test, expect, beforeEach } from 'vitest';
import {
  DEFAULT_STOCK,
  LOW_STOCK_THRESHOLD,
  loadStocks,
  idToKey,
  getByKey,
  initStocks,
  checkStocks,
  decrementStocks,
  restoreStocks,
  updateStock,
  getStockStats,
} from './stock';

beforeEach(() => {
  localStorage.clear();
});

describe('idToKey', () => {
  test('extracts the stable key from an asset import path', () => {
    expect(idToKey('/src/../../assets/KY1/sub/img.jpg')).toBe('KY1/sub/img');
  });

  test('strips the extension regardless of length', () => {
    expect(idToKey('../../assets/Bracelets/B1.jpeg')).toBe('Bracelets/B1');
  });
});

describe('getByKey', () => {
  test('returns DEFAULT_STOCK for an unseen key', () => {
    expect(getByKey('unknown/key')).toBe(DEFAULT_STOCK);
  });

  test('returns the stored value when present, including 0', () => {
    updateStock('known/key', 0);
    expect(getByKey('known/key')).toBe(0);
  });
});

describe('initStocks', () => {
  test('seeds DEFAULT_STOCK for ids not yet tracked', () => {
    const ids = ['../../assets/A/1.jpg', '../../assets/A/2.jpg'];
    const stocks = initStocks(ids);
    expect(stocks['A/1']).toBe(DEFAULT_STOCK);
    expect(stocks['A/2']).toBe(DEFAULT_STOCK);
  });

  test('does not overwrite an existing stock value', () => {
    updateStock('A/1', 3);
    const stocks = initStocks(['../../assets/A/1.jpg']);
    expect(stocks['A/1']).toBe(3);
  });
});

describe('checkStocks', () => {
  test('returns no error when stock is sufficient', () => {
    updateStock('A/1', 10);
    const errors = checkStocks([{ name: 'Bague', stockId: 'A/1', quantity: 2 }]);
    expect(errors).toEqual([]);
  });

  test('returns a readable error when stock is insufficient', () => {
    updateStock('A/1', 1);
    const errors = checkStocks([{ name: 'Bague', stockId: 'A/1', quantity: 5 }]);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain('Bague');
    expect(errors[0]).toContain('1 disponible');
  });
});

describe('decrementStocks / restoreStocks', () => {
  test('decrementStocks reduces the stored quantity, floored at 0', () => {
    updateStock('A/1', 3);
    decrementStocks([{ stockId: 'A/1', quantity: 5 }]);
    expect(getByKey('A/1')).toBe(0);
  });

  test('restoreStocks adds back a previously decremented quantity', () => {
    updateStock('A/1', 2);
    decrementStocks([{ stockId: 'A/1', quantity: 2 }]);
    expect(getByKey('A/1')).toBe(0);
    restoreStocks([{ stockId: 'A/1', quantity: 2 }]);
    expect(getByKey('A/1')).toBe(2);
  });

  test('restoreStocks ignores entries without a stockId', () => {
    expect(() => restoreStocks([{ stockId: null, quantity: 1 }])).not.toThrow();
  });
});

describe('updateStock', () => {
  test('persists the value and rejects negatives (floors at 0)', () => {
    updateStock('A/1', -5);
    expect(getByKey('A/1')).toBe(0);
  });

  test('is readable back via loadStocks', () => {
    updateStock('A/1', 7);
    expect(loadStocks()['A/1']).toBe(7);
  });
});

describe('getStockStats', () => {
  test('counts out-of-stock and low-stock items correctly', () => {
    updateStock('Cat/OutOfStock', 0);
    updateStock('Cat/Low', LOW_STOCK_THRESHOLD);
    updateStock('Cat/Healthy', LOW_STOCK_THRESHOLD + 10);

    const stats = getStockStats();
    expect(stats.outOfStock).toBe(1);
    expect(stats.lowStock).toBe(1);
    expect(stats.lowStockItems.some(i => i.key === 'Cat/OutOfStock')).toBe(true);
    expect(stats.lowStockItems.some(i => i.key === 'Cat/Healthy')).toBe(false);
  });

  test('limits lowStockItems to 8 entries, sorted ascending by stock', () => {
    for (let i = 0; i < 12; i++) {
      updateStock(`Cat/Item${i}`, i);
    }
    const stats = getStockStats();
    expect(stats.lowStockItems.length).toBeLessThanOrEqual(8);
    const stocks = stats.lowStockItems.map(i => i.stock);
    expect(stocks).toEqual([...stocks].sort((a, b) => a - b));
  });
});

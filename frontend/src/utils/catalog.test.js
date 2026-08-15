import { describe, test, expect, beforeEach } from 'vitest';
import { STATIC_TREE, mergeCatalog, flattenTree, getNode, sortedChildren } from './catalog';

beforeEach(() => {
  localStorage.clear();
});

describe('STATIC_TREE', () => {
  test('is built from the static assets (non-empty)', () => {
    expect(Object.keys(STATIC_TREE).length).toBeGreaterThan(0);
  });
});

describe('mergeCatalog', () => {
  test('adds a virtual category not present in the static tree', () => {
    const { tree, allCategories } = mergeCatalog(['MaCategorieTest'], []);
    expect(tree['MaCategorieTest']).toBeDefined();
    expect(allCategories).toContain('MaCategorieTest');
  });

  test('nests a virtual product under its declared path', () => {
    const prod = { id: 'virtual/test_1', name: 'Bracelet Test', path: ['MaCategorieTest', 'SousCat'], dataUrl: 'data:image/png;base64,x' };
    const { tree } = mergeCatalog(['MaCategorieTest'], [prod]);
    const node = getNode(['MaCategorieTest', 'SousCat'], tree);
    expect(node).toBeTruthy();
    expect(node.images).toHaveLength(1);
    expect(node.images[0]).toMatchObject({ id: 'virtual/test_1', name: 'Bracelet Test', virtual: true });
  });

  test('does not mutate STATIC_TREE', () => {
    const before = JSON.stringify(Object.keys(STATIC_TREE));
    mergeCatalog(['AnotherVirtualCat'], []);
    expect(JSON.stringify(Object.keys(STATIC_TREE))).toBe(before);
  });
});

describe('flattenTree — regression test for FE-02 (virtual products invisible in orders)', () => {
  test('a virtual product appears in the flattened list used by order catalogs', () => {
    const prod = { id: 'virtual/test_2', name: 'Collier Test', path: ['MaCategorieTest'], dataUrl: 'data:image/png;base64,x' };
    const { tree } = mergeCatalog(['MaCategorieTest'], [prod]);
    const flat = flattenTree(tree);
    const entry = flat.find(p => p.id === 'virtual/test_2');
    expect(entry).toBeTruthy();
    expect(entry.name).toBe('Collier Test');
    expect(entry.category).toBe('MaCategorieTest');
    expect(entry.virtual).toBe(true);
  });

  test('flattening the plain static tree yields only non-virtual entries', () => {
    const flat = flattenTree(STATIC_TREE);
    expect(flat.every(p => p.virtual === false)).toBe(true);
    expect(flat.every(p => typeof p.stockId === 'string')).toBe(true);
  });
});

describe('sortedChildren', () => {
  test('sorts child category names', () => {
    const { tree } = mergeCatalog(['Zebra', 'Alpha'], []);
    const root = { images: [], children: tree };
    expect(sortedChildren(root)).toEqual([...sortedChildren(root)].sort((a, b) => a.localeCompare(b, undefined, { numeric: true })));
  });
});

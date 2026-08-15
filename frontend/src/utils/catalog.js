// Source unique du catalogue produit (build-time assets + produits/catégories
// ajoutés dynamiquement en localStorage). Auparavant dupliqué indépendamment
// dans categoriesetproduit.jsx, ClientDetail.jsx et FournisseurDetail.jsx —
// chaque copie divergeait légèrement (extensions supportées, gestion KY1/KY2,
// visibilité des produits ajoutés dynamiquement dans les commandes).
import { idToKey } from './stock';

const SKIP = new Set(['desktop.ini', 'thumbs.db', '.ds_store']);
const KY_CATS = new Set(['KY1', 'KY2']);

// Un seul appel eager à import.meta.glob pour tout le frontend (au lieu de
// trois), donc une seule copie des assets embarquée dans le bundle.
const rawModules = import.meta.glob(
  '../../assets/**/*.{png,jpg,jpeg,webp,PNG,JPG,JPEG,WEBP,gif,GIF}',
  { eager: true }
);

export const STATIC_IDS = Object.keys(rawModules);

function buildTree(modules) {
  const tree = {};
  Object.entries(modules).forEach(([path, mod]) => {
    const rel = path.replace(/^.*\/assets\//, '');
    const parts = rel.split('/');
    if (parts.length < 2) return;
    const filename = parts[parts.length - 1];
    if (SKIP.has(filename.toLowerCase())) return;
    const name = filename.replace(/\.[^.]+$/, '');
    const folders = parts.slice(0, -1);
    const cat = folders[0];
    if (!tree[cat]) tree[cat] = { images: [], children: {} };
    let node = tree[cat];
    for (let i = 1; i < folders.length; i++) {
      const sub = folders[i];
      if (!node.children[sub]) node.children[sub] = { images: [], children: {} };
      node = node.children[sub];
    }
    node.images.push({ id: path, name, url: mod.default, displayName: name });
  });

  function applyKyNames(node, pathParts) {
    const subPath = pathParts.slice(1);
    const base = subPath.length > 0 ? subPath.join(' · ') : pathParts[0];
    node.images.forEach((img, i) => {
      img.displayName = node.images.length > 1 ? `${base} (${i + 1})` : base;
    });
    Object.entries(node.children).forEach(([child, childNode]) =>
      applyKyNames(childNode, [...pathParts, child])
    );
  }

  function sortNode(n) {
    n.images.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
    Object.values(n.children).forEach(sortNode);
  }
  Object.values(tree).forEach(sortNode);

  KY_CATS.forEach(cat => {
    if (tree[cat]) applyKyNames(tree[cat], [cat]);
  });

  return tree;
}

export const STATIC_TREE = buildTree(rawModules);

export function cloneNode(n) {
  return {
    images: [...n.images],
    children: Object.fromEntries(
      Object.entries(n.children).map(([k, v]) => [k, cloneNode(v)])
    ),
  };
}

export function getNode(path, tree) {
  if (!path?.length) return null;
  let node = tree[path[0]];
  for (let i = 1; i < path.length; i++) {
    if (!node) return null;
    node = node.children[path[i]];
  }
  return node;
}

export function sortedChildren(node) {
  return Object.keys(node.children).sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true })
  );
}

// ── Catégories / produits ajoutés dynamiquement (localStorage) ────────────────
const VCAT_KEY = 'tarzz_virtual_cats_v1';
const VPROD_KEY = 'tarzz_virtual_prods_v1';

export const loadVirtualCategories = () => {
  try { return JSON.parse(localStorage.getItem(VCAT_KEY) || '[]'); } catch { return []; }
};
export const saveVirtualCategories = cats => localStorage.setItem(VCAT_KEY, JSON.stringify(cats));

export const loadVirtualProducts = () => {
  try { return JSON.parse(localStorage.getItem(VPROD_KEY) || '[]'); } catch { return []; }
};
export const saveVirtualProducts = prods => localStorage.setItem(VPROD_KEY, JSON.stringify(prods));

// Fusionne l'arbre statique (build-time) avec les catégories/produits virtuels.
// C'est cette fusion qui manquait dans ClientDetail/FournisseurDetail : un
// produit ajouté via "Ajouter un produit" n'apparaissait jamais dans le
// catalogue de commande.
export function mergeCatalog(vCats = loadVirtualCategories(), vProds = loadVirtualProducts()) {
  const tree = Object.fromEntries(
    Object.entries(STATIC_TREE).map(([k, v]) => [k, cloneNode(v)])
  );
  vCats.forEach(cat => {
    if (!tree[cat]) tree[cat] = { images: [], children: {} };
  });
  vProds.forEach(prod => {
    const [top, ...rest] = prod.path;
    if (!tree[top]) tree[top] = { images: [], children: {} };
    let node = tree[top];
    for (const sub of rest) {
      if (!node.children[sub]) node.children[sub] = { images: [], children: {} };
      node = node.children[sub];
    }
    node.images.push({ id: prod.id, name: prod.name, displayName: prod.name, url: prod.dataUrl, virtual: true });
  });
  const allCategories = Object.keys(tree).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
  return { tree, allCategories };
}

// Aplati un arbre (statique ou fusionné) en liste de produits, pour la
// recherche et les sélecteurs de commande.
export function flattenTree(tree, prefix = []) {
  let flat = [];
  for (const key of Object.keys(tree).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))) {
    const node = tree[key];
    const path = [...prefix, key];
    for (const img of node.images) {
      flat.push({
        id: img.id,
        name: img.displayName || img.name,
        category: path.join(' / '),
        url: img.url,
        stockId: idToKey(img.id),
        virtual: !!img.virtual,
      });
    }
    flat = flat.concat(flattenTree(node.children, path));
  }
  return flat;
}

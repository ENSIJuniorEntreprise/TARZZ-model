# TARZZ Model — Hajtayeb

Back-office interne mono-utilisateur pour la gestion d'une bijouterie : catalogue produits, clients, fournisseurs, commandes et tableau de bord. Pas de boutique publique — un seul compte admin gère l'ensemble.

## Stack

- **Backend** : Node.js / Express, MongoDB (Mongoose), authentification JWT + bcrypt.
- **Frontend** : React 18 + Vite, Tailwind CSS, React Router.

## Prérequis

- Node.js 18+
- MongoDB (local ou distant)

## Installation

```bash
# Backend
cd backend
npm install
cp .env.example .env   # puis renseigner les valeurs (voir ci-dessous)

# Frontend
cd ../frontend
npm install
```

## Variables d'environnement (`backend/.env`)

Voir `backend/.env.example` pour la liste complète. Points importants :

- `JWT_SECRET` et `ADMIN_PASSWORD` : **doivent être définis explicitement** en production (`NODE_ENV=production`) — le serveur refuse de démarrer sans eux plutôt que de retomber sur une valeur par défaut faible.
- `MONGO_URI` : connexion à la base MongoDB.
- `FRONTEND_ORIGIN` : origine autorisée pour le CORS — doit correspondre exactement à l'URL réelle du frontend déployé.

## Lancer en développement

```bash
# Backend (port 3001 par défaut)
cd backend
npm run dev

# Frontend (port 5173 par défaut, proxy /api vers le backend)
cd frontend
npm run dev
```

## Tests

```bash
cd backend
npm test
```

## Build de production (frontend)

```bash
cd frontend
npm run build
```

Génère `frontend/dist/` — non versionné dans Git (voir `.gitignore`), à déployer séparément.

## Architecture sommaire

```
backend/
  controllers/   logique HTTP par ressource
  services/      logique métier (utilisée quand présente ; certains controllers accèdent directement au modèle)
  models/        schémas Mongoose
  routes/        montage des endpoints, validation (express-validator)
  middlewares/    auth, validation, erreurs, upload
frontend/
  src/api/       couche d'appels HTTP unique (fetch)
  src/context/   état global (auth)
  src/pages/     écrans de l'application
  src/routes/    routage + protection des routes
```

## Notes

- Le catalogue produits affiché côté frontend est construit à partir des images statiques dans `frontend/assets/` (pas d'un vrai CRUD produit backend branché à ce jour).
- Aucune conteneurisation ni pipeline CI/CD pour l'instant.

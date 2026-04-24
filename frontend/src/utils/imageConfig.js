// Script pour copier les images dans le dossier public
// Ce fichier est un guide pour comprendre comment les images sont servies

// Les images sont servies depuis le dossier racine du projet:
// - /KY1/... -> c:/Users/LENOVO/OneDrive/Bureau/Documents/GitHub/TARZZ-model/frontend/KY1/...
// - /KY2/... -> c:/Users/LENOVO/OneDrive/Bureau/Documents/GitHub/TARZZ-model/frontend/KY2/...
// - /gurmet/... -> c:/Users/LENOVO/OneDrive/Bureau/Documents/GitHub/TARZZ-model/frontend/gurmet/...

// Configuration Vite pour servir ces fichiers
export const imageConfig = {
  KY1: '/KY1',
  KY2: '/KY2',
  gurmet: '/gurmet',
};
// Données complètes des produits extraites des dossiers KY1, KY2 et GURMET
// Structure: Catégorie → Sous-catégorie (poids) → Sous-sous-catégorie (millimétrage)

export const PRODUCTS_DATA = [
  // ==================== KY1 ====================
  // KY1: Chaque dossier = une sous-catégorie (poids), pas de sous-sous-catégorie
  
  // 8-10 GRAM
  { id: 1, ref: "KY1-8-10 GRAM", name: "8-10 GRAM", stock: 1, category: "KY1", subCategory: "8-10 GRAM", subSubCategory: "", image: "/KY1/8-10 GRAM/page_75_image_2.png" },
  
  // 9-11 GRAM
  { id: 2, ref: "KY1-9-11 GRAM", name: "9-11 GRAM", stock: 1, category: "KY1", subCategory: "9-11 GRAM", subSubCategory: "", image: "/KY1/9-11 GRAM/page_75_image_2.png" },
  
  // 10.40g
  { id: 3, ref: "KY1-10.40g", name: "10.40g", stock: 1, category: "KY1", subCategory: "10.40g", subSubCategory: "", image: "/KY1/10.40g/page_75_image_2.png" },
  
  // 10.55g
  { id: 4, ref: "KY1-10.55g", name: "10.55g", stock: 1, category: "KY1", subCategory: "10.55g", subSubCategory: "", image: "/KY1/10.55g/page_75_image_2.png" },
  
  // 10.70g
  { id: 5, ref: "KY1-10.70g", name: "10.70g", stock: 1, category: "KY1", subCategory: "10.70g", subSubCategory: "", image: "/KY1/10.70g/page_75_image_2.png" },
  
  // 10.9 GRAM
  { id: 6, ref: "KY1-10.9 GRAM", name: "10.9 GRAM", stock: 1, category: "KY1", subCategory: "10.9 GRAM", subSubCategory: "", image: "/KY1/10.9 GRAM/page_75_image_2.png" },
  
  // 11g
  { id: 7, ref: "KY1-11g", name: "11g", stock: 1, category: "KY1", subCategory: "11g", subSubCategory: "", image: "/KY1/11g/page_75_image_2.png" },
  
  // 11.10g
  { id: 8, ref: "KY1-11.10g", name: "11.10g", stock: 1, category: "KY1", subCategory: "11.10g", subSubCategory: "", image: "/KY1/11.10g/page_75_image_2.png" },
  
  // 11.55g
  { id: 9, ref: "KY1-11.55g", name: "11.55g", stock: 1, category: "KY1", subCategory: "11.55g", subSubCategory: "", image: "/KY1/11.55g/page_75_image_2.png" },
  
  // 11.70g
  { id: 10, ref: "KY1-11.70g", name: "11.70g", stock: 1, category: "KY1", subCategory: "11.70g", subSubCategory: "", image: "/KY1/11.70g/page_75_image_2.png" },
  
  // 11.85g
  { id: 11, ref: "KY1-11.85g", name: "11.85g", stock: 1, category: "KY1", subCategory: "11.85g", subSubCategory: "", image: "/KY1/11.85g/page_75_image_2.png" },
  
  // 11.90g
  { id: 12, ref: "KY1-11.90g", name: "11.90g", stock: 1, category: "KY1", subCategory: "11.90g", subSubCategory: "", image: "/KY1/11.90g/page_75_image_2.png" },
  
  // 12 GRAM
  { id: 13, ref: "KY1-12 GRAM", name: "12 GRAM", stock: 1, category: "KY1", subCategory: "12 GRAM", subSubCategory: "", image: "/KY1/12 GRAM/page_75_image_2.png" },
  
  // 12.10g
  { id: 14, ref: "KY1-12.10g", name: "12.10g", stock: 1, category: "KY1", subCategory: "12.10g", subSubCategory: "", image: "/KY1/12.10g/page_75_image_2.png" },
  
  // 12.25g
  { id: 15, ref: "KY1-12.25g", name: "12.25g", stock: 1, category: "KY1", subCategory: "12.25g", subSubCategory: "", image: "/KY1/12.25g/page_75_image_2.png" },
  
  // 12.50g
  { id: 16, ref: "KY1-12.50g", name: "12.50g", stock: 1, category: "KY1", subCategory: "12.50g", subSubCategory: "", image: "/KY1/12.50g/page_75_image_2.png" },
  
  // 12.65g
  { id: 17, ref: "KY1-12.65g", name: "12.65g", stock: 1, category: "KY1", subCategory: "12.65g", subSubCategory: "", image: "/KY1/12.65g/page_75_image_2.png" },
  
  // 12.70g
  { id: 18, ref: "KY1-12.70g", name: "12.70g", stock: 1, category: "KY1", subCategory: "12.70g", subSubCategory: "", image: "/KY1/12.70g/page_75_image_2.png" },
  
  // 12.85g
  { id: 19, ref: "KY1-12.85g", name: "12.85g", stock: 1, category: "KY1", subCategory: "12.85g", subSubCategory: "", image: "/KY1/12.85g/page_75_image_2.png" },
  
  // 12.90g
  { id: 20, ref: "KY1-12.90g", name: "12.90g", stock: 1, category: "KY1", subCategory: "12.90g", subSubCategory: "", image: "/KY1/12.90g/page_75_image_2.png" },
  
  // 13g
  { id: 21, ref: "KY1-13g", name: "13g", stock: 1, category: "KY1", subCategory: "13g", subSubCategory: "", image: "/KY1/13g/page_75_image_2.png" },
  
  // 13 GRAM
  { id: 22, ref: "KY1-13 GRAM", name: "13 GRAM", stock: 1, category: "KY1", subCategory: "13 GRAM", subSubCategory: "", image: "/KY1/13 GRAM/page_75_image_2.png" },
  
  // 13-15 GRAM
  { id: 23, ref: "KY1-13-15 GRAM", name: "13-15 GRAM", stock: 1, category: "KY1", subCategory: "13-15 GRAM", subSubCategory: "", image: "/KY1/13-15 GRAM/page_75_image_2.png" },
  
  // 13.15g
  { id: 24, ref: "KY1-13.15g", name: "13.15g", stock: 1, category: "KY1", subCategory: "13.15g", subSubCategory: "", image: "/KY1/13.15g/page_75_image_2.png" },
  
  // 13.25g
  { id: 25, ref: "KY1-13.25g", name: "13.25g", stock: 1, category: "KY1", subCategory: "13.25g", subSubCategory: "", image: "/KY1/13.25g/page_75_image_2.png" },
  
  // 13.40g
  { id: 26, ref: "KY1-13.40g", name: "13.40g", stock: 1, category: "KY1", subCategory: "13.40g", subSubCategory: "", image: "/KY1/13.40g/page_75_image_2.png" },
  
  // 13.45g
  { id: 27, ref: "KY1-13.45g", name: "13.45g", stock: 1, category: "KY1", subCategory: "13.45g", subSubCategory: "", image: "/KY1/13.45g/page_75_image_2.png" },
  
  // 13.50g
  { id: 28, ref: "KY1-13.50g", name: "13.50g", stock: 1, category: "KY1", subCategory: "13.50g", subSubCategory: "", image: "/KY1/13.50g/page_75_image_2.png" },
  
  // 13.60g
  { id: 29, ref: "KY1-13.60g", name: "13.60g", stock: 1, category: "KY1", subCategory: "13.60g", subSubCategory: "", image: "/KY1/13.60g/page_75_image_2.png" },
  
  // 13.65g
  { id: 30, ref: "KY1-13.65g", name: "13.65g", stock: 1, category: "KY1", subCategory: "13.65g", subSubCategory: "", image: "/KY1/13.65g/page_75_image_2.png" },
  
  // 13.80g
  { id: 31, ref: "KY1-13.80g", name: "13.80g", stock: 1, category: "KY1", subCategory: "13.80g", subSubCategory: "", image: "/KY1/13.80g/page_75_image_2.png" },
  
  // 13.85g
  { id: 32, ref: "KY1-13.85g", name: "13.85g", stock: 1, category: "KY1", subCategory: "13.85g", subSubCategory: "", image: "/KY1/13.85g/page_75_image_2.png" },
  
  // 14 GRAM
  { id: 33, ref: "KY1-14 GRAM", name: "14 GRAM", stock: 1, category: "KY1", subCategory: "14 GRAM", subSubCategory: "", image: "/KY1/14 GRAM/page_75_image_2.png" },
  
  // 14-16 GRAM
  { id: 34, ref: "KY1-14-16 GRAM", name: "14-16 GRAM", stock: 1, category: "KY1", subCategory: "14-16 GRAM", subSubCategory: "", image: "/KY1/14-16 GRAM/page_75_image_2.png" },
  
  // 14.15g
  { id: 35, ref: "KY1-14.15g", name: "14.15g", stock: 1, category: "KY1", subCategory: "14.15g", subSubCategory: "", image: "/KY1/14.15g/page_75_image_2.png" },
  
  // 14.20g
  { id: 36, ref: "KY1-14.20g", name: "14.20g", stock: 1, category: "KY1", subCategory: "14.20g", subSubCategory: "", image: "/KY1/14.20g/page_75_image_2.png" },
  
  // 14.30g
  { id: 37, ref: "KY1-14.30g", name: "14.30g", stock: 1, category: "KY1", subCategory: "14.30g", subSubCategory: "", image: "/KY1/14.30g/page_75_image_2.png" },
  
  // 14.40g
  { id: 38, ref: "KY1-14.40g", name: "14.40g", stock: 1, category: "KY1", subCategory: "14.40g", subSubCategory: "", image: "/KY1/14.40g/page_75_image_2.png" },
  
  // 14.45g
  { id: 39, ref: "KY1-14.45g", name: "14.45g", stock: 1, category: "KY1", subCategory: "14.45g", subSubCategory: "", image: "/KY1/14.45g/page_75_image_2.png" },
  
  // 14.50g
  { id: 40, ref: "KY1-14.50g", name: "14.50g", stock: 1, category: "KY1", subCategory: "14.50g", subSubCategory: "", image: "/KY1/14.50g/page_75_image_2.png" },
  
  // 14.60g
  { id: 41, ref: "KY1-14.60g", name: "14.60g", stock: 1, category: "KY1", subCategory: "14.60g", subSubCategory: "", image: "/KY1/14.60g/page_75_image_2.png" },
  
  // 14.70g
  { id: 42, ref: "KY1-14.70g", name: "14.70g", stock: 1, category: "KY1", subCategory: "14.70g", subSubCategory: "", image: "/KY1/14.70g/page_75_image_2.png" },
  
  // 14.80g
  { id: 43, ref: "KY1-14.80g", name: "14.80g", stock: 1, category: "KY1", subCategory: "14.80g", subSubCategory: "", image: "/KY1/14.80g/page_75_image_2.png" },
  
  // 14.85g
  { id: 44, ref: "KY1-14.85g", name: "14.85g", stock: 1, category: "KY1", subCategory: "14.85g", subSubCategory: "", image: "/KY1/14.85g/page_75_image_2.png" },
  
  // 15 GRAM
  { id: 45, ref: "KY1-15 GRAM", name: "15 GRAM", stock: 1, category: "KY1", subCategory: "15 GRAM", subSubCategory: "", image: "/KY1/15 GRAM/page_75_image_2.png" },
  
  // 15.10g
  { id: 46, ref: "KY1-15.10g", name: "15.10g", stock: 1, category: "KY1", subCategory: "15.10g", subSubCategory: "", image: "/KY1/15.10g/page_75_image_2.png" },
  
  // 15.20g
  { id: 47, ref: "KY1-15.20g", name: "15.20g", stock: 1, category: "KY1", subCategory: "15.20g", subSubCategory: "", image: "/KY1/15.20g/page_75_image_2.png" },
  
  // 15.30g
  { id: 48, ref: "KY1-15.30g", name: "15.30g", stock: 1, category: "KY1", subCategory: "15.30g", subSubCategory: "", image: "/KY1/15.30g/page_75_image_2.png" },
  
  // 15.35g
  { id: 49, ref: "KY1-15.35g", name: "15.35g", stock: 1, category: "KY1", subCategory: "15.35g", subSubCategory: "", image: "/KY1/15.35g/page_75_image_2.png" },
  
  // 15.40g
  { id: 50, ref: "KY1-15.40g", name: "15.40g", stock: 1, category: "KY1", subCategory: "15.40g", subSubCategory: "", image: "/KY1/15.40g/page_75_image_2.png" },
  
  // 15.45g
  { id: 51, ref: "KY1-15.45g", name: "15.45g", stock: 1, category: "KY1", subCategory: "15.45g", subSubCategory: "", image: "/KY1/15.45g/page_75_image_2.png" },
  
  // 15.50g
  { id: 52, ref: "KY1-15.50g", name: "15.50g", stock: 1, category: "KY1", subCategory: "15.50g", subSubCategory: "", image: "/KY1/15.50g/page_75_image_2.png" },
  
  // 15.60g
  { id: 53, ref: "KY1-15.60g", name: "15.60g", stock: 1, category: "KY1", subCategory: "15.60g", subSubCategory: "", image: "/KY1/15.60g/page_75_image_2.png" },
  
  // 15.65g
  { id: 54, ref: "KY1-15.65g", name: "15.65g", stock: 1, category: "KY1", subCategory: "15.65g", subSubCategory: "", image: "/KY1/15.65g/page_75_image_2.png" },
  
  // 15.90g
  { id: 55, ref: "KY1-15.90g", name: "15.90g", stock: 1, category: "KY1", subCategory: "15.90g", subSubCategory: "", image: "/KY1/15.90g/page_75_image_2.png" },
  
  // 16 GRAM
  { id: 56, ref: "KY1-16 GRAM", name: "16 GRAM", stock: 1, category: "KY1", subCategory: "16 GRAM", subSubCategory: "", image: "/KY1/16 GRAM/page_75_image_2.png" },
  
  // 16-18 GRAM
  { id: 57, ref: "KY1-16-18 GRAM", name: "16-18 GRAM", stock: 1, category: "KY1", subCategory: "16-18 GRAM", subSubCategory: "", image: "/KY1/16-18 GRAM/page_75_image_2.png" },
  
  // 16.05g
  { id: 58, ref: "KY1-16.05g", name: "16.05g", stock: 1, category: "KY1", subCategory: "16.05g", subSubCategory: "", image: "/KY1/16.05g/page_75_image_2.png" },
  
  // 16.10g
  { id: 59, ref: "KY1-16.10g", name: "16.10g", stock: 1, category: "KY1", subCategory: "16.10g", subSubCategory: "", image: "/KY1/16.10g/page_75_image_2.png" },
  
  // 16.15 GRAM
  { id: 60, ref: "KY1-16.15 GRAM", name: "16.15 GRAM", stock: 1, category: "KY1", subCategory: "16.15 GRAM", subSubCategory: "", image: "/KY1/16.15 GRAM/page_75_image_2.png" },
  
  // 16.20g
  { id: 61, ref: "KY1-16.20g", name: "16.20g", stock: 1, category: "KY1", subCategory: "16.20g", subSubCategory: "", image: "/KY1/16.20g/page_75_image_2.png" },
  
  // 16.35g
  { id: 62, ref: "KY1-16.35g", name: "16.35g", stock: 1, category: "KY1", subCategory: "16.35g", subSubCategory: "", image: "/KY1/16.35g/page_75_image_2.png" },
  
  // 16.60g
  { id: 63, ref: "KY1-16.60g", name: "16.60g", stock: 1, category: "KY1", subCategory: "16.60g", subSubCategory: "", image: "/KY1/16.60g/page_75_image_2.png" },
  
  // 16.70g
  { id: 64, ref: "KY1-16.70g", name: "16.70g", stock: 1, category: "KY1", subCategory: "16.70g", subSubCategory: "", image: "/KY1/16.70g/page_75_image_2.png" },
  
  // 16.80g
  { id: 65, ref: "KY1-16.80g", name: "16.80g", stock: 1, category: "KY1", subCategory: "16.80g", subSubCategory: "", image: "/KY1/16.80g/page_75_image_2.png" },
  
  // 16.90g
  { id: 66, ref: "KY1-16.90g", name: "16.90g", stock: 1, category: "KY1", subCategory: "16.90g", subSubCategory: "", image: "/KY1/16.90g/page_75_image_2.png" },
  
  // 17 GRAM
  { id: 67, ref: "KY1-17 GRAM", name: "17 GRAM", stock: 1, category: "KY1", subCategory: "17 GRAM", subSubCategory: "", image: "/KY1/17 GRAM/page_75_image_2.png" },
  
  // 17-19 GRAM
  { id: 68, ref: "KY1-17-19 GRAM", name: "17-19 GRAM", stock: 1, category: "KY1", subCategory: "17-19 GRAM", subSubCategory: "", image: "/KY1/17-19 GRAM/page_75_image_2.png" },
  
  // 17.10g
  { id: 69, ref: "KY1-17.10g", name: "17.10g", stock: 1, category: "KY1", subCategory: "17.10g", subSubCategory: "", image: "/KY1/17.10g/page_75_image_2.png" },
  
  // 17.20g
  { id: 70, ref: "KY1-17.20g", name: "17.20g", stock: 1, category: "KY1", subCategory: "17.20g", subSubCategory: "", image: "/KY1/17.20g/page_75_image_2.png" },
  
  // 17.30g
  { id: 71, ref: "KY1-17.30g", name: "17.30g", stock: 1, category: "KY1", subCategory: "17.30g", subSubCategory: "", image: "/KY1/17.30g/page_75_image_2.png" },
  
  // 17.5 GRAM
  { id: 72, ref: "KY1-17.5 GRAM", name: "17.5 GRAM", stock: 1, category: "KY1", subCategory: "17.5 GRAM", subSubCategory: "", image: "/KY1/17.5 GRAM/page_75_image_2.png" },
  
  // 17.90g
  { id: 73, ref: "KY1-17.90g", name: "17.90g", stock: 1, category: "KY1", subCategory: "17.90g", subSubCategory: "", image: "/KY1/17.90g/page_75_image_2.png" },
  
  // 18 GRAM
  { id: 74, ref: "KY1-18 GRAM", name: "18 GRAM", stock: 1, category: "KY1", subCategory: "18 GRAM", subSubCategory: "", image: "/KY1/18 GRAM/page_75_image_2.png" },
  
  // 18 k 11-13 gr
  { id: 75, ref: "KY1-18k 11-13 gr", name: "18k 11-13 gr", stock: 1, category: "KY1", subCategory: "18k 11-13 gr", subSubCategory: "", image: "/KY1/18 k 11-13 gr/page_45_image_1.png" },
  
  // 18.30 g
  { id: 76, ref: "KY1-18.30 g", name: "18.30 g", stock: 1, category: "KY1", subCategory: "18.30 g", subSubCategory: "", image: "/KY1/18.30 g/page_75_image_2.png" },
  
  // 18.5 GRAM
  { id: 77, ref: "KY1-18.5 GRAM", name: "18.5 GRAM", stock: 1, category: "KY1", subCategory: "18.5 GRAM", subSubCategory: "", image: "/KY1/18.5 GRAM/page_75_image_2.png" },
  
  // 18k 15-17 gr
  { id: 78, ref: "KY1-18k 15-17 gr", name: "18k 15-17 gr", stock: 1, category: "KY1", subCategory: "18k 15-17 gr", subSubCategory: "", image: "/KY1/18k 15-17 gr/page_45_image_1.png" },
  
  // 18k 18-21 gr
  { id: 79, ref: "KY1-18k 18-21 gr", name: "18k 18-21 gr", stock: 1, category: "KY1", subCategory: "18k 18-21 gr", subSubCategory: "", image: "/KY1/18k 18-21 gr/page_45_image_1.png" },
  
  // 18k 9-11gr
  { id: 80, ref: "KY1-18k 9-11gr", name: "18k 9-11gr", stock: 1, category: "KY1", subCategory: "18k 9-11gr", subSubCategory: "", image: "/KY1/18k 9-11gr/page_45_image_1.png" },
  
  // 19 GRAM
  { id: 81, ref: "KY1-19 GRAM", name: "19 GRAM", stock: 1, category: "KY1", subCategory: "19 GRAM", subSubCategory: "", image: "/KY1/19 GRAM/page_75_image_2.png" },
  
  // 19.30g
  { id: 82, ref: "KY1-19.30g", name: "19.30g", stock: 1, category: "KY1", subCategory: "19.30g", subSubCategory: "", image: "/KY1/19.30g/page_75_image_2.png" },
  
  // 19g
  { id: 83, ref: "KY1-19g", name: "19g", stock: 1, category: "KY1", subCategory: "19g", subSubCategory: "", image: "/KY1/19g/page_75_image_2.png" },
  
  // 20 GRAM
  { id: 84, ref: "KY1-20 GRAM", name: "20 GRAM", stock: 1, category: "KY1", subCategory: "20 GRAM", subSubCategory: "", image: "/KY1/20 GRAM/page_75_image_2.png" },
  
  // 20.5 GRAM
  { id: 85, ref: "KY1-20.5 GRAM", name: "20.5 GRAM", stock: 1, category: "KY1", subCategory: "20.5 GRAM", subSubCategory: "", image: "/KY1/20.5 GRAM/page_75_image_2.png" },
  
  // 20g
  { id: 86, ref: "KY1-20g", name: "20g", stock: 1, category: "KY1", subCategory: "20g", subSubCategory: "", image: "/KY1/20g/page_75_image_2.png" },
  
  // 21 GRAM
  { id: 87, ref: "KY1-21 GRAM", name: "21 GRAM", stock: 1, category: "KY1", subCategory: "21 GRAM", subSubCategory: "", image: "/KY1/21 GRAM/page_75_image_2.png" },
  
  // 21.10g
  { id: 88, ref: "KY1-21.10g", name: "21.10g", stock: 1, category: "KY1", subCategory: "21.10g", subSubCategory: "", image: "/KY1/21.10g/page_75_image_2.png" },
  
  // 21g
  { id: 89, ref: "KY1-21g", name: "21g", stock: 1, category: "KY1", subCategory: "21g", subSubCategory: "", image: "/KY1/21g/page_75_image_2.png" },
  
  // 23 GRAM
  { id: 90, ref: "KY1-23 GRAM", name: "23 GRAM", stock: 1, category: "KY1", subCategory: "23 GRAM", subSubCategory: "", image: "/KY1/23 GRAM/page_75_image_2.png" },
  
  // 24 GRAM
  { id: 91, ref: "KY1-24 GRAM", name: "24 GRAM", stock: 1, category: "KY1", subCategory: "24 GRAM", subSubCategory: "", image: "/KY1/24 GRAM/page_75_image_2.png" },
  
  // 25 GRAM
  { id: 92, ref: "KY1-25 GRAM", name: "25 GRAM", stock: 1, category: "KY1", subCategory: "25 GRAM", subSubCategory: "", image: "/KY1/25 GRAM/page_75_image_2.png" },
  
  // 28 GRAM
  { id: 93, ref: "KY1-28 GRAM", name: "28 GRAM", stock: 1, category: "KY1", subCategory: "28 GRAM", subSubCategory: "", image: "/KY1/28 GRAM/page_75_image_2.png" },
  
  // 29 GRAM
  { id: 94, ref: "KY1-29 GRAM", name: "29 GRAM", stock: 1, category: "KY1", subCategory: "29 GRAM", subSubCategory: "", image: "/KY1/29 GRAM/page_75_image_2.png" },
  
  // 30 GRAM
  { id: 95, ref: "KY1-30 GRAM", name: "30 GRAM", stock: 1, category: "KY1", subCategory: "30 GRAM", subSubCategory: "", image: "/KY1/30 GRAM/page_75_image_2.png" },
  
  // 31 GRAM
  { id: 96, ref: "KY1-31 GRAM", name: "31 GRAM", stock: 1, category: "KY1", subCategory: "31 GRAM", subSubCategory: "", image: "/KY1/31 GRAM/page_75_image_2.png" },
  
  // 34 GRAM
  { id: 97, ref: "KY1-34 GRAM", name: "34 GRAM", stock: 1, category: "KY1", subCategory: "34 GRAM", subSubCategory: "", image: "/KY1/34 GRAM/page_75_image_2.png" },
  
  // 35-40 GRAM
  { id: 98, ref: "KY1-35-40 GRAM", name: "35-40 GRAM", stock: 1, category: "KY1", subCategory: "35-40 GRAM", subSubCategory: "", image: "/KY1/35-40 GRAM/page_75_image_2.png" },
  
  // 35g
  { id: 99, ref: "KY1-35g", name: "35g", stock: 1, category: "KY1", subCategory: "35g", subSubCategory: "", image: "/KY1/35g/page_75_image_2.png" },
  
  // 36g
  { id: 100, ref: "KY1-36g", name: "36g", stock: 1, category: "KY1", subCategory: "36g", subSubCategory: "", image: "/KY1/36g/page_75_image_2.png" },
  
  // 38 GRAM
  { id: 101, ref: "KY1-38 GRAM", name: "38 GRAM", stock: 1, category: "KY1", subCategory: "38 GRAM", subSubCategory: "", image: "/KY1/38 GRAM/page_75_image_2.png" },

  // ==================== KY2 ====================
  // KY2: Sous-catégorie = poids, Sous-sous-catégorie = millimétrage
  
  // 7 GRAM - 4 mm
  { id: 102, ref: "KY2-7 GRAM-4 mm", name: "7 GRAM - 4 mm", stock: 1, category: "KY2", subCategory: "7 GRAM", subSubCategory: "4 mm", image: "/KY2/7 GRAM/4 mm/page_84_image_2 4mm 7gr.png" },
  
  // 7-8 GRAM
  { id: 103, ref: "KY2-7-8 GRAM", name: "7-8 GRAM", stock: 1, category: "KY2", subCategory: "7-8 GRAM", subSubCategory: "", image: "/KY2/7-8 GRAM/page_74_image_1 4mm-10 gr.png" },
  
  // 7.5 GRAM
  { id: 104, ref: "KY2-7.5 GRAM", name: "7.5 GRAM", stock: 1, category: "KY2", subCategory: "7.5 GRAM", subSubCategory: "", image: "/KY2/7.5 GRAM/page_74_image_1 4mm-10 gr.png" },
  
  // 7.7-8.5 GRAM
  { id: 105, ref: "KY2-7.7-8.5 GRAM", name: "7.7-8.5 GRAM", stock: 1, category: "KY2", subCategory: "7.7-8.5 GRAM", subSubCategory: "", image: "/KY2/7.7-8.5 GRAM/page_74_image_1 4mm-10 gr.png" },
  
  // 8 GRAM
  { id: 106, ref: "KY2-8 GRAM", name: "8 GRAM", stock: 1, category: "KY2", subCategory: "8 GRAM", subSubCategory: "", image: "/KY2/8 GRAM/page_74_image_1 4mm-10 gr.png" },
  
  // 8.5 GRAM
  { id: 107, ref: "KY2-8.5 GRAM", name: "8.5 GRAM", stock: 1, category: "KY2", subCategory: "8.5 GRAM", subSubCategory: "", image: "/KY2/8.5 GRAM/page_74_image_1 4mm-10 gr.png" },
  
  // 8.5-9.5 GRAM
  { id: 108, ref: "KY2-8.5-9.5 GRAM", name: "8.5-9.5 GRAM", stock: 1, category: "KY2", subCategory: "8.5-9.5 GRAM", subSubCategory: "", image: "/KY2/8.5-9.5 GRAM/page_74_image_1 4mm-10 gr.png" },
  
  // 9 GRAM
  { id: 109, ref: "KY2-9 GRAM", name: "9 GRAM", stock: 1, category: "KY2", subCategory: "9 GRAM", subSubCategory: "", image: "/KY2/9 GRAM/page_74_image_1 4mm-10 gr.png" },
  
  // 9-11 GRAM
  { id: 110, ref: "KY2-9-11 GRAM", name: "9-11 GRAM", stock: 1, category: "KY2", subCategory: "9-11 GRAM", subSubCategory: "", image: "/KY2/9-11 GRAM/page_74_image_1 4mm-10 gr.png" },
  
  // 9.5 GRAM
  { id: 111, ref: "KY2-9.5 GRAM", name: "9.5 GRAM", stock: 1, category: "KY2", subCategory: "9.5 GRAM", subSubCategory: "", image: "/KY2/9.5 GRAM/page_74_image_1 4mm-10 gr.png" },
  
  // 10 GRAM - 4 mm
  { id: 112, ref: "KY2-10 GRAM-4 mm", name: "10 GRAM - 4 mm", stock: 1, category: "KY2", subCategory: "10 GRAM", subSubCategory: "4 mm", image: "/KY2/10 GRAM/4 mm/page_74_image_1 4mm-10 gr.png" },
  
  // 10 GRAM - 4.5 mm
  { id: 113, ref: "KY2-10 GRAM-4.5 mm", name: "10 GRAM - 4.5 mm", stock: 1, category: "KY2", subCategory: "10 GRAM", subSubCategory: "4.5 mm", image: "/KY2/10 GRAM/4.5 mm/page_74_image_1 4mm-10 gr.png" },
  
  // 10 GRAM - 7.5 mm
  { id: 114, ref: "KY2-10 GRAM-7.5 mm", name: "10 GRAM - 7.5 mm", stock: 1, category: "KY2", subCategory: "10 GRAM", subSubCategory: "7.5 mm", image: "/KY2/10 GRAM/7.5 mm/page_74_image_1 4mm-10 gr.png" },
  
  // 10-11 GRAM
  { id: 115, ref: "KY2-10-11 GRAM", name: "10-11 GRAM", stock: 1, category: "KY2", subCategory: "10-11 GRAM", subSubCategory: "", image: "/KY2/10-11 GRAM/page_74_image_1 4mm-10 gr.png" },
  
  // 10-12 GRAM
  { id: 116, ref: "KY2-10-12 GRAM", name: "10-12 GRAM", stock: 1, category: "KY2", subCategory: "10-12 GRAM", subSubCategory: "", image: "/KY2/10-12 GRAM/page_74_image_1 4mm-10 gr.png" },
  
  // 10.5 GRAM
  { id: 117, ref: "KY2-10.5 GRAM", name: "10.5 GRAM", stock: 1, category: "KY2", subCategory: "10.5 GRAM", subSubCategory: "", image: "/KY2/10.5 GRAM/page_74_image_1 4mm-10 gr.png" },
  
  // 11 GRAM
  { id: 118, ref: "KY2-11 GRAM", name: "11 GRAM", stock: 1, category: "KY2", subCategory: "11 GRAM", subSubCategory: "", image: "/KY2/11 GRAM/page_74_image_1 4mm-10 gr.png" },
  
  // 11.50 GRAM
  { id: 119, ref: "KY2-11.50 GRAM", name: "11.50 GRAM", stock: 1, category: "KY2", subCategory: "11.50 GRAM", subSubCategory: "", image: "/KY2/11.50 GRAM/page_74_image_1 4mm-10 gr.png" },
  
  // 11.80 GRAM
  { id: 120, ref: "KY2-11.80 GRAM", name: "11.80 GRAM", stock: 1, category: "KY2", subCategory: "11.80 GRAM", subSubCategory: "", image: "/KY2/11.80 GRAM/page_74_image_1 4mm-10 gr.png" },
  
  // 12 GRAM
  { id: 121, ref: "KY2-12 GRAM", name: "12 GRAM", stock: 1, category: "KY2", subCategory: "12 GRAM", subSubCategory: "", image: "/KY2/12 GRAM/page_74_image_1 4mm-10 gr.png" },
  
  // 12-15 GRAM
  { id: 122, ref: "KY2-12-15 GRAM", name: "12-15 GRAM", stock: 1, category: "KY2", subCategory: "12-15 GRAM", subSubCategory: "", image: "/KY2/12-15 GRAM/page_74_image_1 4mm-10 gr.png" },
  
  // 13 GRAM
  { id: 123, ref: "KY2-13 GRAM", name: "13 GRAM", stock: 1, category: "KY2", subCategory: "13 GRAM", subSubCategory: "", image: "/KY2/13 GRAM/page_74_image_1 4mm-10 gr.png" },
  
  // 13-15 GRAM
  { id: 124, ref: "KY2-13-15 GRAM", name: "13-15 GRAM", stock: 1, category: "KY2", subCategory: "13-15 GRAM", subSubCategory: "", image: "/KY2/13-15 GRAM/page_74_image_1 4mm-10 gr.png" },
  
  // 13-16 GRAM
  { id: 125, ref: "KY2-13-16 GRAM", name: "13-16 GRAM", stock: 1, category: "KY2", subCategory: "13-16 GRAM", subSubCategory: "", image: "/KY2/13-16 GRAM/page_74_image_1 4mm-10 gr.png" },
  
  // 13-17 GRAM
  { id: 126, ref: "KY2-13-17 GRAM", name: "13-17 GRAM", stock: 1, category: "KY2", subCategory: "13-17 GRAM", subSubCategory: "", image: "/KY2/13-17 GRAM/page_74_image_1 4mm-10 gr.png" },
  
  // 13.5 GRAM
  { id: 127, ref: "KY2-13.5 GRAM", name: "13.5 GRAM", stock: 1, category: "KY2", subCategory: "13.5 GRAM", subSubCategory: "", image: "/KY2/13.5 GRAM/page_74_image_1 4mm-10 gr.png" },
  
  // 14 GRAM
  { id: 128, ref: "KY2-14 GRAM", name: "14 GRAM", stock: 1, category: "KY2", subCategory: "14 GRAM", subSubCategory: "", image: "/KY2/14 GRAM/page_74_image_1 4mm-10 gr.png" },
  
  // 14-15 GRAM
  { id: 129, ref: "KY2-14-15 GRAM", name: "14-15 GRAM", stock: 1, category: "KY2", subCategory: "14-15 GRAM", subSubCategory: "", image: "/KY2/14-15 GRAM/page_74_image_1 4mm-10 gr.png" },
  
  // 14-16 GRAM
  { id: 130, ref: "KY2-14-16 GRAM", name: "14-16 GRAM", stock: 1, category: "KY2", subCategory: "14-16 GRAM", subSubCategory: "", image: "/KY2/14-16 GRAM/page_74_image_1 4mm-10 gr.png" },
  
  // 14.5 gram
  { id: 131, ref: "KY2-14.5 gram", name: "14.5 gram", stock: 1, category: "KY2", subCategory: "14.5 gram", subSubCategory: "", image: "/KY2/14.5 gram/page_74_image_1 4mm-10 gr.png" },
  
  // 15 GRAM - 6mm
  { id: 132, ref: "KY2-15 GRAM-6mm", name: "15 GRAM - 6mm", stock: 1, category: "KY2", subCategory: "15 GRAM", subSubCategory: "6mm", image: "/KY2/15 GRAM/6mm/page_84_image_5 6mm 15gr.png" },
  
  // 15 GRAM - 7mm
  { id: 133, ref: "KY2-15 GRAM-7mm", name: "15 GRAM - 7mm", stock: 1, category: "KY2", subCategory: "15 GRAM", subSubCategory: "7mm", image: "/KY2/15 GRAM/7mm/page_15_image_3 15 gr.png" },
  
  // 15 GRAM - 9 mm
  { id: 134, ref: "KY2-15 GRAM-9 mm", name: "15 GRAM - 9 mm", stock: 1, category: "KY2", subCategory: "15 GRAM", subSubCategory: "9 mm", image: "/KY2/15 GRAM/9 mm/page_16_image_1 15 gr.png" },
  
  // 15-16 GRAM
  { id: 135, ref: "KY2-15-16 GRAM", name: "15-16 GRAM", stock: 1, category: "KY2", subCategory: "15-16 GRAM", subSubCategory: "", image: "/KY2/15-16 GRAM/page_74_image_1 4mm-10 gr.png" },
  
  // 15-18 GRAM
  { id: 136, ref: "KY2-15-18 GRAM", name: "15-18 GRAM", stock: 1, category: "KY2", subCategory: "15-18 GRAM", subSubCategory: "", image: "/KY2/15-18 GRAM/page_74_image_1 4mm-10 gr.png" },
  
  // 15.5 GRAM
  { id: 137, ref: "KY2-15.5 GRAM", name: "15.5 GRAM", stock: 1, category: "KY2", subCategory: "15.5 GRAM", subSubCategory: "", image: "/KY2/15.5 GRAM/page_74_image_1 4mm-10 gr.png" },
  
  // 16 GRAM
  { id: 138, ref: "KY2-16 GRAM", name: "16 GRAM", stock: 1, category: "KY2", subCategory: "16 GRAM", subSubCategory: "", image: "/KY2/16 GRAM/page_74_image_1 4mm-10 gr.png" },
  
  // 16-19 GRAM
  { id: 139, ref: "KY2-16-19 GRAM", name: "16-19 GRAM", stock: 1, category: "KY2", subCategory: "16-19 GRAM", subSubCategory: "", image: "/KY2/16-19 GRAM/page_74_image_1 4mm-10 gr.png" },
  
  // 16.5 GRAM
  { id: 140, ref: "KY2-16.5 GRAM", name: "16.5 GRAM", stock: 1, category: "KY2", subCategory: "16.5 GRAM", subSubCategory: "", image: "/KY2/16.5 GRAM/page_74_image_1 4mm-10 gr.png" },
  
  // 17 GRAM
  { id: 141, ref: "KY2-17 GRAM", name: "17 GRAM", stock: 1, category: "KY2", subCategory: "17 GRAM", subSubCategory: "", image: "/KY2/17 GRAM/page_74_image_1 4mm-10 gr.png" },
  
  // 17-19 GRAM
  { id: 142, ref: "KY2-17-19 GRAM", name: "17-19 GRAM", stock: 1, category: "KY2", subCategory: "17-19 GRAM", subSubCategory: "", image: "/KY2/17-19 GRAM/page_74_image_1 4mm-10 gr.png" },
  
  // 18 GRAM
  { id: 143, ref: "KY2-18 GRAM", name: "18 GRAM", stock: 1, category: "KY2", subCategory: "18 GRAM", subSubCategory: "", image: "/KY2/18 GRAM/page_74_image_1 4mm-10 gr.png" },
  
  // 18-20 GRAM
  { id: 144, ref: "KY2-18-20 GRAM", name: "18-20 GRAM", stock: 1, category: "KY2", subCategory: "18-20 GRAM", subSubCategory: "", image: "/KY2/18-20 GRAM/page_74_image_1 4mm-10 gr.png" },
  
  // 18k 14-17 gram
  { id: 145, ref: "KY2-18k 14-17 gram", name: "18k 14-17 gram", stock: 1, category: "KY2", subCategory: "18k 14-17 gram", subSubCategory: "", image: "/KY2/18k 14-17 gram/page_74_image_1 4mm-10 gr.png" },
  
  // 19 GRAM
  { id: 146, ref: "KY2-19 GRAM", name: "19 GRAM", stock: 1, category: "KY2", subCategory: "19 GRAM", subSubCategory: "", image: "/KY2/19 GRAM/page_74_image_1 4mm-10 gr.png" },
  
  // 20 GRAM
  { id: 147, ref: "KY2-20 GRAM", name: "20 GRAM", stock: 1, category: "KY2", subCategory: "20 GRAM", subSubCategory: "", image: "/KY2/20 GRAM/page_74_image_1 4mm-10 gr.png" },
  
  // 21 GRAM
  { id: 148, ref: "KY2-21 GRAM", name: "21 GRAM", stock: 1, category: "KY2", subCategory: "21 GRAM", subSubCategory: "", image: "/KY2/21 GRAM/page_74_image_1 4mm-10 gr.png" },
  
  // 22 GRAM
  { id: 149, ref: "KY2-22 GRAM", name: "22 GRAM", stock: 1, category: "KY2", subCategory: "22 GRAM", subSubCategory: "", image: "/KY2/22 GRAM/page_74_image_1 4mm-10 gr.png" },
  
  // 22-24 GRAM
  { id: 150, ref: "KY2-22-24 GRAM", name: "22-24 GRAM", stock: 1, category: "KY2", subCategory: "22-24 GRAM", subSubCategory: "", image: "/KY2/22-24 GRAM/page_74_image_1 4mm-10 gr.png" },
  
  // 23 GRAM
  { id: 151, ref: "KY2-23 GRAM", name: "23 GRAM", stock: 1, category: "KY2", subCategory: "23 GRAM", subSubCategory: "", image: "/KY2/23 GRAM/page_74_image_1 4mm-10 gr.png" },
  
  // 24 GRAM
  { id: 152, ref: "KY2-24 GRAM", name: "24 GRAM", stock: 1, category: "KY2", subCategory: "24 GRAM", subSubCategory: "", image: "/KY2/24 GRAM/page_74_image_1 4mm-10 gr.png" },
  
  // 25 GRAM
  { id: 153, ref: "KY2-25 GRAM", name: "25 GRAM", stock: 1, category: "KY2", subCategory: "25 GRAM", subSubCategory: "", image: "/KY2/25 GRAM/page_74_image_1 4mm-10 gr.png" },
  
  // 26 GRAM
  { id: 154, ref: "KY2-26 GRAM", name: "26 GRAM", stock: 1, category: "KY2", subCategory: "26 GRAM", subSubCategory: "", image: "/KY2/26 GRAM/page_74_image_1 4mm-10 gr.png" },
  
  // 28-30 GRAM
  { id: 155, ref: "KY2-28-30 GRAM", name: "28-30 GRAM", stock: 1, category: "KY2", subCategory: "28-30 GRAM", subSubCategory: "", image: "/KY2/28-30 GRAM/page_74_image_1 4mm-10 gr.png" },
  
  // 28-33 GRAM
  { id: 156, ref: "KY2-28-33 GRAM", name: "28-33 GRAM", stock: 1, category: "KY2", subCategory: "28-33 GRAM", subSubCategory: "", image: "/KY2/28-33 GRAM/page_74_image_1 4mm-10 gr.png" },
  
  // 29 GRAM
  { id: 157, ref: "KY2-29 GRAM", name: "29 GRAM", stock: 1, category: "KY2", subCategory: "29 GRAM", subSubCategory: "", image: "/KY2/29 GRAM/page_74_image_1 4mm-10 gr.png" },
  
  // 29-30 GRAM
  { id: 158, ref: "KY2-29-30 GRAM", name: "29-30 GRAM", stock: 1, category: "KY2", subCategory: "29-30 GRAM", subSubCategory: "", image: "/KY2/29-30 GRAM/page_74_image_1 4mm-10 gr.png" },
  
  // 31 GRAM
  { id: 159, ref: "KY2-31 GRAM", name: "31 GRAM", stock: 1, category: "KY2", subCategory: "31 GRAM", subSubCategory: "", image: "/KY2/31 GRAM/page_74_image_1 4mm-10 gr.png" },

  // ==================== GURMET ====================
  // GURMET: Chaque dossier = une sous-catégorie (type de bijou)
  
  // AJE
  { id: 160, ref: "GURMET-AJE", name: "AJE", stock: 1, category: "GURMET", subCategory: "AJE", subSubCategory: "", image: "/gurmet/AJE/page_30_bijou_2.png" },
  
  // AJF
  { id: 161, ref: "GURMET-AJF", name: "AJF", stock: 1, category: "GURMET", subCategory: "AJF", subSubCategory: "", image: "/gurmet/AJF/page_30_bijou_2.png" },
  
  // AJG
  { id: 162, ref: "GURMET-AJG", name: "AJG", stock: 1, category: "GURMET", subCategory: "AJG", subSubCategory: "", image: "/gurmet/AJG/page_30_bijou_2.png" },
  
  // BEND 7-9-11-13-15 mm
  { id: 163, ref: "GURMET-BEND 7-9-11-13-15 mm", name: "BEND 7-9-11-13-15 mm", stock: 1, category: "GURMET", subCategory: "BEND 7-9-11-13-15 mm", subSubCategory: "", image: "/gurmet/BEND 7-9-11-13-15 mm/page_30_bijou_2.png" },
  
  // EDGE 7-9-11-13-15-19 mm
  { id: 164, ref: "GURMET-EDGE 7-9-11-13-15-19 mm", name: "EDGE 7-9-11-13-15-19 mm", stock: 1, category: "GURMET", subCategory: "EDGE 7-9-11-13-15-19 mm", subSubCategory: "", image: "/gurmet/EDGE 7-9-11-13-15-19 mm/page_30_bijou_2.png" },
  
  // FGR 10 mm 19-22 1.100-1.10mm
  { id: 165, ref: "GURMET-FGR 10 mm 19-22 1.100-1.10mm", name: "FGR 10 mm 19-22 1.100-1.10mm", stock: 1, category: "GURMET", subCategory: "FGR 10 mm 19-22 1.100-1.10mm", subSubCategory: "", image: "/gurmet/FGR 10 mm 19-22 1.100-1.10mm/page_30_bijou_2.png" },
  
  // FGR 12 mm 23-25 Gram 1.20-1.30 mm
  { id: 166, ref: "GURMET-FGR 12 mm 23-25 Gram 1.20-1.30 mm", name: "FGR 12 mm 23-25 Gram 1.20-1.30 mm", stock: 1, category: "GURMET", subCategory: "FGR 12 mm 23-25 Gram 1.20-1.30 mm", subSubCategory: "", image: "/gurmet/FGR 12 mm 23-25 Gram 1.20-1.30 mm/page_30_bijou_2.png" },
  
  // FGR 6mm 10-12 Gram 1.10 mm
  { id: 167, ref: "GURMET-FGR 6mm 10-12 Gram 1.10 mm", name: "FGR 6mm 10-12 Gram 1.10 mm", stock: 1, category: "GURMET", subCategory: "FGR 6mm 10-12 Gram 1.10 mm", subSubCategory: "", image: "/gurmet/FGR 6mm 10-12 Gram 1.10 mm/page_30_bijou_2.png" },
  
  // FGR 8mm 15-16 1.10-1.30 mm
  { id: 168, ref: "GURMET-FGR 8mm 15-16 1.10-1.30 mm", name: "FGR 8mm 15-16 1.10-1.30 mm", stock: 1, category: "GURMET", subCategory: "FGR 8mm 15-16 1.10-1.30 mm", subSubCategory: "", image: "/gurmet/FGR 8mm 15-16 1.10-1.30 mm/page_30_bijou_2.png" },
  
  // FIGARO BUYUK
  { id: 169, ref: "GURMET-FIGARO BUYUK", name: "FIGARO BUYUK", stock: 1, category: "GURMET", subCategory: "FIGARO BUYUK", subSubCategory: "", image: "/gurmet/FIGARO BUYUK/page_30_bijou_2.png" },
  
  // FST 7-9-11-13-15-17-19 mm
  { id: 170, ref: "GURMET-FST 7-9-11-13-15-17-19 mm", name: "FST 7-9-11-13-15-17-19 mm", stock: 1, category: "GURMET", subCategory: "FST 7-9-11-13-15-17-19 mm", subSubCategory: "", image: "/gurmet/FST 7-9-11-13-15-17-19 mm/page_30_bijou_2.png" },
  
  // FSTY
  { id: 171, ref: "GURMET-FSTY", name: "FSTY", stock: 1, category: "GURMET", subCategory: "FSTY", subSubCategory: "", image: "/gurmet/FSTY/page_30_bijou_2.png" },
  
  // FZYN
  { id: 172, ref: "GURMET-FZYN", name: "FZYN", stock: 1, category: "GURMET", subCategory: "FZYN", subSubCategory: "", image: "/gurmet/FZYN/page_30_bijou_2.png" },
  
  // G
  { id: 173, ref: "GURMET-G", name: "G", stock: 1, category: "GURMET", subCategory: "G", subSubCategory: "", image: "/gurmet/G/page_35_bijou_3.png" },
  
  // GFST
  { id: 174, ref: "GURMET-GFST", name: "GFST", stock: 1, category: "GURMET", subCategory: "GFST", subSubCategory: "", image: "/gurmet/GFST/page_30_bijou_2.png" },
  
  // GFST 7mm 11-13
  { id: 175, ref: "GURMET-GFST 7mm 11-13", name: "GFST 7mm 11-13", stock: 1, category: "GURMET", subCategory: "GFST 7mm 11-13", subSubCategory: "", image: "/gurmet/GFST 7mm 11-13/page_30_bijou_2.png" },
  
  // GRMT 11m 24-18 gram 18k 1.10-1.20 Stone
  { id: 176, ref: "GURMET-GRMT 11m 24-18 gram 18k 1.10-1.20 Stone", name: "GRMT 11m 24-18 gram 18k 1.10-1.20 Stone", stock: 1, category: "GURMET", subCategory: "GRMT 11m 24-18 gram 18k 1.10-1.20 Stone", subSubCategory: "", image: "/gurmet/GRMT 11m 24-18 gram 18k 1.10-1.20 Stone/page_2_bijou_4.png" },
  
  // GRMT 13 mm 28-32 Gram 18k 1.10-1.20 Stone
  { id: 177, ref: "GURMET-GRMT 13 mm 28-32 Gram 18k 1.10-1.20 Stone", name: "GRMT 13 mm 28-32 Gram 18k 1.10-1.20 Stone", stock: 1, category: "GURMET", subCategory: "GRMT 13 mm 28-32 Gram 18k 1.10-1.20 Stone", subSubCategory: "", image: "/gurmet/GRMT 13 mm 28-32 Gram 18k 1.10-1.20 Stone/page_2_bijou_4.png" },
  
  // GRMT 15mm 34-38 Gram 1-1.10 mm Stone
  { id: 178, ref: "GURMET-GRMT 15mm 34-38 Gram 1-1.10 mm Stone", name: "GRMT 15mm 34-38 Gram 1-1.10 mm Stone", stock: 1, category: "GURMET", subCategory: "GRMT 15mm 34-38 Gram 1-1.10 mm Stone", subSubCategory: "", image: "/gurmet/GRMT 15mm 34-38 Gram 1-1.10 mm Stone/page_2_bijou_4.png" },
  
  // GRMT 7mm 13-16 gr
  { id: 179, ref: "GURMET-GRMT 7mm 13-16 gr", name: "GRMT 7mm 13-16 gr", stock: 1, category: "GURMET", subCategory: "GRMT 7mm 13-16 gr", subSubCategory: "", image: "/gurmet/GRMT 7mm 13-16 gr/page_2_bijou_4.png" },
  
  // GRMT 9mm 18-21 gr 1.10-1.20 Stone
  { id: 180, ref: "GURMET-GRMT 9mm 18-21 gr 1.10-1.20 Stone", name: "GRMT 9mm 18-21 gr 1.10-1.20 Stone", stock: 1, category: "GURMET", subCategory: "GRMT 9mm 18-21 gr 1.10-1.20 Stone", subSubCategory: "", image: "/gurmet/GRMT 9mm 18-21 gr 1.10-1.20 Stone/page_2_bijou_4.png" },
  
  // HLT
  { id: 181, ref: "GURMET-HLT", name: "HLT", stock: 1, category: "GURMET", subCategory: "HLT", subSubCategory: "", image: "/gurmet/HLT/page_30_bijou_2.png" },
  
  // infinity
  { id: 182, ref: "GURMET-infinity", name: "infinity", stock: 1, category: "GURMET", subCategory: "infinity", subSubCategory: "", image: "/gurmet/infinity/page_30_bijou_2.png" },
  
  // KGM
  { id: 183, ref: "GURMET-KGM", name: "KGM", stock: 1, category: "GURMET", subCategory: "KGM", subSubCategory: "", image: "/gurmet/KGM/page_30_bijou_2.png" },
  
  // MERA
  { id: 184, ref: "GURMET-MERA", name: "MERA", stock: 1, category: "GURMET", subCategory: "MERA", subSubCategory: "", image: "/gurmet/MERA/page_30_bijou_2.png" },
  
  // MNC
  { id: 185, ref: "GURMET-MNC", name: "MNC", stock: 1, category: "GURMET", subCategory: "MNC", subSubCategory: "", image: "/gurmet/MNC/page_30_bijou_2.png" },
  
  // PRZ
  { id: 186, ref: "GURMET-PRZ", name: "PRZ", stock: 1, category: "GURMET", subCategory: "PRZ", subSubCategory: "", image: "/gurmet/PRZ/page_30_bijou_2.png" },
  
  // RONDO
  { id: 187, ref: "GURMET-RONDO", name: "RONDO", stock: 1, category: "GURMET", subCategory: "RONDO", subSubCategory: "", image: "/gurmet/RONDO/page_30_bijou_2.png" },
  
  // SBEND 7-14 mm 16 gram
  { id: 188, ref: "GURMET-SBEND 7-14 mm 16 gram", name: "SBEND 7-14 mm 16 gram", stock: 1, category: "GURMET", subCategory: "SBEND 7-14 mm 16 gram", subSubCategory: "", image: "/gurmet/SBEND 7-14 mm 16 gram/page_30_bijou_2.png" },
  
  // SBLK
  { id: 189, ref: "GURMET-SBLK", name: "SBLK", stock: 1, category: "GURMET", subCategory: "SBLK", subSubCategory: "", image: "/gurmet/SBLK/page_30_bijou_2.png" },
  
  // SFST 8-14 mm 20 GRAM
  { id: 190, ref: "GURMET-SFST 8-14 mm 20 GRAM", name: "SFST 8-14 mm 20 GRAM", stock: 1, category: "GURMET", subCategory: "SFST 8-14 mm 20 GRAM", subSubCategory: "", image: "/gurmet/SFST 8-14 mm 20 GRAM/page_30_bijou_2.png" },
  
  // SHADE 7-9-11-13 mm
  { id: 191, ref: "GURMET-SHADE 7-9-11-13 mm", name: "SHADE 7-9-11-13 mm", stock: 1, category: "GURMET", subCategory: "SHADE 7-9-11-13 mm", subSubCategory: "", image: "/gurmet/SHADE 7-9-11-13 mm/page_30_bijou_2.png" },
  
  // SZM  14-15 gr 6mm14 mm
  { id: 192, ref: "GURMET-SZM  14-15 gr 6mm14 mm", name: "SZM  14-15 gr 6mm14 mm", stock: 1, category: "GURMET", subCategory: "SZM  14-15 gr 6mm14 mm", subSubCategory: "", image: "/gurmet/SZM  14-15 gr 6mm14 mm/page_30_bijou_2.png" },
  
  // TF
  { id: 193, ref: "GURMET-TF", name: "TF", stock: 1, category: "GURMET", subCategory: "TF", subSubCategory: "", image: "/gurmet/TF/page_30_bijou_2.png" },
];

// Extraire les catégories depuis les produits
export const extractCategories = (products) => {
  const categories = new Set();
  const subCategories = {};
  const subSubCategories = {};

  products.forEach(p => {
    categories.add(p.category);
    if (!subCategories[p.category]) {
      subCategories[p.category] = new Set();
    }
    if (p.subCategory) {
      subCategories[p.category].add(p.subCategory);
    }
    if (!subSubCategories[p.category]) {
      subSubCategories[p.category] = {};
    }
    if (p.subCategory && p.subSubCategory) {
      if (!subSubCategories[p.category][p.subCategory]) {
        subSubCategories[p.category][p.subCategory] = new Set();
      }
      subSubCategories[p.category][p.subCategory].add(p.subSubCategory);
    }
  });

  return {
    categories: Array.from(categories).sort(),
    subCategories: Object.fromEntries(
      Object.entries(subCategories).map(([k, v]) => [k, Array.from(v).sort()])
    ),
    subSubCategories: Object.fromEntries(
      Object.entries(subSubCategories).map(([k, v]) => [
        k,
        Object.fromEntries(
          Object.entries(v).map(([sk, sv]) => [sk, Array.from(sv).filter(Boolean).sort()])
        )
      ])
    )
  };
};

export const { categories, subCategories, subSubCategories } = extractCategories(PRODUCTS_DATA);
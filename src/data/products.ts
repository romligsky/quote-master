import { Product, Trade } from "@/types/quote";

export const electricianProducts: Product[] = [
  { id: "e1", name: "Tableau électrique 13 modules", category: "Tableaux", unitPrice: 245, unit: "unité", trade: "electrician" },
  { id: "e2", name: "Tableau électrique 26 modules", category: "Tableaux", unitPrice: 385, unit: "unité", trade: "electrician" },
  { id: "e3", name: "Interrupteur différentiel 40A 30mA", category: "Protection", unitPrice: 89, unit: "unité", trade: "electrician" },
  { id: "e4", name: "Disjoncteur 16A", category: "Protection", unitPrice: 12, unit: "unité", trade: "electrician" },
  { id: "e5", name: "Disjoncteur 20A", category: "Protection", unitPrice: 14, unit: "unité", trade: "electrician" },
  { id: "e6", name: "Disjoncteur 32A", category: "Protection", unitPrice: 18, unit: "unité", trade: "electrician" },
  { id: "e7", name: "Prise électrique 16A", category: "Appareillage", unitPrice: 8, unit: "unité", trade: "electrician" },
  { id: "e8", name: "Interrupteur simple", category: "Appareillage", unitPrice: 6, unit: "unité", trade: "electrician" },
  { id: "e9", name: "Interrupteur va-et-vient", category: "Appareillage", unitPrice: 9, unit: "unité", trade: "electrician" },
  { id: "e10", name: "Spot LED encastrable", category: "Éclairage", unitPrice: 25, unit: "unité", trade: "electrician" },
  { id: "e11", name: "Câble R2V 3G2.5", category: "Câbles", unitPrice: 2.5, unit: "mètre", trade: "electrician" },
  { id: "e12", name: "Câble R2V 3G6", category: "Câbles", unitPrice: 4.5, unit: "mètre", trade: "electrician" },
  { id: "e13", name: "Gaine ICTA 20mm", category: "Câbles", unitPrice: 0.8, unit: "mètre", trade: "electrician" },
  { id: "e14", name: "Boîte de dérivation", category: "Accessoires", unitPrice: 3, unit: "unité", trade: "electrician" },
  { id: "e15", name: "Prise RJ45 Cat6", category: "Appareillage", unitPrice: 18, unit: "unité", trade: "electrician" },
];

export const carpenterProducts: Product[] = [
  { id: "c1", name: "Porte intérieure standard", category: "Portes", unitPrice: 180, unit: "unité", trade: "carpenter" },
  { id: "c2", name: "Porte intérieure vitrée", category: "Portes", unitPrice: 280, unit: "unité", trade: "carpenter" },
  { id: "c3", name: "Bloc porte pré-peint", category: "Portes", unitPrice: 220, unit: "unité", trade: "carpenter" },
  { id: "c4", name: "Fenêtre PVC 1 vantail", category: "Fenêtres", unitPrice: 320, unit: "unité", trade: "carpenter" },
  { id: "c5", name: "Fenêtre PVC 2 vantaux", category: "Fenêtres", unitPrice: 480, unit: "unité", trade: "carpenter" },
  { id: "c6", name: "Porte-fenêtre PVC", category: "Fenêtres", unitPrice: 650, unit: "unité", trade: "carpenter" },
  { id: "c7", name: "Volet roulant manuel", category: "Volets", unitPrice: 280, unit: "unité", trade: "carpenter" },
  { id: "c8", name: "Volet roulant électrique", category: "Volets", unitPrice: 420, unit: "unité", trade: "carpenter" },
  { id: "c9", name: "Parquet stratifié", category: "Sols", unitPrice: 25, unit: "m²", trade: "carpenter" },
  { id: "c10", name: "Parquet contrecollé chêne", category: "Sols", unitPrice: 55, unit: "m²", trade: "carpenter" },
  { id: "c11", name: "Plinthe bois", category: "Finitions", unitPrice: 8, unit: "mètre", trade: "carpenter" },
  { id: "c12", name: "Étagère sur mesure", category: "Rangement", unitPrice: 120, unit: "mètre", trade: "carpenter" },
  { id: "c13", name: "Placard coulissant 2 portes", category: "Rangement", unitPrice: 850, unit: "unité", trade: "carpenter" },
  { id: "c14", name: "Escalier bois standard", category: "Escaliers", unitPrice: 2500, unit: "unité", trade: "carpenter" },
  { id: "c15", name: "Garde-corps bois", category: "Escaliers", unitPrice: 180, unit: "mètre", trade: "carpenter" },
];

export const webAgencyProducts: Product[] = [
  { id: "w1", name: "Site vitrine 1 page (landing)", category: "Création de site", unitPrice: 500, unit: "forfait", trade: "webagency" },
  { id: "w2", name: "Site vitrine 3-5 pages", category: "Création de site", unitPrice: 1200, unit: "forfait", trade: "webagency" },
  { id: "w3", name: "Site vitrine > 10 pages", category: "Création de site", unitPrice: 2500, unit: "forfait", trade: "webagency" },
  { id: "w4", name: "Site e-commerce (jusqu'à 50 produits)", category: "E-commerce", unitPrice: 2000, unit: "forfait", trade: "webagency" },
  { id: "w5", name: "Site e-commerce (jusqu'à 200 produits)", category: "E-commerce", unitPrice: 4000, unit: "forfait", trade: "webagency" },
  { id: "w6", name: "Site e-commerce (produits illimités)", category: "E-commerce", unitPrice: 7000, unit: "forfait", trade: "webagency" },
  { id: "w7", name: "Création logo", category: "Design", unitPrice: 350, unit: "forfait", trade: "webagency" },
  { id: "w8", name: "Charte graphique complète", category: "Design", unitPrice: 800, unit: "forfait", trade: "webagency" },
  { id: "w9", name: "Refonte graphique", category: "Design", unitPrice: 600, unit: "forfait", trade: "webagency" },
  { id: "w10", name: "Optimisation SEO on-page", category: "SEO & Marketing", unitPrice: 400, unit: "forfait", trade: "webagency" },
  { id: "w11", name: "Rédaction de contenu", category: "SEO & Marketing", unitPrice: 80, unit: "page", trade: "webagency" },
  { id: "w12", name: "Campagne Google Ads (setup)", category: "SEO & Marketing", unitPrice: 300, unit: "forfait", trade: "webagency" },
  { id: "w13", name: "Maintenance mensuelle", category: "Maintenance & Support", unitPrice: 50, unit: "mois", trade: "webagency" },
  { id: "w14", name: "Support technique (par heure)", category: "Maintenance & Support", unitPrice: 70, unit: "heure", trade: "webagency" },
  { id: "w15", name: "Mise à jour de contenu", category: "Maintenance & Support", unitPrice: 40, unit: "heure", trade: "webagency" },
  { id: "w16", name: "Hébergement annuel", category: "Hébergement & Domaine", unitPrice: 120, unit: "an", trade: "webagency" },
  { id: "w17", name: "Nom de domaine", category: "Hébergement & Domaine", unitPrice: 15, unit: "an", trade: "webagency" },
  { id: "w18", name: "Certificat SSL", category: "Hébergement & Domaine", unitPrice: 60, unit: "an", trade: "webagency" },
  { id: "w19", name: "Formulaire de contact avancé", category: "Fonctionnalités", unitPrice: 150, unit: "forfait", trade: "webagency" },
  { id: "w20", name: "Blog / actualités", category: "Fonctionnalités", unitPrice: 300, unit: "forfait", trade: "webagency" },
  { id: "w21", name: "Newsletter (setup)", category: "Fonctionnalités", unitPrice: 200, unit: "forfait", trade: "webagency" },
  { id: "w22", name: "Intégration API tierce", category: "Fonctionnalités", unitPrice: 500, unit: "forfait", trade: "webagency" },
  { id: "w23", name: "Formation CMS (Wordpress, etc.)", category: "Formation", unitPrice: 150, unit: "heure", trade: "webagency" },
];

export const getProductsByTrade = (trade: Trade): Product[] => {
  if (trade === "electrician") return electricianProducts;
  if (trade === "carpenter") return carpenterProducts;
  return webAgencyProducts;
};

export const getCategories = (trade: Trade): string[] => {
  const products = getProductsByTrade(trade);
  return [...new Set(products.map((p) => p.category))];
};

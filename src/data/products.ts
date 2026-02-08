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

export const getProductsByTrade = (trade: Trade): Product[] => {
  return trade === "electrician" ? electricianProducts : carpenterProducts;
};

export const getCategories = (trade: Trade): string[] => {
  const products = getProductsByTrade(trade);
  return [...new Set(products.map((p) => p.category))];
};

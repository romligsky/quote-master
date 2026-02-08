import { Quote, QuoteCalculations, QuoteItem } from "@/types/quote";

export const calculateQuote = (quote: Quote): QuoteCalculations => {
  // Sous-total produits
  const subtotalProducts = quote.items.reduce((sum, item) => sum + item.total, 0);
  
  // Coût main d'œuvre
  const laborCost = quote.laborHours * quote.laborRate;
  
  // Sous-total HT (avant marge)
  const subtotalHT = subtotalProducts + laborCost;
  
  // Marge
  const margin = subtotalHT * (quote.marginPercent / 100);
  
  // Sous-total avec marge
  const subtotalWithMargin = subtotalHT + margin;
  
  // Remise
  const discount = subtotalWithMargin * (quote.discountPercent / 100);
  
  // Total HT (après remise)
  const totalHT = subtotalWithMargin - discount;
  
  // TVA
  const tva = totalHT * (quote.tvaRate / 100);
  
  // Total TTC
  const totalTTC = totalHT + tva;
  
  return {
    subtotalProducts,
    laborCost,
    subtotalHT,
    margin,
    subtotalWithMargin,
    discount,
    totalHT,
    tva,
    totalTTC,
  };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
};

export const generateQuoteNumber = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
  return `DEV-${year}${month}-${random}`;
};

export const createEmptyQuote = (trade: "electrician" | "carpenter"): Quote => {
  const today = new Date();
  const validUntil = new Date(today);
  validUntil.setDate(validUntil.getDate() + 30);
  
  return {
    id: crypto.randomUUID(),
    number: generateQuoteNumber(),
    date: today.toISOString().split("T")[0],
    validUntil: validUntil.toISOString().split("T")[0],
    trade,
    client: {
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
    },
    items: [],
    laborHours: 0,
    laborRate: 45,
    marginPercent: 20,
    discountPercent: 0,
    tvaRate: 20,
    notes: "",
  };
};

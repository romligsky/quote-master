import { Quote, QuoteCalculations, QuoteSection, CompanyInfo } from "@/types/quote";

export const calculateQuote = (quote: Quote): QuoteCalculations => {
  // Sous-total produits (seulement les lignes incluses)
  const subtotalProducts = quote.items
    .filter(item => item.included)
    .reduce((sum, item) => sum + item.total, 0);
  
  // Coût main d'œuvre (toujours calculé si heures > 0)
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

export const createDefaultCompanyInfo = (): CompanyInfo => ({
  name: "Mon Entreprise",
  address: "",
  city: "",
  postalCode: "",
  phone: "",
  email: "",
  siret: "",
});

export const createDefaultSection = (name: string = "Prestations", order: number = 0): QuoteSection => ({
  id: crypto.randomUUID(),
  name,
  order,
});

export const createEmptyQuote = (trade: "electrician" | "carpenter"): Quote => {
  const today = new Date();
  const validUntil = new Date(today);
  validUntil.setDate(validUntil.getDate() + 30);
  
  // Try to load saved company info from localStorage
  let companyInfo = createDefaultCompanyInfo();
  try {
    const saved = localStorage.getItem("deviselec_company");
    if (saved) {
      companyInfo = JSON.parse(saved);
    }
  } catch (e) {
    console.error("Error loading company info:", e);
  }
  
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
    companyInfo,
    sections: [createDefaultSection("Travaux", 0)],
    items: [],
    laborHours: 0,
    laborRate: 45,
    laborVisible: true,
    marginPercent: 0,
    discountPercent: 0,
    tvaRate: 20,
    notes: "",
  };
};

export const saveCompanyInfo = (companyInfo: CompanyInfo): void => {
  try {
    localStorage.setItem("deviselec_company", JSON.stringify(companyInfo));
  } catch (e) {
    console.error("Error saving company info:", e);
  }
};

export const saveQuoteToLocal = (quote: Quote): void => {
  try {
    localStorage.setItem("deviselec_current_quote", JSON.stringify(quote));
  } catch (e) {
    console.error("Error saving quote:", e);
  }
};

export const loadQuoteFromLocal = (): Quote | null => {
  try {
    const saved = localStorage.getItem("deviselec_current_quote");
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error("Error loading quote:", e);
  }
  return null;
};

export const clearLocalQuote = (): void => {
  try {
    localStorage.removeItem("deviselec_current_quote");
  } catch (e) {
    console.error("Error clearing quote:", e);
  }
};

// Get items for a specific section
export const getItemsBySection = (quote: Quote, sectionId: string) => {
  return quote.items.filter(item => item.sectionId === sectionId);
};

// Get included items only
export const getIncludedItems = (quote: Quote) => {
  return quote.items.filter(item => item.included);
};

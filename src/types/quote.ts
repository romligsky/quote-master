export type Trade = "electrician" | "carpenter";

export interface Client {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

export interface CompanyInfo {
  name: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  email: string;
  siret?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  unitPrice: number;
  unit: string;
  trade: Trade;
}

export interface QuoteItem {
  id: string;
  sectionId: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  unit: string;
  total: number;
  description?: string;
  included: boolean;
}

export interface QuoteSection {
  id: string;
  name: string;
  order: number;
}

export interface Quote {
  id: string;
  number: string;
  date: string;
  validUntil: string;
  trade: Trade;
  client: Client;
  companyInfo: CompanyInfo;
  sections: QuoteSection[];
  items: QuoteItem[];
  laborHours: number;
  laborRate: number;
  laborVisible: boolean;
  marginPercent: number;
  discountPercent: number;
  tvaRate: number;
  notes: string;
}

export interface QuoteCalculations {
  subtotalProducts: number;
  laborCost: number;
  subtotalHT: number;
  margin: number;
  subtotalWithMargin: number;
  discount: number;
  totalHT: number;
  tva: number;
  totalTTC: number;
}

export type Trade = "electrician" | "carpenter";

export interface Client {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
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
  product: Product;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Quote {
  id: string;
  number: string;
  date: string;
  validUntil: string;
  trade: Trade;
  client: Client;
  items: QuoteItem[];
  laborHours: number;
  laborRate: number;
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

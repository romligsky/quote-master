import { Product, Trade } from "@/types/quote";

const CUSTOM_PRODUCTS_KEY = "easydevis_custom_products";

export const getCustomProducts = (): Product[] => {
  try {
    const data = localStorage.getItem(CUSTOM_PRODUCTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveCustomProduct = (product: Product): void => {
  const products = getCustomProducts();
  const idx = products.findIndex((p) => p.id === product.id);
  if (idx >= 0) {
    products[idx] = product;
  } else {
    products.push(product);
  }
  localStorage.setItem(CUSTOM_PRODUCTS_KEY, JSON.stringify(products));
};

export const deleteCustomProduct = (productId: string): void => {
  const products = getCustomProducts().filter((p) => p.id !== productId);
  localStorage.setItem(CUSTOM_PRODUCTS_KEY, JSON.stringify(products));
};

export const getCustomProductsByTrade = (trade: Trade): Product[] => {
  return getCustomProducts().filter((p) => p.trade === trade);
};

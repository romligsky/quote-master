import { Quote } from "@/types/quote";

const QUOTES_KEY = "easydevis_quotes";
const COUNTER_KEY = "easydevis_counter";

export const getAllQuotes = (): Quote[] => {
  try {
    const data = localStorage.getItem(QUOTES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveQuoteToHistory = (quote: Quote): void => {
  try {
    const quotes = getAllQuotes();
    const idx = quotes.findIndex((q) => q.id === quote.id);
    if (idx >= 0) {
      quotes[idx] = quote;
    } else {
      quotes.unshift(quote);
    }
    localStorage.setItem(QUOTES_KEY, JSON.stringify(quotes));
  } catch (e) {
    console.error("Error saving quote to history:", e);
  }
};

export const deleteQuoteFromHistory = (quoteId: string): void => {
  try {
    const quotes = getAllQuotes().filter((q) => q.id !== quoteId);
    localStorage.setItem(QUOTES_KEY, JSON.stringify(quotes));
  } catch (e) {
    console.error("Error deleting quote:", e);
  }
};

export const duplicateQuote = (quote: Quote): Quote => {
  return {
    ...quote,
    id: crypto.randomUUID(),
    number: getNextQuoteNumber(),
    date: new Date().toISOString().split("T")[0],
    validUntil: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
    items: quote.items.map((item) => ({ ...item, id: crypto.randomUUID() })),
    sections: quote.sections.map((s) => ({ ...s })),
  };
};

export const getNextQuoteNumber = (): string => {
  try {
    const counter = parseInt(localStorage.getItem(COUNTER_KEY) || "0", 10) + 1;
    localStorage.setItem(COUNTER_KEY, String(counter));
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `DEV-${year}${month}-${String(counter).padStart(3, "0")}`;
  } catch {
    return `DEV-${Date.now()}`;
  }
};

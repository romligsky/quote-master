import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, Trade, Product, QuoteItem } from "@/types/quote";
import { createEmptyQuote, calculateQuote } from "@/lib/quote-utils";
import { TradeSelector } from "@/components/quote/TradeSelector";
import { ClientForm } from "@/components/quote/ClientForm";
import { ProductCatalog } from "@/components/quote/ProductCatalog";
import { QuoteItemsList } from "@/components/quote/QuoteItemsList";
import { QuoteSummary } from "@/components/quote/QuoteSummary";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileDown, Eye, StickyNote, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const QuoteBuilder = () => {
  const [trade, setTrade] = useState<Trade | null>(null);
  const [quote, setQuote] = useState<Quote | null>(null);

  const calculations = useMemo(() => {
    if (!quote) return null;
    return calculateQuote(quote);
  }, [quote]);

  const handleTradeSelect = (selectedTrade: Trade) => {
    setTrade(selectedTrade);
    setQuote(createEmptyQuote(selectedTrade));
  };

  const handleAddProduct = (product: Product, quantity: number) => {
    if (!quote) return;

    const existingItem = quote.items.find(
      (item) => item.product.id === product.id
    );

    if (existingItem) {
      handleUpdateQuantity(existingItem.id, existingItem.quantity + quantity);
    } else {
      const newItem: QuoteItem = {
        id: crypto.randomUUID(),
        product,
        quantity,
        unitPrice: product.unitPrice,
        total: product.unitPrice * quantity,
      };
      setQuote({ ...quote, items: [...quote.items, newItem] });
    }
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    if (!quote) return;

    setQuote({
      ...quote,
      items: quote.items.map((item) =>
        item.id === itemId
          ? { ...item, quantity, total: item.unitPrice * quantity }
          : item
      ),
    });
  };

  const handleRemoveItem = (itemId: string) => {
    if (!quote) return;
    setQuote({
      ...quote,
      items: quote.items.filter((item) => item.id !== itemId),
    });
  };

  const handleUpdateQuote = (updates: Partial<Quote>) => {
    if (!quote) return;
    setQuote({ ...quote, ...updates });
  };

  const handleReset = () => {
    setTrade(null);
    setQuote(null);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour
                </Link>
              </Button>
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg gradient-electric flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold">DevisElec Pro</span>
              </div>
            </div>

            {quote && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground hidden md:inline">
                  {quote.number}
                </span>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  Aperçu
                </Button>
                <Button size="sm">
                  <FileDown className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container px-4 md:px-6 py-8">
        <AnimatePresence mode="wait">
          {!trade ? (
            <motion.div
              key="trade-selector"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto pt-12"
            >
              <TradeSelector selectedTrade={trade} onSelect={handleTradeSelect} />
            </motion.div>
          ) : (
            quote &&
            calculations && (
              <motion.div
                key="quote-builder"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Trade indicator */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        trade === "electrician"
                          ? "bg-blue-500"
                          : "bg-amber-500"
                      }`}
                    >
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold">
                        {trade === "electrician" ? "Électricien" : "Menuisier"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Devis {quote.number}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleReset}>
                    Changer de métier
                  </Button>
                </div>

                {/* Main grid */}
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Left column - Forms */}
                  <div className="lg:col-span-2 space-y-6">
                    <ClientForm
                      client={quote.client}
                      onChange={(client) => handleUpdateQuote({ client })}
                    />

                    <ProductCatalog
                      trade={trade}
                      onAddProduct={handleAddProduct}
                    />

                    <QuoteItemsList
                      items={quote.items}
                      onUpdateQuantity={handleUpdateQuantity}
                      onRemoveItem={handleRemoveItem}
                    />

                    {/* Notes */}
                    <Card>
                      <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <StickyNote className="w-5 h-5 text-primary" />
                          Notes
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Textarea
                          placeholder="Conditions particulières, informations complémentaires..."
                          value={quote.notes}
                          onChange={(e) =>
                            handleUpdateQuote({ notes: e.target.value })
                          }
                          rows={4}
                        />
                      </CardContent>
                    </Card>
                  </div>

                  {/* Right column - Summary */}
                  <div className="lg:sticky lg:top-24 lg:h-fit">
                    <QuoteSummary
                      quote={quote}
                      calculations={calculations}
                      onUpdateQuote={handleUpdateQuote}
                    />
                  </div>
                </div>
              </motion.div>
            )
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default QuoteBuilder;

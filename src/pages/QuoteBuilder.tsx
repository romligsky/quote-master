import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, Trade, Product, QuoteItem, QuoteSection } from "@/types/quote";
import {
  createEmptyQuote,
  calculateQuote,
  saveQuoteToLocal,
  loadQuoteFromLocal,
  clearLocalQuote,
  saveCompanyInfo,
  createDefaultSection,
} from "@/lib/quote-utils";
import { generateQuotePDF } from "@/lib/pdf-generator";
import { TradeSelector } from "@/components/quote/TradeSelector";
import { ClientForm } from "@/components/quote/ClientForm";
import { CompanyForm } from "@/components/quote/CompanyForm";
import { ProductCatalog } from "@/components/quote/ProductCatalog";
import { QuoteItemsList } from "@/components/quote/QuoteItemsList";
import { QuoteSummary } from "@/components/quote/QuoteSummary";
import { SectionManager } from "@/components/quote/SectionManager";
import { QuotePreview } from "@/components/quote/QuotePreview";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ArrowLeft,
  FileDown,
  Eye,
  StickyNote,
  Zap,
  RefreshCw,
  ChevronDown,
  Building2,
} from "lucide-react";
import { Link } from "react-router-dom";

const QuoteBuilder = () => {
  const [trade, setTrade] = useState<Trade | null>(null);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState<string | undefined>(undefined);
  const [companyExpanded, setCompanyExpanded] = useState(false);

  // Load saved quote on mount
  useEffect(() => {
    const savedQuote = loadQuoteFromLocal();
    if (savedQuote) {
      setQuote(savedQuote);
      setTrade(savedQuote.trade);
      if (savedQuote.sections.length > 0) {
        setSelectedSectionId(savedQuote.sections[0].id);
      }
    }
  }, []);

  // Auto-save quote changes
  useEffect(() => {
    if (quote) {
      saveQuoteToLocal(quote);
    }
  }, [quote]);

  const calculations = useMemo(() => {
    if (!quote) return null;
    return calculateQuote(quote);
  }, [quote]);

  const handleTradeSelect = (selectedTrade: Trade) => {
    setTrade(selectedTrade);
    const newQuote = createEmptyQuote(selectedTrade);
    setQuote(newQuote);
    if (newQuote.sections.length > 0) {
      setSelectedSectionId(newQuote.sections[0].id);
    }
  };

  const handleAddProduct = (product: Product, quantity: number, sectionId: string) => {
    if (!quote) return;

    const existingItem = quote.items.find(
      (item) => item.product.id === product.id && item.sectionId === sectionId
    );

    if (existingItem) {
      handleUpdateItem(existingItem.id, {
        quantity: existingItem.quantity + quantity,
        total: existingItem.unitPrice * (existingItem.quantity + quantity),
      });
    } else {
      const newItem: QuoteItem = {
        id: crypto.randomUUID(),
        sectionId,
        product,
        quantity,
        unitPrice: product.unitPrice,
        unit: product.unit,
        total: product.unitPrice * quantity,
        included: true,
      };
      setQuote({ ...quote, items: [...quote.items, newItem] });
    }
  };

  const handleUpdateItem = (itemId: string, updates: Partial<QuoteItem>) => {
    if (!quote) return;

    setQuote({
      ...quote,
      items: quote.items.map((item) =>
        item.id === itemId ? { ...item, ...updates } : item
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

  const handleAddSection = (section: QuoteSection) => {
    if (!quote) return;
    setQuote({
      ...quote,
      sections: [...quote.sections, section],
    });
    setSelectedSectionId(section.id);
  };

  const handleRenameSection = (sectionId: string, newName: string) => {
    if (!quote) return;
    setQuote({
      ...quote,
      sections: quote.sections.map((s) =>
        s.id === sectionId ? { ...s, name: newName } : s
      ),
    });
  };

  const handleDeleteSection = (sectionId: string) => {
    if (!quote || quote.sections.length <= 1) return;

    // Remove section and its items
    setQuote({
      ...quote,
      sections: quote.sections.filter((s) => s.id !== sectionId),
      items: quote.items.filter((item) => item.sectionId !== sectionId),
    });

    // Select another section
    const remainingSections = quote.sections.filter((s) => s.id !== sectionId);
    if (remainingSections.length > 0) {
      setSelectedSectionId(remainingSections[0].id);
    }
  };

  const handleUpdateQuote = (updates: Partial<Quote>) => {
    if (!quote) return;
    setQuote({ ...quote, ...updates });

    // Save company info separately for reuse
    if (updates.companyInfo) {
      saveCompanyInfo(updates.companyInfo);
    }
  };

  const handleNewQuote = () => {
    if (!trade) return;
    clearLocalQuote();
    const newQuote = createEmptyQuote(trade);
    setQuote(newQuote);
    if (newQuote.sections.length > 0) {
      setSelectedSectionId(newQuote.sections[0].id);
    }
  };

  const handleReset = () => {
    setTrade(null);
    setQuote(null);
    clearLocalQuote();
  };

  const handleExportPDF = () => {
    if (!quote || !calculations) return;
    generateQuotePDF(quote, calculations);
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
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Nouveau
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Nouveau devis ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action réinitialisera le devis en cours. Les informations
                        de votre entreprise seront conservées.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction onClick={handleNewQuote}>
                        Nouveau devis
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <Button variant="outline" size="sm" onClick={() => setShowPreview(true)}>
                  <Eye className="w-4 h-4 mr-2" />
                  Aperçu
                </Button>
                <Button size="sm" onClick={handleExportPDF}>
                  <FileDown className="w-4 h-4 mr-2" />
                  PDF
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
                    {/* Company info (collapsible) */}
                    <Collapsible open={companyExpanded} onOpenChange={setCompanyExpanded}>
                      <Card>
                        <CollapsibleTrigger asChild>
                          <CardHeader className="pb-4 cursor-pointer hover:bg-muted/20 transition-colors">
                            <CardTitle className="flex items-center justify-between text-lg">
                              <span className="flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-primary" />
                                Mon entreprise
                              </span>
                              <ChevronDown
                                className={`w-4 h-4 transition-transform ${
                                  companyExpanded ? "rotate-180" : ""
                                }`}
                              />
                            </CardTitle>
                          </CardHeader>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <CardContent className="pt-0">
                            <CompanyForm
                              company={quote.companyInfo}
                              onChange={(companyInfo) =>
                                handleUpdateQuote({ companyInfo })
                              }
                            />
                          </CardContent>
                        </CollapsibleContent>
                      </Card>
                    </Collapsible>

                    <ClientForm
                      client={quote.client}
                      onChange={(client) => handleUpdateQuote({ client })}
                    />

                    <SectionManager
                      sections={quote.sections}
                      onAddSection={handleAddSection}
                      onRenameSection={handleRenameSection}
                      onDeleteSection={handleDeleteSection}
                    />

                    {/* Section selector for catalog */}
                    <Card>
                      <CardHeader className="pb-4">
                        <CardTitle className="flex items-center justify-between text-lg">
                          <span>Ajouter des prestations</span>
                          <Select
                            value={selectedSectionId}
                            onValueChange={setSelectedSectionId}
                          >
                            <SelectTrigger className="w-48">
                              <SelectValue placeholder="Section" />
                            </SelectTrigger>
                            <SelectContent>
                              {quote.sections.map((section) => (
                                <SelectItem key={section.id} value={section.id}>
                                  {section.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <ProductCatalog
                          trade={trade}
                          sectionId={selectedSectionId}
                          onAddProduct={handleAddProduct}
                        />
                      </CardContent>
                    </Card>

                    <QuoteItemsList
                      sections={quote.sections}
                      items={quote.items}
                      onUpdateItem={handleUpdateItem}
                      onRemoveItem={handleRemoveItem}
                    />

                    {/* Notes */}
                    <Card>
                      <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <StickyNote className="w-5 h-5 text-primary" />
                          Notes & Conditions
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

      {/* Preview modal */}
      {quote && calculations && (
        <QuotePreview
          quote={quote}
          calculations={calculations}
          open={showPreview}
          onClose={() => setShowPreview(false)}
          onExportPDF={handleExportPDF}
        />
      )}
    </div>
  );
};

export default QuoteBuilder;

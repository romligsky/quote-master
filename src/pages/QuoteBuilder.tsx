import { useState, useMemo, useEffect } from "react";
import logo from "@/assets/logo.png";

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
import { saveQuoteToHistory, getNextQuoteNumber } from "@/lib/quote-storage";
import { generateQuotePDF } from "@/lib/pdf-generator";
import { FeedbackButton } from "@/components/quote/FeedbackButton";
import { Input } from "@/components/ui/input";
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
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  ArrowLeft,
  FileDown,
  Eye,
  StickyNote,
  Zap,
  RefreshCw,
  ChevronDown,
  Building2,
  History,
  Package,
} from "lucide-react";
import { Link } from "react-router-dom";

const QuoteBuilder = () => {
  const [trade, setTrade] = useState<Trade | null>(null);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState<string>("");
  const [companyExpanded, setCompanyExpanded] = useState(true);
  const [showCatalogDrawer, setShowCatalogDrawer] = useState(false);

  // Load saved quote on mount
  useEffect(() => {
    try {
      const savedQuote = loadQuoteFromLocal();
      if (savedQuote) {
        setQuote(savedQuote);

        // ❗ IMPORTANT :
        // On NE restaure PAS automatiquement le métier
        setTrade(null);

        if (savedQuote.sections && savedQuote.sections.length > 0) {
          setSelectedSectionId(savedQuote.sections[0].id);
        }
      }
    } catch (e) {
      console.error("Error loading saved quote:", e);
      clearLocalQuote();
    }
  }, []);


  // Auto-save quote changes + history
  useEffect(() => {
    if (quote) {
      saveQuoteToLocal(quote);
      saveQuoteToHistory(quote);
    }
  }, [quote]);

  const calculations = useMemo(() => {
    if (!quote) return null;
    try {
      return calculateQuote(quote);
    } catch (e) {
      console.error("Calculation error:", e);
      return null;
    }
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
    if (!quote || !sectionId) return;

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

  const handleAddFreeItem = (sectionId: string, name: string, unitPrice: number, unit: string, quantity: number) => {
    if (!quote) return;
    const freeProduct: Product = {
      id: `free-${crypto.randomUUID()}`,
      name,
      category: "Ligne libre",
      unitPrice,
      unit,
      trade: trade!,
    };
    const newItem: QuoteItem = {
      id: crypto.randomUUID(),
      sectionId,
      product: freeProduct,
      quantity,
      unitPrice,
      unit,
      total: unitPrice * quantity,
      included: true,
    };
    setQuote({ ...quote, items: [...quote.items, newItem] });
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
    const newSections = quote.sections.filter((s) => s.id !== sectionId);
    setQuote({
      ...quote,
      sections: newSections,
      items: quote.items.filter((item) => item.sectionId !== sectionId),
    });
    if (selectedSectionId === sectionId && newSections.length > 0) {
      setSelectedSectionId(newSections[0].id);
    }
  };

  const handleUpdateQuote = (updates: Partial<Quote>) => {
    if (!quote) return;
    setQuote({ ...quote, ...updates });
    if (updates.companyInfo) {
      saveCompanyInfo(updates.companyInfo);
    }
  };

  const handleNewQuote = () => {
    if (!trade) return;
    // Save current to history before creating new
    if (quote) saveQuoteToHistory(quote);
    clearLocalQuote();
    const newQuote = createEmptyQuote(trade);
    newQuote.number = getNextQuoteNumber();
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
    try {
      generateQuotePDF(quote, calculations);
    } catch (e) {
      console.error("PDF generation error:", e);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="container px-3 sm:px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <Button variant="ghost" size="sm" asChild className="px-2">
                <Link to="/">
                  <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Retour</span>
                </Link>
              </Button>
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg gradient-electric flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-sm sm:text-base">DevisElec Pro</span>
              </div>
            </div>

            {quote && calculations && (
              <div className="flex items-center gap-1 sm:gap-2 ml-auto">
                <span className="text-xs sm:text-sm text-muted-foreground hidden md:inline">
                  {quote.number}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  asChild 
                  className="hidden sm:flex px-2"
                >
                  <Link to="/mes-devis">
                    <History className="w-4 h-4 mr-1" />
                    <span className="hidden lg:inline">Mes devis</span>
                  </Link>
                </Button>
                <div className="hidden sm:block">
                  <FeedbackButton />
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-xs px-2 sm:px-3"
                    >
                      <RefreshCw className="w-4 h-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">Nouveau</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Nouveau devis ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Le devis actuel sera sauvegardé dans l'historique.
                        Les informations de votre entreprise seront conservées.
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
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowPreview(true)}
                  className="text-xs px-2 sm:px-3"
                >
                  <Eye className="w-4 h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Aperçu</span>
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleExportPDF}
                  className="text-xs px-2 sm:px-3"
                >
                  <FileDown className="w-4 h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">PDF</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container px-3 sm:px-4 md:px-6 py-4 sm:py-8">
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
                className="space-y-4 sm:space-y-6"
              >
                {/* Trade + Title */}
                <div className="flex items-start justify-between gap-2 sm:gap-4">
                  <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        trade === "electrician" ? "bg-blue-500" : "bg-amber-500"
                      }`}
                    >
                      <Zap className="w-5 h-5 text-white" />
                    </div>

                    <div className="flex-1 space-y-1 min-w-0">
                      <p className="font-semibold text-sm sm:text-base">
                        {trade === "electrician" ? "Électricien" : "Menuisier"}
                      </p>

                      {/* 🔹 TITRE DU DEVIS */}
                      <Input
                        className="h-8 text-xs sm:text-sm font-medium"
                        value={quote.title}
                        onChange={(e) =>
                          handleUpdateQuote({ title: e.target.value })
                        }
                        placeholder="Titre du devis"
                      />

                      {/* Numéro de devis */}
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>Devis</span>
                        <Input
                          value={quote.number}
                          onChange={(e) =>
                            handleUpdateQuote({ number: e.target.value })
                          }
                          className="w-32 sm:w-40 h-7 text-xs"
                          placeholder="DEV-XXXX"
                        />
                      </div>
                    </div>
                  </div>

                  <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs sm:text-sm px-2 sm:px-3 shrink-0">
                    <span className="hidden sm:inline">Changer de métier</span>
                    <span className="sm:hidden">Métier</span>
                  </Button>
                </div>


                {/* Main grid - responsive stack on mobile */}
                <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
                  {/* Left column - Forms */}
                  <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                    {/* Company info (collapsible) */}
                    <Collapsible open={companyExpanded} onOpenChange={setCompanyExpanded}>
                      <Card>
                        <CollapsibleTrigger asChild>
                          <CardHeader className="pb-4 cursor-pointer hover:bg-muted/20 transition-colors">
                            <CardTitle className="flex items-center justify-between text-sm sm:text-lg">
                              <span className="flex items-center gap-2">
                                <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0" />
                                <span className="text-sm sm:text-base">Mon entreprise</span>
                              </span>
                              <ChevronDown
                                className={`w-4 h-4 transition-transform shrink-0 ${
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

                    {/* Catalog - Desktop: embedded, Mobile: drawer */}
                    <div className="hidden lg:block">
                      <Card>
                        <CardHeader className="pb-4">
                          <CardTitle className="flex items-center justify-between text-sm sm:text-lg">
                            <span>Ajouter des prestations</span>
                            {quote.sections.length > 0 && (
                              <Select
                                value={selectedSectionId || quote.sections[0]?.id || ""}
                                onValueChange={setSelectedSectionId}
                              >
                                <SelectTrigger className="w-32 sm:w-48">
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
                            )}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          {selectedSectionId && (
                            <ProductCatalog
                              trade={trade}
                              sectionId={selectedSectionId}
                              onAddProduct={handleAddProduct}
                            />
                          )}
                        </CardContent>
                      </Card>
                    </div>

                    {/* Mobile: Catalog drawer button */}
                    <div className="lg:hidden">
                      <Drawer open={showCatalogDrawer} onOpenChange={setShowCatalogDrawer}>
                        <DrawerTrigger asChild>
                          <Button className="w-full gap-2">
                            <Package className="w-4 h-4" />
                            Ajouter des prestations
                          </Button>
                        </DrawerTrigger>
                        <DrawerContent>
                          <DrawerHeader>
                            <DrawerTitle>Catalogue de prestations</DrawerTitle>
                            <DrawerDescription>
                              Sélectionnez une section et ajoutez des prestations
                            </DrawerDescription>
                          </DrawerHeader>
                          <div className="px-4 pb-6 space-y-4 max-h-[70vh] overflow-y-auto">
                            {quote.sections.length > 0 && (
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Section</label>
                                <Select
                                  value={selectedSectionId || quote.sections[0]?.id || ""}
                                  onValueChange={setSelectedSectionId}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner une section" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {quote.sections.map((section) => (
                                      <SelectItem key={section.id} value={section.id}>
                                        {section.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            )}
                            {selectedSectionId && (
                              <ProductCatalog
                                trade={trade}
                                sectionId={selectedSectionId}
                                onAddProduct={(product, quantity, sectionId) => {
                                  handleAddProduct(product, quantity, sectionId);
                                  setShowCatalogDrawer(false);
                                }}
                              />
                            )}
                          </div>
                        </DrawerContent>
                      </Drawer>
                    </div>

                    <QuoteItemsList
                      sections={quote.sections}
                      items={quote.items}
                      onUpdateItem={handleUpdateItem}
                      onRemoveItem={handleRemoveItem}
                      onAddFreeItem={handleAddFreeItem}
                    />

                    {/* Notes */}
                    <Card>
                      <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-sm sm:text-lg">
                          <StickyNote className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0" />
                          Notes & Conditions
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Textarea
                          value={quote.notes}
                          onChange={(e) =>
                            handleUpdateQuote({ notes: e.target.value })
                          }
                          placeholder="Notes, conditions particulières, délais..."
                          rows={3}
                        />
                      </CardContent>
                    </Card>
                  </div>

                  {/* Right column - Summary (sticky on desktop, fixed on mobile) */}
                  <div className="lg:col-span-1">
                    <div className="sticky top-20 lg:top-24 space-y-4 sm:space-y-6">
                      <QuoteSummary
                        quote={quote}
                        calculations={calculations}
                        onUpdateQuote={handleUpdateQuote}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          )}
        </AnimatePresence>
      </main>

      {/* Preview Modal */}
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

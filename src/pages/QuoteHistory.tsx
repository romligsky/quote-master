import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Quote } from "@/types/quote";
import { getAllQuotes, deleteQuoteFromHistory, duplicateQuote, saveQuoteToHistory } from "@/lib/quote-storage";
import { calculateQuote, formatCurrency, saveQuoteToLocal } from "@/lib/quote-utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { ArrowLeft, FileText, Copy, Trash2, ExternalLink, Zap, FolderOpen } from "lucide-react";

const QuoteHistory = () => {
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState<Quote[]>(getAllQuotes);

  const handleOpen = (quote: Quote) => {
    saveQuoteToLocal(quote);
    navigate("/devis");
  };

  const handleDuplicate = (quote: Quote) => {
    const dup = duplicateQuote(quote);
    saveQuoteToHistory(dup);
    setQuotes(getAllQuotes());
  };

  const handleDelete = (quoteId: string) => {
    deleteQuoteFromHistory(quoteId);
    setQuotes(getAllQuotes());
  };

  const getTotal = (quote: Quote) => {
    try {
      return calculateQuote(quote).totalTTC;
    } catch {
      return 0;
    }
  };

  const formatDate = (d: string) => {
    try {
      return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
    } catch {
      return d;
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Accueil
                </Link>
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg gradient-electric flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold">Mes devis</span>
              </div>
            </div>
            <Button size="sm" asChild>
              <Link to="/devis">
                <FileText className="w-4 h-4 mr-2" />
                Nouveau devis
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container px-4 md:px-6 py-8">
        {quotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <FolderOpen className="w-16 h-16 text-muted-foreground/40 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Aucun devis sauvegardé</h2>
            <p className="text-muted-foreground mb-6">
              Créez votre premier devis pour le retrouver ici.
            </p>
            <Button asChild>
              <Link to="/devis">Créer un devis</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-3 max-w-3xl mx-auto">
            <p className="text-sm text-muted-foreground mb-4">
              {quotes.length} devis sauvegardé{quotes.length > 1 ? "s" : ""}
            </p>
            {quotes.map((quote) => (
              <Card key={quote.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-sm font-medium text-primary">
                          {quote.number}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(quote.date)}
                        </span>
                      </div>
                      <p className="font-medium truncate">
                        {quote.client.name || "Client non renseigné"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {quote.title || "Devis"} — {formatCurrency(getTotal(quote))}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button variant="outline" size="sm" onClick={() => handleOpen(quote)}>
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Ouvrir
                      </Button>
                      <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => handleDuplicate(quote)}>
                        <Copy className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-9 w-9 text-destructive hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Supprimer ce devis ?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Le devis {quote.number} sera définitivement supprimé.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(quote.id)}>
                              Supprimer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default QuoteHistory;

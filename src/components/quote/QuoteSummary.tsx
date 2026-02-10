import { Quote, QuoteCalculations } from "@/types/quote";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Calculator, Clock, Wallet, Eye, EyeOff } from "lucide-react";
import { formatCurrency } from "@/lib/quote-utils";

interface QuoteSummaryProps {
  quote: Quote;
  calculations: QuoteCalculations;
  onUpdateQuote: (updates: Partial<Quote>) => void;
}

export const QuoteSummary = ({
  quote,
  calculations,
  onUpdateQuote,
}: QuoteSummaryProps) => {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calculator className="w-5 h-5 text-primary" />
          Récapitulatif
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Labor */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Clock className="w-4 h-4" />
              Main d'œuvre
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="laborVisible" className="text-xs text-muted-foreground">
                {quote.laborVisible ? (
                  <Eye className="w-3.5 h-3.5" />
                ) : (
                  <EyeOff className="w-3.5 h-3.5" />
                )}
              </Label>
              <Switch
                id="laborVisible"
                checked={quote.laborVisible}
                onCheckedChange={(checked) =>
                  onUpdateQuote({ laborVisible: checked })
                }
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            {quote.laborVisible
              ? "Visible sur le devis et incluse dans les calculs"
              : "Masquée sur le devis mais incluse dans le total"}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="laborHours" className="text-xs">
                Heures
              </Label>
              <Input
                id="laborHours"
                type="number"
                min="0"
                step="0.5"
                value={quote.laborHours}
                onChange={(e) =>
                  onUpdateQuote({ laborHours: parseFloat(e.target.value) || 0 })
                }
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="laborRate" className="text-xs">
                Taux horaire (€)
              </Label>
              <Input
                id="laborRate"
                type="number"
                min="0"
                value={quote.laborRate}
                onChange={(e) =>
                  onUpdateQuote({ laborRate: parseFloat(e.target.value) || 0 })
                }
              />
            </div>
          </div>
        </div>

        {/* Discount & TVA */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="discount" className="text-xs">
                Remise (%)
              </Label>
              <Input
                id="discount"
                type="number"
                min="0"
                max="100"
                value={quote.discountPercent}
                onChange={(e) =>
                  onUpdateQuote({
                    discountPercent: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="tva" className="text-xs">
                TVA (%)
              </Label>
              <Input
                id="tva"
                type="number"
                min="0"
                max="100"
                value={quote.tvaRate}
                onChange={(e) =>
                  onUpdateQuote({ tvaRate: parseFloat(e.target.value) || 0 })
                }
              />
            </div>
          </div>
        </div>

        {/* Totals - Clean display */}
        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between text-sm font-medium">
            <span>Total HT</span>
            <span>{formatCurrency(calculations.totalHT)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              TVA ({quote.tvaRate}%)
            </span>
            <span>{formatCurrency(calculations.tva)}</span>
          </div>
        </div>

        {/* Total TTC */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold flex items-center gap-2">
              <Wallet className="w-5 h-5 text-primary" />
              Total TTC
            </span>
            <span className="text-2xl font-bold text-primary">
              {formatCurrency(calculations.totalTTC)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

import { Quote, QuoteCalculations } from "@/types/quote";
import { formatCurrency } from "@/lib/quote-utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, FileDown } from "lucide-react";

interface QuotePreviewProps {
  quote: Quote;
  calculations: QuoteCalculations;
  open: boolean;
  onClose: () => void;
  onExportPDF: () => void;
}

export const QuotePreview = ({
  quote,
  calculations,
  open,
  onClose,
  onExportPDF,
}: QuotePreviewProps) => {
  const includedItems = quote.items.filter((item) => item.included);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const getSectionItems = (sectionId: string) => {
    return includedItems.filter((item) => item.sectionId === sectionId);
  };

  const getSectionTotal = (sectionId: string) => {
    return getSectionItems(sectionId).reduce((sum, item) => sum + item.total, 0);
  };

  const visibleSections = quote.sections.filter(
    (section) => getSectionItems(section.id).length > 0
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="sticky top-0 bg-background z-10 p-4 border-b flex flex-row items-center justify-between">
          <DialogTitle>Aperçu du devis</DialogTitle>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={onExportPDF}>
              <FileDown className="w-4 h-4 mr-2" />
              Télécharger PDF
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="p-8 bg-white text-black" id="quote-preview">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {quote.companyInfo.name}
              </h1>
              {quote.companyInfo.address && (
                <p className="text-sm text-gray-600">{quote.companyInfo.address}</p>
              )}
              {(quote.companyInfo.postalCode || quote.companyInfo.city) && (
                <p className="text-sm text-gray-600">
                  {quote.companyInfo.postalCode} {quote.companyInfo.city}
                </p>
              )}
              {quote.companyInfo.phone && (
                <p className="text-sm text-gray-600">Tél: {quote.companyInfo.phone}</p>
              )}
              {quote.companyInfo.email && (
                <p className="text-sm text-gray-600">{quote.companyInfo.email}</p>
              )}
              {quote.companyInfo.siret && (
                <p className="text-sm text-gray-600">SIRET: {quote.companyInfo.siret}</p>
              )}
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold text-blue-600 mb-2">DEVIS</h2>
              <p className="text-sm text-gray-600">N° {quote.number}</p>
              <p className="text-sm text-gray-600">Date: {formatDate(quote.date)}</p>
              <p className="text-sm text-gray-600">
                Valide jusqu'au: {formatDate(quote.validUntil)}
              </p>
            </div>
          </div>

          {/* Client */}
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-500 mb-2">CLIENT</h3>
            <p className="font-medium">{quote.client.name || "Non renseigné"}</p>
            {quote.client.address && (
              <p className="text-sm text-gray-600">{quote.client.address}</p>
            )}
            {(quote.client.postalCode || quote.client.city) && (
              <p className="text-sm text-gray-600">
                {quote.client.postalCode} {quote.client.city}
              </p>
            )}
            {quote.client.phone && (
              <p className="text-sm text-gray-600">Tél: {quote.client.phone}</p>
            )}
            {quote.client.email && (
              <p className="text-sm text-gray-600">{quote.client.email}</p>
            )}
          </div>

          {/* Sections and items */}
          {visibleSections.map((section) => (
            <div key={section.id} className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3 pb-2 border-b">
                {section.name}
              </h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 text-left">
                    <th className="pb-2 font-medium">Désignation</th>
                    <th className="pb-2 font-medium text-center w-20">Qté</th>
                    <th className="pb-2 font-medium text-center w-20">Unité</th>
                    <th className="pb-2 font-medium text-right w-24">P.U. HT</th>
                    <th className="pb-2 font-medium text-right w-24">Total HT</th>
                  </tr>
                </thead>
                <tbody>
                  {getSectionItems(section.id).map((item) => (
                    <tr key={item.id} className="border-b border-gray-100">
                      <td className="py-2 pr-4">
                        <span className="font-medium">{item.product.name}</span>
                        {item.description && (
                          <p className="text-gray-500 text-xs italic mt-1 whitespace-pre-wrap">
                            {item.description}
                          </p>
                        )}
                      </td>
                      <td className="py-2 text-center">{item.quantity}</td>
                      <td className="py-2 text-center">{item.unit || "-"}</td>
                      <td className="py-2 text-right">{formatCurrency(item.unitPrice)}</td>
                      <td className="py-2 text-right font-medium">{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={4} className="pt-2 text-right font-medium">
                      Sous-total {section.name}:
                    </td>
                    <td className="pt-2 text-right font-semibold">
                      {formatCurrency(getSectionTotal(section.id))}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ))}

          {/* Labor (only if visible) */}
          {quote.laborVisible && calculations.laborCost > 0 && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-medium">Main d'œuvre</span>
                  <span className="text-sm text-gray-500 ml-2">
                    ({quote.laborHours}h × {formatCurrency(quote.laborRate)}/h)
                  </span>
                </div>
                <span className="font-semibold">
                  {formatCurrency(calculations.laborCost)}
                </span>
              </div>
            </div>
          )}

          {/* Totals */}
          <div className="border-t-2 border-gray-200 pt-4 mt-8">
            <div className="flex flex-col items-end space-y-2">
              <div className="flex justify-between w-64 font-medium">
                <span>Total HT:</span>
                <span>{formatCurrency(calculations.totalHT)}</span>
              </div>
              {calculations.discount > 0 && (
                <div className="flex justify-between w-64 text-sm">
                  <span className="text-gray-600">
                    dont remise ({quote.discountPercent}%):
                  </span>
                  <span className="text-red-600">
                    -{formatCurrency(calculations.discount)}
                  </span>
                </div>
              )}
              <div className="flex justify-between w-64 text-sm">
                <span className="text-gray-600">TVA ({quote.tvaRate}%):</span>
                <span>{formatCurrency(calculations.tva)}</span>
              </div>
              <div className="flex justify-between w-64 text-lg font-bold pt-2 border-t-2 border-blue-500">
                <span>Total TTC:</span>
                <span className="text-blue-600">
                  {formatCurrency(calculations.totalTTC)}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {quote.notes && (
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-500 mb-2">
                CONDITIONS ET NOTES
              </h3>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">
                {quote.notes}
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 pt-4 border-t text-center text-xs text-gray-400">
            <p>Devis valable jusqu'au {formatDate(quote.validUntil)}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

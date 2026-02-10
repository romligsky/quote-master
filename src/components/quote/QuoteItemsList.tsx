import { useState } from "react";
import { QuoteItem, QuoteSection, Product } from "@/types/quote";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  ShoppingCart,
  Trash2,
  Minus,
  Plus,
  ChevronDown,
  ChevronUp,
  FileText,
  PlusCircle,
} from "lucide-react";
import { formatCurrency } from "@/lib/quote-utils";

const UNIT_OPTIONS = [
  { value: "unité", label: "Unité" },
  { value: "m²", label: "m²" },
  { value: "mètre", label: "Mètre" },
  { value: "ml", label: "ML" },
  { value: "forfait", label: "Forfait" },
  { value: "heure", label: "Heure" },
  { value: "jour", label: "Jour" },
  { value: "lot", label: "Lot" },
  { value: "aucune", label: "Aucune" },
];

interface QuoteItemsListProps {
  sections: QuoteSection[];
  items: QuoteItem[];
  onUpdateItem: (itemId: string, updates: Partial<QuoteItem>) => void;
  onRemoveItem: (itemId: string) => void;
  onAddFreeItem: (sectionId: string, name: string, unitPrice: number, unit: string, quantity: number) => void;
}

export const QuoteItemsList = ({
  sections,
  items,
  onUpdateItem,
  onRemoveItem,
  onAddFreeItem,
}: QuoteItemsListProps) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(
    sections.map((s) => s.id)
  );
  const [showDescriptions, setShowDescriptions] = useState<Record<string, boolean>>({});
  const [freeItemSection, setFreeItemSection] = useState<string | null>(null);
  const [freeItemName, setFreeItemName] = useState("");
  const [freeItemPrice, setFreeItemPrice] = useState("");
  const [freeItemUnit, setFreeItemUnit] = useState("unité");
  const [freeItemQty, setFreeItemQty] = useState("1");

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const toggleDescription = (itemId: string) => {
    setShowDescriptions((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const getItemsBySection = (sectionId: string) => {
    return items.filter((item) => item.sectionId === sectionId);
  };

  const getSectionTotal = (sectionId: string) => {
    return getItemsBySection(sectionId)
      .filter((item) => item.included)
      .reduce((sum, item) => sum + item.total, 0);
  };

  const handleQuantityChange = (itemId: string, quantity: number) => {
    const item = items.find((i) => i.id === itemId);
    if (item) {
      onUpdateItem(itemId, {
        quantity,
        total: item.unitPrice * quantity,
      });
    }
  };

  const handleUnitPriceChange = (itemId: string, unitPrice: number) => {
    const item = items.find((i) => i.id === itemId);
    if (item) {
      onUpdateItem(itemId, {
        unitPrice,
        total: unitPrice * item.quantity,
      });
    }
  };

  const handleAddFreeItem = () => {
    if (!freeItemSection || !freeItemName.trim()) return;
    onAddFreeItem(
      freeItemSection,
      freeItemName.trim(),
      parseFloat(freeItemPrice) || 0,
      freeItemUnit === "aucune" ? "" : freeItemUnit,
      parseFloat(freeItemQty) || 1
    );
    setFreeItemName("");
    setFreeItemPrice("");
    setFreeItemUnit("unité");
    setFreeItemQty("1");
    setFreeItemSection(null);
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-lg">
          <span className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary" />
            Prestations ({items.filter((i) => i.included).length}/{items.length})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sections.map((section) => {
          const sectionItems = getItemsBySection(section.id);
          const isExpanded = expandedSections.includes(section.id);

          return (
            <Collapsible
              key={section.id}
              open={isExpanded}
              onOpenChange={() => toggleSection(section.id)}
            >
              <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 cursor-pointer hover:bg-muted/60 transition-colors">
                  <div className="flex items-center gap-2">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                    <span className="font-semibold">{section.name}</span>
                    <span className="text-sm text-muted-foreground">
                      ({sectionItems.length} ligne{sectionItems.length > 1 ? "s" : ""})
                    </span>
                  </div>
                  <span className="font-semibold text-primary">
                    {formatCurrency(getSectionTotal(section.id))}
                  </span>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-2 space-y-2">
                {sectionItems.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4 text-sm">
                    Aucune ligne. Ajoutez des produits depuis le catalogue ou une ligne libre.
                  </p>
                ) : (
                  sectionItems.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3 rounded-lg border transition-all ${
                        item.included
                          ? "bg-card"
                          : "bg-muted/20 opacity-60"
                      }`}
                    >
                      {/* Main row */}
                      <div className="flex items-start gap-3">
                        {/* Checkbox */}
                        <div className="pt-1">
                          <Checkbox
                            checked={item.included}
                            onCheckedChange={(checked) =>
                              onUpdateItem(item.id, { included: !!checked })
                            }
                          />
                        </div>

                        {/* Product info */}
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            {item.product.id.startsWith("free-") ? (
                              <Input
                                value={item.product.name}
                                onChange={(e) =>
                                  onUpdateItem(item.id, {
                                    product: { ...item.product, name: e.target.value },
                                  })
                                }
                                className={`font-medium h-8 text-sm ${!item.included ? "line-through" : ""}`}
                                placeholder="Nom de la prestation"
                              />
                            ) : (
                              <p
                                className={`font-medium truncate ${
                                  !item.included ? "line-through" : ""
                                }`}
                              >
                                {item.product.name}
                              </p>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 shrink-0"
                              onClick={() => toggleDescription(item.id)}
                            >
                              <FileText className="w-3.5 h-3.5" />
                            </Button>
                          </div>

                          {/* Controls row */}
                          <div className="flex flex-wrap items-center gap-2">
                            {/* Unit selector */}
                            <Select
                              value={item.unit || "aucune"}
                              onValueChange={(value) =>
                                onUpdateItem(item.id, { unit: value === "aucune" ? "" : value })
                              }
                            >
                              <SelectTrigger className="w-24 h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {UNIT_OPTIONS.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            {/* Unit price */}
                            <div className="flex items-center gap-1">
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={item.unitPrice}
                                onChange={(e) =>
                                  handleUnitPriceChange(
                                    item.id,
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className="w-20 h-8 text-center text-xs"
                              />
                              <span className="text-xs text-muted-foreground">€</span>
                            </div>

                            {/* Quantity */}
                            <div className="flex items-center gap-1">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.id,
                                    Math.max(0.01, item.quantity - 1)
                                  )
                                }
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <Input
                                type="number"
                                min="0.01"
                                step="0.01"
                                value={item.quantity}
                                onChange={(e) =>
                                  handleQuantityChange(
                                    item.id,
                                    parseFloat(e.target.value) || 1
                                  )
                                }
                                className="w-16 text-center h-8 text-xs"
                              />
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() =>
                                  handleQuantityChange(item.id, item.quantity + 1)
                                }
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>

                            {/* Total */}
                            <div className="ml-auto font-semibold whitespace-nowrap">
                              {formatCurrency(item.total)}
                            </div>

                            {/* Delete */}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => onRemoveItem(item.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Description field */}
                      {showDescriptions[item.id] && (
                        <div className="mt-3 ml-8">
                          <Textarea
                            placeholder="Description optionnelle (visible sur le devis)..."
                            value={item.description || ""}
                            onChange={(e) =>
                              onUpdateItem(item.id, { description: e.target.value })
                            }
                            rows={2}
                            className="text-sm"
                          />
                        </div>
                      )}
                    </div>
                  ))
                )}

                {/* Add free line button */}
                <Dialog open={freeItemSection === section.id} onOpenChange={(open) => {
                  if (!open) setFreeItemSection(null);
                }}>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-muted-foreground hover:text-foreground"
                      onClick={() => setFreeItemSection(section.id)}
                    >
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Ajouter une ligne libre
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Ajouter une ligne libre</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Désignation *</Label>
                        <Input
                          placeholder="Nom de la prestation"
                          value={freeItemName}
                          onChange={(e) => setFreeItemName(e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-2">
                          <Label>Prix unitaire (€)</Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            value={freeItemPrice}
                            onChange={(e) => setFreeItemPrice(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Quantité</Label>
                          <Input
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={freeItemQty}
                            onChange={(e) => setFreeItemQty(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Unité</Label>
                          <Select value={freeItemUnit} onValueChange={setFreeItemUnit}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {UNIT_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Annuler</Button>
                      </DialogClose>
                      <Button onClick={handleAddFreeItem} disabled={!freeItemName.trim()}>
                        Ajouter
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CollapsibleContent>
            </Collapsible>
          );
        })}

        {items.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            Aucune prestation ajoutée. Utilisez le catalogue ci-dessus ou ajoutez une ligne libre.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

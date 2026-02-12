import { useState, useMemo } from "react";
import { Product, Trade } from "@/types/quote";
import { getProductsByTrade, getCategories } from "@/data/products";
import { saveCustomProduct, deleteCustomProduct } from "@/lib/custom-products";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
  DialogDescription,
} from "@/components/ui/dialog";
import { Search, Plus, Pencil, Trash2, PackagePlus } from "lucide-react";

interface ProductCatalogProps {
  trade: Trade;
  sectionId: string;
  onAddProduct: (product: Product, quantity: number, sectionId: string) => void;
}

export const ProductCatalog = ({ trade, sectionId, onAddProduct }: ProductCatalogProps) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [refreshKey, setRefreshKey] = useState(0);

  // Custom product dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [cpName, setCpName] = useState("");
  const [cpCategory, setCpCategory] = useState("");
  const [cpPrice, setCpPrice] = useState("");
  const [cpUnit, setCpUnit] = useState("unité");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const products = useMemo(() => getProductsByTrade(trade), [trade, refreshKey]);
  const categories = useMemo(() => getCategories(trade), [trade, refreshKey]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "all" || product.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  const handleQuantityChange = (productId: string, value: string) => {
    const qty = parseFloat(value) || 0;
    setQuantities((prev) => ({ ...prev, [productId]: qty }));
  };

  const handleAdd = (product: Product) => {
    if (!sectionId) return;
    const qty = quantities[product.id] || 1;
    onAddProduct(product, qty, sectionId);
    setQuantities((prev) => ({ ...prev, [product.id]: 0 }));
  };

  const openNewProduct = () => {
    setEditProduct(null);
    setCpName("");
    setCpCategory("");
    setCpPrice("");
    setCpUnit("unité");
    setDialogOpen(true);
  };

  const openEditProduct = (product: Product) => {
    setEditProduct(product);
    setCpName(product.name);
    setCpCategory(product.category);
    setCpPrice(String(product.unitPrice));
    setCpUnit(product.unit);
    setDialogOpen(true);
  };

  const handleSaveCustomProduct = () => {
    if (!cpName.trim()) return;
    const product: Product = {
      id: editProduct?.id || `custom-${crypto.randomUUID()}`,
      name: cpName.trim(),
      category: cpCategory.trim() || "Personnalisé",
      unitPrice: parseFloat(cpPrice) || 0,
      unit: cpUnit,
      trade,
    };
    saveCustomProduct(product);
    setDialogOpen(false);
    setRefreshKey((k) => k + 1);
  };

  const handleDeleteCustomProduct = (productId: string) => {
    deleteCustomProduct(productId);
    setRefreshKey((k) => k + 1);
  };

  const isCustom = (productId: string) => productId.startsWith("custom-");

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un produit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes catégories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" onClick={openNewProduct} className="shrink-0">
          <PackagePlus className="w-4 h-4 mr-2" />
          Mon produit
        </Button>
      </div>

      {/* Product list */}
      <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="flex items-center justify-between p-3 rounded-lg border bg-muted/20 hover:bg-muted/40 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium truncate">{product.name}</p>
                {isCustom(product.id) && (
                  <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                    Perso
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {product.unitPrice.toFixed(2)} € / {product.unit}
              </p>
            </div>
            <div className="flex items-center gap-2 ml-4">
              {isCustom(product.id) && (
                <>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditProduct(product)}>
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => handleDeleteCustomProduct(product.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </>
              )}
              <Input
                type="number"
                min="1"
                step="0.01"
                value={quantities[product.id] || ""}
                onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                placeholder="Qté"
                className="w-20 text-center"
              />
              <Button size="sm" onClick={() => handleAdd(product)} className="shrink-0">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
        {filteredProducts.length === 0 && (
          <p className="text-center text-muted-foreground py-8">Aucun produit trouvé</p>
        )}
      </div>

      {/* Custom product dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editProduct ? "Modifier le produit" : "Ajouter un produit"}</DialogTitle>
            <DialogDescription>
              {editProduct ? "Modifiez les informations du produit." : "Ajoutez un produit personnalisé à votre catalogue."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Nom *</Label>
              <Input placeholder="Nom du produit" value={cpName} onChange={(e) => setCpName(e.target.value)} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label>Prix (€)</Label>
                <Input type="number" min="0" step="0.01" placeholder="0.00" value={cpPrice} onChange={(e) => setCpPrice(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Unité</Label>
                <Select value={cpUnit} onValueChange={setCpUnit}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unité">Unité</SelectItem>
                    <SelectItem value="m²">m²</SelectItem>
                    <SelectItem value="mètre">Mètre</SelectItem>
                    <SelectItem value="ml">ML</SelectItem>
                    <SelectItem value="forfait">Forfait</SelectItem>
                    <SelectItem value="heure">Heure</SelectItem>
                    <SelectItem value="jour">Jour</SelectItem>
                    <SelectItem value="lot">Lot</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Catégorie</Label>
                <Input placeholder="Ex: Éclairage" value={cpCategory} onChange={(e) => setCpCategory(e.target.value)} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Annuler</Button>
            </DialogClose>
            <Button onClick={handleSaveCustomProduct} disabled={!cpName.trim()}>
              {editProduct ? "Modifier" : "Ajouter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

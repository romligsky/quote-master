import { useState, useMemo } from "react";
import { Product, Trade, QuoteItem } from "@/types/quote";
import { getProductsByTrade, getCategories } from "@/data/products";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Package, Search, Plus } from "lucide-react";

interface ProductCatalogProps {
  trade: Trade;
  onAddProduct: (product: Product, quantity: number) => void;
}

export const ProductCatalog = ({ trade, onAddProduct }: ProductCatalogProps) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const products = getProductsByTrade(trade);
  const categories = getCategories(trade);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory = category === "all" || product.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  const handleQuantityChange = (productId: string, value: string) => {
    const qty = parseInt(value) || 0;
    setQuantities((prev) => ({ ...prev, [productId]: qty }));
  };

  const handleAdd = (product: Product) => {
    const qty = quantities[product.id] || 1;
    onAddProduct(product, qty);
    setQuantities((prev) => ({ ...prev, [product.id]: 0 }));
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Package className="w-5 h-5 text-primary" />
          Catalogue produits
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
        </div>

        {/* Product list */}
        <div className="max-h-[400px] overflow-y-auto space-y-2 pr-2">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-muted/20 hover:bg-muted/40 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{product.name}</p>
                <p className="text-sm text-muted-foreground">
                  {product.unitPrice.toFixed(2)} € / {product.unit}
                </p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Input
                  type="number"
                  min="1"
                  value={quantities[product.id] || ""}
                  onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                  placeholder="Qté"
                  className="w-20 text-center"
                />
                <Button
                  size="sm"
                  onClick={() => handleAdd(product)}
                  className="shrink-0"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
          {filteredProducts.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              Aucun produit trouvé
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

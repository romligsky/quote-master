import { motion } from "framer-motion";
import { Zap, Hammer } from "lucide-react";
import { Trade } from "@/types/quote";

interface TradeSelectorProps {
  selectedTrade: Trade | null;
  onSelect: (trade: Trade) => void;
}

export const TradeSelector = ({ selectedTrade, onSelect }: TradeSelectorProps) => {
  const trades = [
    {
      id: "electrician" as Trade,
      name: "Électricien",
      icon: Zap,
      description: "Tableaux, câblage, appareillage...",
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "carpenter" as Trade,
      name: "Menuisier",
      icon: Hammer,
      description: "Portes, fenêtres, parquet...",
      color: "from-amber-500 to-amber-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Sélectionnez votre métier</h2>
        <p className="text-muted-foreground">
          Le catalogue sera adapté à votre activité
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {trades.map((trade) => (
          <motion.button
            key={trade.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(trade.id)}
            className={`p-6 rounded-2xl border-2 text-left transition-all ${
              selectedTrade === trade.id
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
          >
            <div
              className={`w-14 h-14 rounded-xl bg-gradient-to-br ${trade.color} flex items-center justify-center mb-4`}
            >
              <trade.icon className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-1">{trade.name}</h3>
            <p className="text-muted-foreground">{trade.description}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

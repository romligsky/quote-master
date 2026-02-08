import { motion } from "framer-motion";
import { Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Gratuit",
    price: "0€",
    period: "pour toujours",
    description: "Parfait pour commencer et tester l'outil",
    features: [
      "5 devis par mois",
      "Export PDF basique",
      "Catalogue produits standard",
      "Calculs automatiques",
      "Stockage local",
    ],
    cta: "Commencer gratuitement",
    popular: false,
  },
  {
    name: "Pro",
    price: "19€",
    period: "par mois",
    description: "Pour les artisans actifs qui veulent gagner du temps",
    features: [
      "Devis illimités",
      "Export PDF personnalisé avec logo",
      "Catalogue produits complet",
      "Templates par métier",
      "Historique complet",
      "Support prioritaire",
      "Synchronisation cloud (bientôt)",
    ],
    cta: "Passer Pro",
    popular: true,
  },
];

export const PricingSection = () => {
  return (
    <section className="py-24 gradient-subtle" id="pricing">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Tarifs <span className="text-gradient">simples et transparents</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Commencez gratuitement, passez Pro quand vous êtes prêt.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative p-8 rounded-2xl border bg-card ${
                plan.popular ? "border-primary shadow-electric" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-sm font-medium flex items-center gap-1">
                  <Zap className="w-4 h-4" />
                  Populaire
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">/ {plan.period}</span>
                </div>
                <p className="text-muted-foreground mt-2">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-success shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                className="w-full"
                variant={plan.popular ? "default" : "outline"}
                size="lg"
              >
                <Link to="/devis">{plan.cta}</Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

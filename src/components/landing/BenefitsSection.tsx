import { motion } from "framer-motion";
import { Clock, FileCheck, Calculator, Smartphone, PiggyBank, Shield } from "lucide-react";

const benefits = [
  {
    icon: Clock,
    title: "Gain de temps",
    description: "Créez un devis complet en moins de 5 minutes au lieu de 30 minutes sur Excel.",
  },
  {
    icon: FileCheck,
    title: "Devis professionnels",
    description: "Export PDF avec votre logo, mentions légales et mise en page soignée.",
  },
  {
    icon: Calculator,
    title: "Calculs automatiques",
    description: "Marge, TVA, remises... Tous les calculs sont faits automatiquement.",
  },
  {
    icon: Smartphone,
    title: "Accessible partout",
    description: "Utilisable sur téléphone ou tablette, directement sur le chantier.",
  },
  {
    icon: PiggyBank,
    title: "Gratuit pour démarrer",
    description: "Commencez sans payer. Passez Pro quand vous êtes convaincu.",
  },
  {
    icon: Shield,
    title: "Données sécurisées",
    description: "Vos devis sont sauvegardés localement et restent confidentiels.",
  },
];

export const BenefitsSection = () => {
  return (
    <section className="py-24 bg-background" id="benefits">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pourquoi choisir <span className="text-gradient">DevisElec Pro</span> ?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Un outil pensé par et pour les artisans. Simple, efficace, professionnel.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group p-6 rounded-2xl border bg-card hover:shadow-lg hover:border-primary/20 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <benefit.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
              <p className="text-muted-foreground">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

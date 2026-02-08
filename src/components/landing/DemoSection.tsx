import { motion } from "framer-motion";
import { Play, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const steps = [
  "Sélectionnez votre métier (électricien ou menuisier)",
  "Renseignez les informations client",
  "Ajoutez vos prestations depuis le catalogue",
  "Ajustez votre marge et les remises",
  "Exportez votre devis en PDF professionnel",
];

export const DemoSection = () => {
  return (
    <section className="py-24 gradient-subtle" id="demo">
      <div className="container px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Video/Image placeholder */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl border-2 border-dashed border-primary/30 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Play className="w-10 h-10 text-primary ml-1" />
                </div>
                <p className="text-muted-foreground">Vidéo démo à venir</p>
              </div>
            </div>
            
            {/* Floating badge */}
            <motion.div
              className="absolute -bottom-4 -right-4 bg-card px-4 py-2 rounded-xl shadow-lg border"
              animate={{ rotate: [0, 2, 0, -2, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <span className="text-sm font-medium">⚡ En 3 minutes chrono</span>
            </motion.div>
          </motion.div>

          {/* Right - Steps */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Comment ça marche ?
              </h2>
              <p className="text-lg text-muted-foreground">
                5 étapes simples pour créer un devis professionnel.
              </p>
            </div>

            <div className="space-y-4">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-start gap-4 p-4 rounded-xl bg-card border hover:border-primary/30 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{step}</p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                </motion.div>
              ))}
            </div>

            <Button asChild size="lg" className="shadow-electric">
              <Link to="/devis">
                Essayer maintenant
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

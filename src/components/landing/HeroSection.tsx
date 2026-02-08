import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, FileText, Calculator } from "lucide-react";
import { Link } from "react-router-dom";

export const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-subtle" />
      
      {/* Floating elements */}
      <motion.div
        className="absolute top-20 right-10 w-20 h-20 rounded-2xl bg-primary/10 hidden lg:block"
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-32 left-20 w-16 h-16 rounded-full bg-primary/5 hidden lg:block"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
      
      <div className="container relative z-10 px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Zap className="w-4 h-4" />
              <span>Pour Électriciens & Menuisiers</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Créez vos devis
              <span className="text-gradient block mt-2">en quelques clics</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-lg">
              Fini les heures passées sur Excel. Générez des devis professionnels 
              automatiquement avec calculs de marge, TVA et export PDF instantané.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="shadow-electric text-lg px-8">
                <Link to="/devis">
                  Créer mon devis gratuit
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg">
                <a href="#demo">
                  Voir la démo
                </a>
              </Button>
            </div>
            
            {/* Stats */}
            <div className="flex gap-8 pt-4">
              <div>
                <p className="text-3xl font-bold text-foreground">3 min</p>
                <p className="text-sm text-muted-foreground">par devis en moyenne</p>
              </div>
              <div className="w-px bg-border" />
              <div>
                <p className="text-3xl font-bold text-foreground">100%</p>
                <p className="text-sm text-muted-foreground">gratuit pour commencer</p>
              </div>
            </div>
          </motion.div>
          
          {/* Right - App preview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative bg-card rounded-2xl shadow-2xl border overflow-hidden">
              {/* Mock app header */}
              <div className="bg-muted/50 px-4 py-3 border-b flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-destructive/60" />
                  <div className="w-3 h-3 rounded-full bg-warning/60" />
                  <div className="w-3 h-3 rounded-full bg-success/60" />
                </div>
                <span className="text-xs text-muted-foreground ml-2">DevisElec Pro</span>
              </div>
              
              {/* Mock app content */}
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl">
                  <FileText className="w-10 h-10 text-primary" />
                  <div>
                    <p className="font-semibold">Nouveau devis</p>
                    <p className="text-sm text-muted-foreground">Client: Martin Dupont</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between p-3 bg-muted/20 rounded-lg">
                    <span className="text-sm">Tableau électrique 13 modules</span>
                    <span className="font-medium">245,00 €</span>
                  </div>
                  <div className="flex justify-between p-3 bg-muted/20 rounded-lg">
                    <span className="text-sm">Interrupteur différentiel 40A</span>
                    <span className="font-medium">89,00 €</span>
                  </div>
                  <div className="flex justify-between p-3 bg-muted/20 rounded-lg">
                    <span className="text-sm">Main d'œuvre (4h)</span>
                    <span className="font-medium">180,00 €</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total TTC</span>
                    <span className="text-2xl font-bold text-primary">617,28 €</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating calculator badge */}
            <motion.div
              className="absolute -bottom-4 -left-4 bg-card p-4 rounded-xl shadow-lg border"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Calculator className="w-8 h-8 text-primary" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

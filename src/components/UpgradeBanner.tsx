import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export const UpgradeBanner = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9 }}
      className="glass-card rounded-xl p-6 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 border-2 border-primary/30 neon-glow"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-gradient-to-br from-primary to-secondary">
            <Sparkles className="w-6 h-6 text-background" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gradient">Upgrade to FundFluence Pro</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Unlock advanced AI insights, custom reports, and priority support
            </p>
          </div>
        </div>
        <Button size="lg" className="neon-glow-teal">
          Upgrade Now
        </Button>
      </div>
    </motion.div>
  );
};

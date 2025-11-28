import { TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export const ForecastCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="glass-card rounded-xl p-6 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10"
    >
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-lg bg-gradient-to-br from-primary to-secondary neon-glow">
          <TrendingUp className="w-6 h-6 text-background" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-2">AI Forecast 🤖</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Based on your current trajectory and market trends
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gradient">$28,450</span>
            <span className="text-sm text-muted-foreground">predicted next month</span>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-secondary font-medium"
            >
              ↑ 24.5%
            </motion.div>
            <span className="text-sm text-muted-foreground">growth expected</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

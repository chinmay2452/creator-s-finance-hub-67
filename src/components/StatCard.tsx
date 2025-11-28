import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  delay?: number;
}

export const StatCard = ({ title, value, icon: Icon, trend, trendUp, delay = 0 }: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="glass-card rounded-xl p-6 hover:neon-glow transition-all duration-300 cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        {trend && (
          <span className={`text-sm font-medium ${trendUp ? 'text-secondary' : 'text-destructive'}`}>
            {trendUp ? '↑' : '↓'} {trend}
          </span>
        )}
      </div>
      <h3 className="text-sm text-muted-foreground mb-1">{title}</h3>
      <p className="text-3xl font-bold text-foreground">{value}</p>
    </motion.div>
  );
};

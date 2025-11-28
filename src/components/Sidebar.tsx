import { LayoutDashboard, DollarSign, TrendingUp, Bot, Target, Settings, Store } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { motion } from "framer-motion";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: DollarSign, label: "Earnings", path: "/earnings" },
  { icon: TrendingUp, label: "Insights", path: "/insights" },
  { icon: Bot, label: "AI Money Buddy", path: "/ai-buddy" },
  { icon: Target, label: "Goals", path: "/goals" },
  { icon: Store, label: "Marketplace", path: "/marketplace" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 glass-card border-r border-white/10 p-4">
      <nav className="space-y-2">
        {navItems.map((item, index) => (
          <motion.div
            key={item.path}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <NavLink
              to={item.path}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all duration-200"
              activeClassName="bg-gradient-to-r from-primary/20 to-secondary/20 text-foreground neon-glow"
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          </motion.div>
        ))}
      </nav>
    </aside>
  );
};

import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const data7d = [
  { name: "Mon", earnings: 2400 },
  { name: "Tue", earnings: 1398 },
  { name: "Wed", earnings: 9800 },
  { name: "Thu", earnings: 3908 },
  { name: "Fri", earnings: 4800 },
  { name: "Sat", earnings: 3800 },
  { name: "Sun", earnings: 4300 },
];

const data30d = [
  { name: "Week 1", earnings: 12000 },
  { name: "Week 2", earnings: 15000 },
  { name: "Week 3", earnings: 18000 },
  { name: "Week 4", earnings: 22000 },
];

const data6m = [
  { name: "Jan", earnings: 45000 },
  { name: "Feb", earnings: 52000 },
  { name: "Mar", earnings: 48000 },
  { name: "Apr", earnings: 61000 },
  { name: "May", earnings: 55000 },
  { name: "Jun", earnings: 67000 },
];

const filters = [
  { label: "7D", data: data7d },
  { label: "30D", data: data30d },
  { label: "6M", data: data6m },
];

export const EarningsChart = () => {
  const [activeFilter, setActiveFilter] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass-card rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">Earnings Over Time 📈</h2>
        <div className="flex gap-2">
          {filters.map((filter, index) => (
            <Button
              key={filter.label}
              variant={activeFilter === index ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveFilter(index)}
              className={activeFilter === index ? "neon-glow" : ""}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={filters[activeFilter].data}>
          <defs>
            <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.1} />
          <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
          <YAxis stroke="hsl(var(--muted-foreground))" />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
          />
          <Line
            type="monotone"
            dataKey="earnings"
            stroke="hsl(var(--primary))"
            strokeWidth={3}
            dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: "hsl(var(--secondary))" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

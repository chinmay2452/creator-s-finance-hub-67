import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { motion } from "framer-motion";

const defaultData = [
  { name: "YouTube", value: 35, color: "#FF0000" },
  { name: "Instagram", value: 28, color: "#E1306C" },
  { name: "Freelancing", value: 22, color: "hsl(var(--secondary))" },
  { name: "Brand Deals", value: 15, color: "hsl(var(--accent))" },
];

export const IncomeDistribution = () => {
  const selectedPlatformNames = (() => {
    try {
      const p = JSON.parse(localStorage.getItem("creatorProfile") || "{}");
      const map: Record<string, string> = {
        instagram: "Instagram",
        youtube: "YouTube",
        tiktok: "TikTok",
        snapchat: "Snapchat",
        facebook: "Facebook",
        linkedin: "LinkedIn",
        x: "X",
      };
      return (p.platforms || []).map((key: string) => map[key]).filter(Boolean);
    } catch {
      return [];
    }
  })();
  const colors: Record<string, string> = {
    YouTube: "#FF0000",
    Instagram: "#E1306C",
    TikTok: "#111111",
    Snapchat: "#FFFC00",
    Facebook: "#1877F2",
    LinkedIn: "#0A66C2",
    X: "#000000",
  };
  const chartData = selectedPlatformNames.length
    ? selectedPlatformNames.map((name) => ({ name, value: 1, color: colors[name] || "hsl(var(--primary))" }))
    : defaultData;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="glass-card rounded-xl p-6"
    >
      <h2 className="text-xl font-bold text-foreground mb-6">Income Distribution 💰</h2>
      
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

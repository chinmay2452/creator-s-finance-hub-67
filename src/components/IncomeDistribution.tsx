import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { motion } from "framer-motion";

const data = [
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
  const chartData = selectedPlatformNames.length ? data.filter((d) => selectedPlatformNames.includes(d.name)) : data;
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

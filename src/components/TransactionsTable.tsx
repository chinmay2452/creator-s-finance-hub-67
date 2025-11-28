import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const transactions = [
  {
    id: 1,
    platform: "YouTube",
    amount: "₹1,250",
    status: "Received",
    date: "Nov 25, 2025",
    logo: "🎥",
  },
  {
    id: 2,
    platform: "Instagram",
    amount: "₹890",
    status: "Pending",
    date: "Nov 24, 2025",
    logo: "📸",
  },
  {
    id: 3,
    platform: "Brand Deal",
    amount: "₹3,500",
    status: "Received",
    date: "Nov 23, 2025",
    logo: "🤝",
  },
  {
    id: 4,
    platform: "Freelancing",
    amount: "₹620",
    status: "Received",
    date: "Nov 22, 2025",
    logo: "💼",
  },
];

export const TransactionsTable = () => {
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
  const filtered = selectedPlatformNames.length ? transactions.filter((t) => selectedPlatformNames.includes(t.platform)) : transactions;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="glass-card rounded-xl p-6"
    >
      <h2 className="text-xl font-bold text-foreground mb-6">Recent Transactions</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Platform</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((transaction, index) => (
              <motion.tr
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{transaction.logo}</span>
                    <span className="font-medium text-foreground">{transaction.platform}</span>
                  </div>
                </td>
                <td className="py-4 px-4 font-semibold text-foreground">{transaction.amount}</td>
                <td className="py-4 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      transaction.status === "Received"
                        ? "bg-secondary/20 text-secondary"
                        : "bg-accent/20 text-accent"
                    }`}
                  >
                    {transaction.status}
                  </span>
                </td>
                <td className="py-4 px-4 text-muted-foreground">{transaction.date}</td>
                <td className="py-4 px-4 text-right">
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary">
                    Details
                  </Button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};
